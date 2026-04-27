import { useEffect, useRef, useState, useCallback } from 'react';

// Helper: dispatch this event from any page after a wallet change
// e.g. window.dispatchEvent(new Event('walletUpdated'));
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

const API_BASE = '/api/v1';

export default function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();

  // Search state
  const [searchInput, setSearchInput]         = useState('');
  const [suggestions, setSuggestions]         = useState([]);
  const [suggestLoading, setSuggestLoading]   = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef   = useRef(null);
  const debounceRef = useRef(null);

  const fetchWalletBalance = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.token) { setWalletBalance(null); return; }
    try {
      const r = await fetch('/api/v1/Auth/users/me', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const data = await r.json();
      setWalletBalance(data?.user?.wallet ?? 0);
    } catch {
      setWalletBalance(0);
    }
  }, [isAuthenticated, currentUser?.token]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  useEffect(() => {
    window.addEventListener('walletUpdated', fetchWalletBalance);
    return () => window.removeEventListener('walletUpdated', fetchWalletBalance);
  }, [fetchWalletBalance]);

  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.token || currentUser?.role !== 'Buyer') {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/messaging/unread-count`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (!res.ok) { setUnreadCount(0); return; }
      const data = await res.json();
      setUnreadCount(data?.unreadCount ?? data?.count ?? (typeof data === 'number' ? data : 0));
    } catch {
      setUnreadCount(0);
    }
  }, [isAuthenticated, currentUser?.token, currentUser?.role]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target))
        setIsMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target))
        setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = searchInput.trim();
    if (!q) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const params = new URLSearchParams({ Title: q, Page: 1, PageSize: 6 });
        const res = await fetch(`${API_BASE}/listings?${params}`, { headers: { accept: '*/*' } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSuggestions(data.items ?? []);
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
      finally { setSuggestLoading(false); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleSuggestionClick(item) {
    setSearchInput(item.title);
    setShowSuggestions(false);
    navigate(`/bike/${item.id}`);
  }

  function handleLogin() { setIsMenuOpen(false); navigate('/auth'); }
  function handleLogout() { logout(); setIsMenuOpen(false); }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center px-8 h-20 w-full max-w-screen-2xl mx-auto font-['Space_Grotesk'] tracking-tight gap-6">

        {/* Logo + Nav links */}
        <div className="flex items-center gap-12 flex-shrink-0">
          <Link to="/" className="text-3xl font-black italic tracking-tighter text-orange-600 hover:text-orange-500 transition-all duration-200">
            The Kinetic
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="relative text-orange-600 font-bold text-sm uppercase tracking-wider pb-0.5
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-orange-500
                transition-all duration-200"
            >
              Marketplace
            </Link>
            <Link
              to="/support"
              className="relative text-gray-500 font-semibold text-sm uppercase tracking-wider hover:text-orange-600 pb-0.5
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-orange-500 after:transition-all after:duration-300
                transition-all duration-200"
            >
              Support
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-lg">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none select-none"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
              >
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search bikes..."
                className="w-full pl-11 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400
                  focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all duration-200"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setSuggestions([]); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
              {suggestLoading && (
                <span className="material-symbols-outlined text-orange-400 text-lg animate-spin absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                  progress_activity
                </span>
              )}
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 z-50 overflow-hidden">
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Suggestions</p>
              {suggestions.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-all duration-200 text-left"
                >
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.title} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                    : (
                      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-orange-300 text-base">directions_bike</span>
                      </div>
                    )
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">{item.title}</p>
                    <p className="text-xs text-orange-500 font-bold">{(item.price ?? 0).toLocaleString('vi-VN')}₫</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 text-sm shrink-0">north_west</span>
                </button>
              ))}
            </div>
          )}
          {showSuggestions && !suggestLoading && searchInput.trim() && suggestions.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 z-50 px-4 py-3 text-sm text-gray-400">
              No results for &quot;{searchInput}&quot;
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

          {/* Wallet Balance */}
          {isAuthenticated && walletBalance !== null && (
            <Link
              to="/wallet"
              className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-xl transition-all duration-200 mr-2"
            >
              <span
                className="material-symbols-outlined text-orange-500 text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase tracking-widest text-orange-400 font-bold">Balance</span>
                <span className="text-sm font-bold text-orange-600">{walletBalance.toLocaleString('vi-VN')}₫</span>
              </div>
            </Link>
          )}

          {/* Icon buttons */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl p-2.5 transition-all duration-200 active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>favorite</span>
            <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Wishlist</span>
          </Link>

          <Link
            to="/order"
            className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl p-2.5 transition-all duration-200 active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>receipt_long</span>
            <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Orders</span>
          </Link>

          <Link
            to="/cart"
            className="text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl p-2.5 transition-all duration-200 active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>shopping_cart</span>
          </Link>

          <Link
            to="/chat"
            className="relative text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl p-2.5 transition-all duration-200 active:scale-95"
            title="Chat history"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chat</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <div className="relative ml-1" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="h-10 w-10 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-400 hover:scale-95 transition-all duration-200 active:scale-90"
            >
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5MBi-FnDVnn8Cn6I2Vv4fbe7bIcqc1SUlWAi13OL58uUjhMWHO1YmOGjJLCtYgz4LIfQ_pVBuhPfPz9UhMZHuhYjNkEJg9IoUg3aGKzkN6Sldk_304Xovk8-HCdy-4PpA-dOBGIXUJ-o0NWRYnNVf2LI3MsnL_X71pYWdwSzNfrC_pfEfTIX83VJOJg_ZretoolpJH7MofTvfggz3Em1P9uzcDH60WXLdOIPkl4M3DfDDXgelqw8BxHCz9GN7EddpmpqdkgC_RpW"
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 p-5 z-50">
                {!isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 active:scale-95"
                  >
                    Đăng nhập
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                        <img
                          alt="Profile"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5MBi-FnDVnn8Cn6I2Vv4fbe7bIcqc1SUlWAi13OL58uUjhMWHO1YmOGjJLCtYgz4LIfQ_pVBuhPfPz9UhMZHuhYjNkEJg9IoUg3aGKzkN6Sldk_304Xovk8-HCdy-4PpA-dOBGIXUJ-o0NWRYnNVf2LI3MsnL_X71pYWdwSzNfrC_pfEfTIX83VJOJg_ZretoolpJH7MofTvfggz3Em1P9uzcDH60WXLdOIPkl4M3DfDDXgelqw8BxHCz9GN7EddpmpqdkgC_RpW"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Signed in</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{currentUser?.email}</p>
                        <p className="text-[11px] text-gray-400">Role: {currentUser?.role}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 py-3 text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-orange-600 transition-all duration-200"
                    >
                      <span className="material-symbols-outlined text-sm">manage_accounts</span>
                      Xem hồ sơ
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 active:scale-95"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
