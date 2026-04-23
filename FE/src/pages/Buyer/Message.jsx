import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import TopNavBar from '../../components/TopNavBar';
import Footer from '../../components/Footer';
import * as signalR from '@microsoft/signalr';

const API_BASE = '/api/v1';
const HUB_URL  = 'https://swp391-bike-marketplace-backend-1.onrender.com/chatHub';

export default function Message() {
  const { currentUser } = useAuth();
  const token    = currentUser?.token;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── State ────────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState([]);
  const [convLoading, setConvLoading]     = useState(true);

  const [activeConvId, setActiveConvId] = useState(null);
  const [convDetail, setConvDetail]     = useState(null);
  const [messages, setMessages]         = useState([]);
  const [msgPage, setMsgPage]           = useState(1);
  const [msgHasMore, setMsgHasMore]     = useState(false);
  const [msgLoading, setMsgLoading]     = useState(false);

  const [inputText, setInputText] = useState('');
  const [sending, setSending]     = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const messagesEndRef        = useRef(null);
  const connectionRef         = useRef(null);
  const activeConvIdRef       = useRef(null);
  const openedFromUrlRef      = useRef(null);
  const currentUserIdRef      = useRef(null);
  const fetchConversationsRef = useRef(null); // always points to latest fetchConversations

  // ── Auth header helper ───────────────────────────────────────────────────
  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // ════════════════════════════════════════════════════════════════════════
  // 1. SignalR — init once when token is available
  // ════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!token) return;

    // Update currentUserIdRef to avoid stale closure
    currentUserIdRef.current = currentUser?.id;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // ── Receive new message ──────────────────────────────────────────────
    connection.on('ReceiveMessage', (message) => {
      const incomingConvId = message.conversationId ?? message.ConversationId;
      const incomingSenderId = String(message.senderId ?? message.SenderId);
      const currentUserId = String(currentUserIdRef.current);

      // Append to open chat (deduplicate by id + handle optimistic update)
      if (incomingConvId === activeConvIdRef.current) {
        setMessages(prevMessages => {
          // 1. Check if message already exists (avoid duplicate)
          if (prevMessages.some(m => m.id === message.id)) return prevMessages;

          // 2. If this is MY message (echo from server), replace optimistic bubble
          if (incomingSenderId === currentUserId) {
            const optimisticIndex = prevMessages.findIndex(
              m => m.isOptimistic && m.content === message.content
            );
            if (optimisticIndex !== -1) {
              const updated = [...prevMessages];
              updated[optimisticIndex] = {
                ...message,
                isMine: true,
                isOptimistic: false,
              };
              return updated;
            }
          }

          // 3. Otherwise, append new message
          return [...prevMessages, {
            ...message,
            isMine: incomingSenderId === currentUserId,
          }];
        });
      }

      // Update sidebar: last message preview + unread badge
      setConversations(prev =>
        prev.map(c =>
          c.id === incomingConvId
            ? {
                ...c,
                lastMessage: message.content,
                unreadCount:
                  incomingConvId === activeConvIdRef.current
                    ? 0
                    : (c.unreadCount ?? 0) + 1,
              }
            : c
        )
      );

      // Refresh sidebar list for any other metadata changes
      fetchConversationsRef.current?.(true);
    });

    connection
      .start()
      .catch(err => console.warn('[SignalR] start failed:', err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentUser?.id]);

  // ════════════════════════════════════════════════════════════════════════
  // Fetch conversation list
  // ════════════════════════════════════════════════════════════════════════
  const fetchConversations = useCallback(async (silent = false) => {
    if (!token) { setConvLoading(false); return; }
    if (!silent) setConvLoading(true);
    try {
      const res = await fetch(`${API_BASE}/messaging/conversations`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      console.log('[fetchConversations] raw data:', data);
      const list = Array.isArray(data) ? data : (data.conversations ?? data.items ?? []);
      if (silent && list.length === 0) return;
      setConversations(list);
    } catch {
      if (!silent) setConversations([]);
    } finally {
      if (!silent) setConvLoading(false);
    }
  }, [token, authHeaders]);

  // Keep ref always up-to-date
  useEffect(() => { fetchConversationsRef.current = fetchConversations; }, [fetchConversations]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ════════════════════════════════════════════════════════════════════════
  // Fetch messages (REST — initial load + load-more)
  // ════════════════════════════════════════════════════════════════════════
  const fetchMessages = useCallback(async (convId, page = 1, append = false) => {
    if (!token || !convId) return;
    if (page === 1) setMsgLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/messaging/conversations/${convId}/messages?page=${page}&pageSize=50`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data  = await res.json();
      console.log('[fetchMessages] raw data:', data);
      const items = Array.isArray(data) ? data : (data.messages ?? data.items ?? []);
      const total = data.totalCount ?? data.total ?? items.length;
      
      // Ensure isMine is correctly set for each message
      const currentUserId = String(currentUser?.id);
      const ordered = items.map(msg => ({
        ...msg,
        isMine: String(msg.senderId) === currentUserId,
      }));
      
      setMessages(prevMessages => {
        if (append) {
          // Load more: prepend older messages (avoid duplicates)
          const existingIds = new Set(prevMessages.map(m => m.id));
          const newMessages = ordered.filter(m => !existingIds.has(m.id));
          return [...newMessages, ...prevMessages];
        } else {
          // Initial load: replace all
          return ordered;
        }
      });
      
      setMsgHasMore(page * 50 < total);
    } catch (err) {
      console.error('[fetchMessages] error:', err.message);
    } finally {
      if (page === 1) setMsgLoading(false);
    }
  }, [token, authHeaders, currentUser?.id]);

  // ════════════════════════════════════════════════════════════════════════
  // 2. Open a conversation
  // ════════════════════════════════════════════════════════════════════════
  const openConversation = useCallback(async (convId) => {
    if (!token || !convId) return;

    setActiveConvId(convId);
    activeConvIdRef.current = convId;
    currentUserIdRef.current = currentUser?.id; // Update ref
    setMessages([]);
    setMsgPage(1);
    setMsgHasMore(false);
    setConvDetail(null);

    // Access check — non-blocking
    fetch(`${API_BASE}/messaging/conversations/${convId}/access`, {
      headers: authHeaders(),
    }).catch(() => {});

    // Conversation detail (header: seller name, listing card)
    let detailData = null;
    try {
      const det = await fetch(`${API_BASE}/messaging/conversations/${convId}`, {
        headers: authHeaders(),
      });
      if (det.ok) {
        detailData = await det.json();
        setConvDetail(detailData);
      }
    } catch { /* ignore */ }

    // Load message history via REST
    await fetchMessages(convId, 1, false);

    // Join SignalR room
    const conn = connectionRef.current;
    if (conn?.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke('JoinConversation', convId);
      } catch (e) {
        console.warn('[SignalR] JoinConversation failed:', e);
      }
    }

    // Mark as read — REST + SignalR in parallel
    fetch(`${API_BASE}/messaging/conversations/${convId}/read`, {
      method: 'PUT',
      headers: authHeaders(),
    }).then(() => {
      setConversations(prev =>
        prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c)
      );
    }).catch(() => {});

    if (conn?.state === signalR.HubConnectionState.Connected) {
      conn.invoke('MarkAsRead', convId).catch(() => {});
    }

    // Refresh sidebar — sau đó đảm bảo conversation hiện tại luôn có trong list
    fetchConversations(true).then(() => {
      setConversations(prev => {
        if (prev.some(c => c.id === convId)) return prev;
        // Conversation chưa có trong list (vừa tạo mới) → tự thêm từ detailData
        return [{
          id: convId,
          otherUserName: detailData?.sellerName ?? detailData?.otherUserName ?? detailData?.buyerName ?? 'Người dùng',
          listingTitle: detailData?.listingTitle ?? '',
          listingImage: detailData?.listingImage ?? detailData?.listingImageUrl ?? '',
          lastMessage: null,
          unreadCount: 0,
        }, ...prev];
      });
    });
  }, [token, authHeaders, fetchMessages, fetchConversations, currentUser?.id]);

  // ── Auto-open from ?conversationId= URL param ────────────────────────────
  useEffect(() => {
    const qId = searchParams.get('conversationId');
    if (!qId || convLoading) return;
    const numId = Number(qId);
    if (openedFromUrlRef.current === numId) return;
    openedFromUrlRef.current = numId;
    // Add placeholder so sidebar highlights immediately
    setConversations(prev => {
      if (prev.some(c => c.id === numId)) return prev;
      return [{ id: numId, otherUserName: 'Đang tải...', unreadCount: 0 }, ...prev];
    });
    openConversation(numId);
  }, [searchParams, convLoading, openConversation]);

  // ── Scroll to bottom on new messages ────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ════════════════════════════════════════════════════════════════════════
  // 3. Send message — SignalR first, REST fallback
  // ════════════════════════════════════════════════════════════════════════
  async function handleSend(e) {
    e.preventDefault();
    const content = inputText.trim();
    if (!content || !activeConvId || sending) return;

    setSending(true);
    setInputText('');

    // Optimistic bubble with temporary ID
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMsg = {
      id: tempId,
      content,
      senderId: currentUser?.id,
      isMine: true,
      sentAt: new Date().toISOString(),
      isOptimistic: true,
    };
    
    setMessages(prevMessages => [...prevMessages, optimisticMsg]);

    const conn = connectionRef.current;
    let sentViaHub = false;

    // Cách 1: SignalR
    if (conn?.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke('SendMessage', activeConvId, content, 'Text');
        sentViaHub = true;
        // SignalR will trigger ReceiveMessage which will replace optimistic bubble
      } catch (e) {
        console.warn('[SignalR] SendMessage failed, falling back to REST:', e);
      }
    }

    // Cách 2: REST fallback
    if (!sentViaHub) {
      try {
        const res = await fetch(
          `${API_BASE}/messaging/conversations/${activeConvId}/messages`,
          {
            method: 'POST',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, messageType: 'Text' }),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const realMessage = await res.json();
        
        // Replace optimistic bubble with real message
        setMessages(prevMessages => {
          const index = prevMessages.findIndex(m => m.id === tempId);
          if (index === -1) return prevMessages;
          
          const updated = [...prevMessages];
          updated[index] = {
            ...realMessage,
            isMine: true,
            isOptimistic: false,
          };
          return updated;
        });
        
        fetchConversations(true);
      } catch (err) {
        console.error('[handleSend] REST fallback failed:', err.message);
        // Keep optimistic bubble but mark as failed
        setMessages(prevMessages =>
          prevMessages.map(m =>
            m.id === tempId ? { ...m, isFailed: true } : m
          )
        );
      }
    }

    setSending(false);
  }

  function handleLoadMore() {
    const next = msgPage + 1;
    setMsgPage(next);
    fetchMessages(activeConvId, next, true);
  }

  // ── Not logged in ────────────────────────────────────────────────────────
  if (!token) {
    return (
      <>
        <TopNavBar />
        <main className="min-h-screen bg-surface flex items-center justify-center" style={{ marginTop: '80px' }}>
          <div className="text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant">chat</span>
            <p className="text-on-surface-variant">Vui lòng đăng nhập để xem tin nhắn.</p>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90"
            >
              Đăng nhập
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Main layout ──────────────────────────────────────────────────────────
  return (
    <>
      <TopNavBar />
      <div
        className="flex bg-white overflow-hidden"
        style={{ height: 'calc(100vh - 80px)', marginTop: '80px' }}
      >
      {/* ── Sidebar ── */}
      <aside className="w-80 shrink-0 border-r border-outline-variant/20 flex flex-col bg-surface-container-lowest">
        <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">MESSAGES</h2>
            <p className="font-headline text-xl font-bold text-on-surface">Tin nhắn</p>
          </div>
          <button
            onClick={fetchConversations}
            title="Làm mới"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">refresh</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-surface-container shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface-container rounded w-2/3" />
                  <div className="h-2.5 bg-surface-container rounded w-1/2" />
                </div>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">chat_bubble</span>
              <p className="text-sm font-medium text-on-surface-variant">Chưa có cuộc trò chuyện nào</p>
              <p className="text-xs text-on-surface-variant/70 mt-1">Hãy chat với người bán từ trang sản phẩm</p>
            </div>
          ) : (
            conversations.map(conv => {
              const isActive  = activeConvId === conv.id;
              const hasUnread = (conv.unreadCount ?? 0) > 0;
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-outline-variant/10
                    ${isActive ? 'bg-primary/10 border-r-4 border-r-primary' : 'hover:bg-surface-container'}`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0 flex items-center justify-center">
                    {(conv.listingImage ?? conv.listingImageUrl)
                      ? <img src={conv.listingImage ?? conv.listingImageUrl} alt="" className="w-full h-full object-cover" />
                      : <span className="material-symbols-outlined text-xl text-on-surface-variant">directions_bike</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-sm truncate ${hasUnread ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                        {conv.otherUserName ?? conv.sellerName ?? conv.buyerName ?? 'Người dùng'}
                      </p>
                      {hasUnread && (
                        <span className="shrink-0 min-w-[18px] h-[18px] bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${hasUnread ? 'text-on-surface font-medium' : 'text-on-surface-variant/70'}`}>
                      {conv.listingTitle ?? (typeof conv.lastMessage === 'string' ? conv.lastMessage : conv.lastMessage?.content) ?? ''}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!activeConvId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-surface-container-lowest">
            <span className="material-symbols-outlined text-7xl text-on-surface-variant/20 mb-4">forum</span>
            <p className="text-on-surface font-medium">Chọn một cuộc trò chuyện để bắt đầu</p>
            <p className="text-on-surface-variant text-sm mt-1">Hoặc chat với người bán từ trang sản phẩm</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant/20 bg-white flex items-center gap-3 shrink-0 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-primary">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-on-surface truncate">
                  {convDetail?.otherUserName ?? convDetail?.sellerName ?? convDetail?.buyerName ?? 'Người dùng'}
                </p>
                <p className="text-xs text-on-surface-variant">Người bán</p>
              </div>
              {(convDetail?.listingTitle || convDetail?.listingImage || convDetail?.listingImageUrl) && (
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 max-w-[280px] shrink-0">
                  {(convDetail.listingImage ?? convDetail.listingImageUrl) && (
                    <img
                      src={convDetail.listingImage ?? convDetail.listingImageUrl}
                      alt=""
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate leading-tight">
                      {convDetail.listingTitle}
                    </p>
                    {convDetail.listingPrice != null && (
                      <p className="text-xs text-primary font-bold leading-tight mt-0.5">
                        {Number(convDetail.listingPrice).toLocaleString('vi-VN')}₫
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-surface-container-lowest">
              {msgHasMore && (
                <div className="flex justify-center pb-2">
                  <button
                    onClick={handleLoadMore}
                    disabled={msgLoading}
                    className="text-xs text-primary font-semibold hover:underline disabled:opacity-50 bg-white px-4 py-1.5 rounded-full border border-outline-variant/20 shadow-sm"
                  >
                    {msgLoading ? 'Đang tải...' : '↑ Tải tin nhắn cũ hơn'}
                  </button>
                </div>
              )}
              {msgLoading && messages.length === 0 && (
                <div className="flex justify-center py-12">
                  <span className="material-symbols-outlined animate-spin text-primary text-3xl">
                    progress_activity
                  </span>
                </div>
              )}
              {messages.map((msg, idx) => {
                // FIX: Force string comparison to avoid Number vs String mismatch
                const isMine = String(msg.senderId) === String(currentUser?.id);
                return (
                  <div key={msg.id ?? idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${isMine
                          ? 'bg-primary text-on-primary rounded-br-none'
                          : 'bg-white text-on-surface rounded-bl-none border border-outline-variant/20'
                        } ${msg.isOptimistic ? 'opacity-60' : ''} ${msg.isFailed ? 'opacity-40 border-error' : ''}`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
                        {(msg.sentAt ?? msg.createdAt)
                          ? (() => {
                              const raw = msg.sentAt ?? msg.createdAt;
                              // Ensure UTC parsing — append Z if no timezone info
                              const utc = /[Zz]|[+-]\d{2}:?\d{2}$/.test(raw) ? raw : raw + 'Z';
                              return new Date(utc).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Asia/Ho_Chi_Minh',
                              });
                            })()
                          : ''}
                        {msg.isOptimistic && ' · Đang gửi...'}
                        {msg.isFailed && ' · Gửi thất bại'}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="px-4 py-3 border-t border-outline-variant/20 bg-white flex items-center gap-3 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 shrink-0"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
    </>
  );
}
