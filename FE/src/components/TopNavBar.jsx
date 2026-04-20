import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

const API_BASE = '/api/v1';

export default function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
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

  useEffect(() => {
    if (!isAuthenticated || !currentUser?.token) { setWalletBalance(null); return; }
    fetch('/api/v1/Auth/users/me', {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    })
      .then(r => r.json())
      .then(data => setWalletBalance(data?.user?.wallet ?? 0))
      .catch(() => setWalletBalance(0));
  }, [isAuthenticated, currentUser?.token]);

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

  // Live suggestions debounce 300ms
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
    navigate(`/?search=${encodeURIComponent(q)}`);
  }

  function handleSuggestionClick(item) {
    setSearchInput(item.title);
    setShowSuggestions(false);
    navigate(`/bike/${item.id}`);
  }

  function handleLogin() { setIsMenuOpen(false); navigate('/auth'); }
  function handleLogout() { logout(); setIsMenuOpen(false); }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(168,49,0,0.04)]">
      <div className="flex items-center px-8 h-20 w-full max-w-screen-2xl mx-auto font-['Space_Grotesk'] tracking-tight gap-6">
        {/* Logo + Nav links */}
        <div className="flex items-center gap-12 flex-shrink-0">
          <Link to="/" className="text-2xl font-bold italic tracking-tighter text-orange-700">
            The Kinetic Editorial
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-orange-700 font-bold border-b-2 border-orange-700 transition-colors duration-300">
              Marketplace
            </Link>
            <Link to="/support" className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-300">
              Support
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-lg">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-xl pointer-events-none select-none"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Tìm kiếm theo tên xe, mẫu mã..."
                className="w-full pl-10 pr-8 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); setSuggestions([]); setShowSuggestions(false); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
            {suggestLoading && (
              <span className="material-symbols-outlined text-orange-400 text-lg animate-spin absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                progress_activity
              </span>
            )}
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-orange-100 rounded-xl shadow-xl z-50 overflow-hidden">
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">Gợi ý</p>
              {suggestions.map(item => (
                <button key={item.id} type="button" onMouseDown={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left">
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    : <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-orange-300 text-base">directions_bike</span>
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{item.title}</p>
                    <p className="text-xs text-orange-600 font-bold">{(item.price ?? 0).toLocaleString('vi-VN')}₫</p>
                  </div>
                  <span className="material-symbols-outlined text-stone-300 text-sm shrink-0">north_west</span>
                </button>
              ))}
            </div>
          )}
          {showSuggestions && !suggestLoading && searchInput.trim() && suggestions.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-orange-100 rounded-xl shadow-xl z-50 px-4 py-3 text-sm text-stone-400">
              Không tìm thấy &quot;{searchInput}&quot;
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6 flex-shrink-0 ml-auto">
          {isAuthenticated && walletBalance !== null && (
            <Link to="/wallet" className="hidden md:flex flex-col items-end px-4 border-r border-outline-variant/20 hover:opacity-90 transition-opacity">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Wallet Balance</span>
              <span className="font-headline font-bold text-secondary">
                {walletBalance.toLocaleString('vi-VN')}₫
              </span>
            </Link>
          )}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="flex items-center gap-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>favorite</span>
              <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Wishlist</span>
            </Link>
            <Link to="/order" className="flex items-center gap-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>receipt_long</span>
              <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Orders</span>
            </Link>
            <Link to="/cart" className="p-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>shopping_cart</span>
            </Link>
            <div className="relative" ref={profileMenuRef}>
              <button type="button" onClick={() => setIsMenuOpen(prev => !prev)}
                className="h-10 w-10 rounded-full bg-surface-container-high border-2 border-primary/10 overflow-hidden hover:scale-95 transition-transform">
                <img alt="Profile" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5MBi-FnDVnn8Cn6I2Vv4fbe7bIcqc1SUlWAi13OL58uUjhMWHO1YmOGjJLCtYgz4LIfQ_pVBuhPfPz9UhMZHuhYjNkEJg9IoUg3aGKzkN6Sldk_304Xovk8-HCdy-4PpA-dOBGIXUJ-o0NWRYnNVf2LI3MsnL_X71pYWdwSzNfrC_pfEfTIX83VJOJg_ZretoolpJH7MofTvfggz3Em1P9uzcDH60WXLdOIPkl4M3DfDDXgelqw8BxHCz9GN7EddpmpqdkgC_RpW"
                />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl editorial-shadow p-5 z-50">
                  {!isAuthenticated ? (
                    <button type="button" onClick={handleLogin}
                      className="w-full rounded-xl bg-primary text-on-primary py-3 text-xs font-bold uppercase tracking-widest hover:opacity-95 transition-opacity">
                      Đăng nhập
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full overflow-hidden border border-outline-variant/30">
                          <img alt="Profile" className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5MBi-FnDVnn8Cn6I2Vv4fbe7bIcqc1SUlWAi13OL58uUjhMWHO1YmOGjJLCtYgz4LIfQ_pVBuhPfPz9UhMZHuhYjNkEJg9IoUg3aGKzkN6Sldk_304Xovk8-HCdy-4PpA-dOBGIXUJ-o0NWRYnNVf2LI3MsnL_X71pYWdwSzNfrC_pfEfTIX83VJOJg_ZretoolpJH7MofTvfggz3Em1P9uzcDH60WXLdOIPkl4M3DfDDXgelqw8BxHCz9GN7EddpmpqdkgC_RpW"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Đã đăng nhập</p>
                          <p className="font-headline text-sm font-bold text-on-surface">{currentUser?.email}</p>
                          <p className="text-[11px] text-on-surface-variant">Role: {currentUser?.role}</p>
                        </div>
                      </div>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 py-3 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-sm">manage_accounts</span>
                        Xem hồ sơ
                      </Link>
                      <button type="button" onClick={handleLogout}
                        className="w-full rounded-xl bg-error text-on-error py-3 text-xs font-bold uppercase tracking-widest hover:opacity-95 transition-opacity">
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
