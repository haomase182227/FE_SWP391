import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
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
  const messagesEndRef   = useRef(null);
  const connectionRef    = useRef(null);   // SignalR HubConnection
  const activeConvIdRef  = useRef(null);   // mirror of activeConvId for SignalR handler
  const openedFromUrlRef = useRef(null);   // prevent double-open from URL param

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

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // ── Receive new message ──────────────────────────────────────────────
    connection.on('ReceiveMessage', (message) => {
      const incomingConvId = message.conversationId ?? message.ConversationId;

      // Append to open chat (deduplicate by id)
      if (incomingConvId === activeConvIdRef.current) {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          // Replace matching optimistic bubble if content matches
          const withoutOpt = prev.filter(
            m => !(m.isOptimistic && m.content === message.content)
          );
          return [...withoutOpt, message];
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
      fetchConversations(true);
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
  }, [token]);

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
      // Nếu API trả về rỗng nhưng đang silent refresh → giữ nguyên list cũ
      if (silent && list.length === 0) return;
      setConversations(list);
    } catch {
      if (!silent) setConversations([]);
    } finally {
      if (!silent) setConvLoading(false);
    }
  }, [token, authHeaders]);

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
      // API trả về oldest-first (id tăng dần) — không cần reverse
      const ordered = [...items];
      setMessages(prev => append ? [...ordered, ...prev] : ordered);
      setMsgHasMore(page * 50 < total);
    } catch (err) {
      console.error('[fetchMessages] error:', err.message);
    } finally {
      if (page === 1) setMsgLoading(false);
    }
  }, [token, authHeaders]);

  // ════════════════════════════════════════════════════════════════════════
  // 2. Open a conversation
  // ════════════════════════════════════════════════════════════════════════
  const openConversation = useCallback(async (convId) => {
    if (!token || !convId) return;

    setActiveConvId(convId);
    activeConvIdRef.current = convId;
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
  }, [token, authHeaders, fetchMessages, fetchConversations]);

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

    // Optimistic bubble
    setMessages(prev => [...prev, {
      id: `opt-${Date.now()}`,
      content,
      senderId: currentUser?.id,
      isMine: true,
      sentAt: new Date().toISOString(),
      isOptimistic: true,
    }]);

    const conn = connectionRef.current;
    let sentViaHub = false;

    // Cách 1: SignalR
    if (conn?.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke('SendMessage', activeConvId, content, 'Text');
        sentViaHub = true;
      } catch (e) {
        console.warn('[SignalR] SendMessage failed, falling back to REST:', e);
      }
    }

    // Cách 2: REST fallback
    if (!sentViaHub) {
      try {
        await fetch(
          `${API_BASE}/messaging/conversations/${activeConvId}/messages`,
          {
            method: 'POST',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, messageType: 'Text' }),
          }
        );
        // Reload messages to replace optimistic bubble with real data
        await fetchMessages(activeConvId, 1, false);
        fetchConversations(true);
      } catch { /* keep optimistic bubble */ }
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
      <div
        className="flex items-center justify-center bg-white"
        style={{ height: 'calc(100vh - 80px)', marginTop: '80px' }}
      >
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-gray-300">chat</span>
          <p className="text-gray-500">Vui lòng đăng nhập để xem tin nhắn.</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // ── Main layout ──────────────────────────────────────────────────────────
  return (
    <div
      className="flex bg-white overflow-hidden"
      style={{ height: 'calc(100vh - 80px)', marginTop: '80px' }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-80 shrink-0 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-base text-gray-900">Tin nhắn</h2>
          <button
            onClick={fetchConversations}
            title="Làm mới"
            className="text-gray-400 hover:text-orange-600 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <span className="material-symbols-outlined text-5xl text-gray-200 mb-3">chat_bubble</span>
              <p className="text-sm font-medium text-gray-500">Chưa có cuộc trò chuyện nào</p>
              <p className="text-xs text-gray-400 mt-1">Hãy chat với người bán từ trang sản phẩm</p>
            </div>
          ) : (
            conversations.map(conv => {
              const isActive  = activeConvId === conv.id;
              const hasUnread = (conv.unreadCount ?? 0) > 0;
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-gray-100
                    ${isActive ? 'bg-orange-50 border-r-2 border-r-orange-600' : 'hover:bg-gray-100'}`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
                    {(conv.listingImage ?? conv.listingImageUrl)
                      ? <img src={conv.listingImage ?? conv.listingImageUrl} alt="" className="w-full h-full object-cover" />
                      : <span className="material-symbols-outlined text-xl text-gray-400">directions_bike</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-sm truncate ${hasUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {conv.otherUserName ?? conv.sellerName ?? conv.buyerName ?? 'Người dùng'}
                      </p>
                      {hasUnread && (
                        <span className="shrink-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${hasUnread ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
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
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-gray-50">
            <span className="material-symbols-outlined text-7xl text-gray-200 mb-4">forum</span>
            <p className="text-gray-500 font-medium">Chọn một cuộc trò chuyện để bắt đầu</p>
            <p className="text-gray-400 text-sm mt-1">Hoặc chat với người bán từ trang sản phẩm</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-3.5 border-b border-gray-200 bg-white flex items-center gap-3 shrink-0 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-orange-100 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg text-orange-600">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {convDetail?.otherUserName ?? convDetail?.sellerName ?? convDetail?.buyerName ?? 'Người dùng'}
                </p>
                <p className="text-xs text-gray-400">Người bán</p>
              </div>
              {(convDetail?.listingTitle || convDetail?.listingImage || convDetail?.listingImageUrl) && (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 max-w-[220px] shrink-0">
                  {(convDetail.listingImage ?? convDetail.listingImageUrl) && (
                    <img
                      src={convDetail.listingImage ?? convDetail.listingImageUrl}
                      alt=""
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
                      {convDetail.listingTitle}
                    </p>
                    {convDetail.listingPrice != null && (
                      <p className="text-xs text-orange-600 font-bold leading-tight">
                        {Number(convDetail.listingPrice).toLocaleString('vi-VN')}₫
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-gray-50">
              {msgHasMore && (
                <div className="flex justify-center pb-2">
                  <button
                    onClick={handleLoadMore}
                    disabled={msgLoading}
                    className="text-xs text-orange-600 font-semibold hover:underline disabled:opacity-50 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm"
                  >
                    {msgLoading ? 'Đang tải...' : '↑ Tải tin nhắn cũ hơn'}
                  </button>
                </div>
              )}
              {msgLoading && messages.length === 0 && (
                <div className="flex justify-center py-12">
                  <span className="material-symbols-outlined animate-spin text-orange-500 text-3xl">
                    progress_activity
                  </span>
                </div>
              )}
              {messages.map((msg, idx) => {
                const isMine = msg.isMine ?? (String(msg.senderId) === String(currentUser?.id));
                return (
                  <div key={msg.id ?? idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${isMine
                          ? 'bg-orange-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        } ${msg.isOptimistic ? 'opacity-60' : ''}`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-orange-200' : 'text-gray-400'}`}>
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
              className="px-4 py-3 border-t border-gray-200 bg-white flex items-center gap-3 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-40 shrink-0"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
