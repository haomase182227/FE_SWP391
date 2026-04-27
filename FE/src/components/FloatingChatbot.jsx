import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

const API_BASE = '/api';

export default function FloatingChatbot() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Khởi tạo sessionId
  useEffect(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      setSessionId(crypto.randomUUID());
    } else {
      // Fallback cho trình duyệt cũ
      setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  // Fetch suggestions khi component mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/Chatbot/suggestions`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
        });
        if (res.ok) {
          const data = await res.json();
          const suggestionsList = Array.isArray(data) ? data : (data.suggestions || []);
          setSuggestions(suggestionsList);
        }
      } catch (err) {
        console.error('[Chatbot] Fetch suggestions error:', err);
      }
    };

    if (isOpen && suggestions.length === 0) {
      fetchSuggestions();
    }
  }, [isOpen, token, suggestions.length]);

  // Auto scroll to bottom when new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Hàm gửi tin nhắn
  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;
    if (!token) {
      alert('Vui lòng đăng nhập để sử dụng chatbot!');
      return;
    }

    const userMessage = messageText.trim();
    
    // Thêm tin nhắn user vào UI ngay lập tức
    const newUserMsg = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/Chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          message: userMessage,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }

      const responseData = await res.json();
      
      // Cập nhật sessionId nếu server trả về
      if (responseData.sessionId && responseData.sessionId !== sessionId) {
        setSessionId(responseData.sessionId);
      }

      // Thêm tin nhắn AI vào UI
      const newAssistantMsg = {
        role: 'assistant',
        content: responseData.answer || responseData.message || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
        listings: responseData.recommendedListings || [],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newAssistantMsg]);

    } catch (err) {
      console.error('[Chatbot] Send message error:', err);
      // Thêm tin nhắn lỗi
      const errorMsg = {
        role: 'assistant',
        content: `Xin lỗi, đã có lỗi xảy ra: ${err.message}. Vui lòng thử lại sau.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi click suggestion
  const handleSuggestionClick = (suggestionText) => {
    setInputMessage(suggestionText);
    sendMessage(suggestionText);
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Xử lý click vào sản phẩm
  const handleProductClick = (listingId) => {
    navigate(`/bike/${listingId}`);
    setIsOpen(false); // Đóng chatbot khi chuyển trang
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary to-orange-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Open AI Chatbot"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-3xl">close</span>
        ) : (
          <span className="material-symbols-outlined text-3xl animate-pulse">smart_toy</span>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Trợ lý AI
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-outline-variant/20">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">smart_toy</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-xs text-white/80">Tư vấn mua xe đạp</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* BODY - MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl text-primary">waving_hand</span>
                  </div>
                  <h4 className="font-bold text-lg text-on-surface">Xin chào!</h4>
                  <p className="text-sm text-on-surface-variant max-w-xs">
                    Tôi là trợ lý AI. Tôi có thể giúp bạn tìm xe đạp phù hợp. Hãy hỏi tôi bất cứ điều gì!
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white text-on-surface rounded-bl-none shadow-sm border border-outline-variant/20'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Product recommendations */}
                  {msg.role === 'assistant' && msg.listings && msg.listings.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide px-2">
                        Gợi ý sản phẩm
                      </p>
                      <div className="space-y-2">
                        {msg.listings.map((listing) => (
                          <button
                            key={listing.listingId || listing.id}
                            onClick={() => handleProductClick(listing.listingId || listing.id)}
                            className="w-full bg-white rounded-xl p-3 border border-outline-variant/20 hover:border-primary hover:shadow-md transition-all duration-200 flex items-center gap-3 group"
                          >
                            {/* Image */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                              {listing.imageUrl ? (
                                <img
                                  src={listing.imageUrl}
                                  alt={listing.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">
                                    directions_bike
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                                {listing.title || 'Xe đạp'}
                              </p>
                              <p className="text-xs text-on-surface-variant mt-0.5">
                                {listing.brandName || 'Brand'}
                              </p>
                              <p className="text-sm font-bold text-primary mt-1">
                                {(listing.price || 0).toLocaleString('vi-VN')}₫
                              </p>
                            </div>

                            {/* Arrow icon */}
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                              arrow_forward
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[10px] text-on-surface-variant mt-1 px-2">
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTIONS */}
          {suggestions.length > 0 && messages.length === 0 && (
            <div className="px-4 py-3 bg-white border-t border-outline-variant/10">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide mb-2">
                Câu hỏi gợi ý
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex-shrink-0 px-4 py-2 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER - INPUT */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-outline-variant rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">send</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
