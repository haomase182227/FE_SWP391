import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

export default function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, walletBalance, walletLoading } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogin() {
    setIsMenuOpen(false);
    navigate('/auth');
  }

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(168,49,0,0.04)]">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto font-['Space_Grotesk'] tracking-tight">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold italic tracking-tighter text-orange-700">
            The Kinetic Editorial
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-orange-700 font-bold border-b-2 border-orange-700 transition-colors duration-300">
              Marketplace
            </Link>
            <Link to="/compare" className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-300">
              Compare
            </Link>
            <Link to="/feed" className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-300">
              Feed
            </Link>
            <Link to="/support" className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-300">
              Support
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {/* Wallet Balance — chỉ hiện khi đã đăng nhập */}
          {isAuthenticated && (
            <Link to="/wallet" className="hidden md:flex flex-col items-end px-4 border-r border-outline-variant/20 hover:opacity-90 transition-opacity">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Wallet Balance</span>
              {walletLoading ? (
                <span className="font-headline font-bold text-secondary text-sm animate-pulse">...</span>
              ) : walletBalance !== null && walletBalance !== undefined ? (
                <span className="font-headline font-bold text-secondary">
                  {Number(walletBalance).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              ) : (
                <span className="font-headline font-bold text-secondary">—</span>
              )}
            </Link>
          )}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="flex items-center gap-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>favorite</span>
              <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Wishlist</span>
            </Link>
            <Link to="/order" className="flex items-center gap-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>receipt_long</span>
              <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Orders</span>
            </Link>
            <Link to="/cart" className="p-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>shopping_cart</span>
            </Link>
            <button className="p-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>notifications</span>
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="h-10 w-10 rounded-full bg-surface-container-high border-2 border-primary/10 overflow-hidden hover:scale-95 transition-transform"
              >
                <img 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5MBi-FnDVnn8Cn6I2Vv4fbe7bIcqc1SUlWAi13OL58uUjhMWHO1YmOGjJLCtYgz4LIfQ_pVBuhPfPz9UhMZHuhYjNkEJg9IoUg3aGKzkN6Sldk_304Xovk8-HCdy-4PpA-dOBGIXUJ-o0NWRYnNVf2LI3MsnL_X71pYWdwSzNfrC_pfEfTIX83VJOJg_ZretoolpJH7MofTvfggz3Em1P9uzcDH60WXLdOIPkl4M3DfDDXgelqw8BxHCz9GN7EddpmpqdkgC_RpW"
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl editorial-shadow p-5 z-50">
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="w-full rounded-xl bg-primary text-on-primary py-3 text-xs font-bold uppercase tracking-widest hover:opacity-95 transition-opacity"
                    >
                      Đăng nhập
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full overflow-hidden border border-outline-variant/30">
                          <img
                            alt="Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5MBi-FnDVnn8Cn6I2Vv4fbe7bIcqc1SUlWAi13OL58uUjhMWHO1YmOGjJLCtYgz4LIfQ_pVBuhPfPz9UhMZHuhYjNkEJg9IoUg3aGKzkN6Sldk_304Xovk8-HCdy-4PpA-dOBGIXUJ-o0NWRYnNVf2LI3MsnL_X71pYWdwSzNfrC_pfEfTIX83VJOJg_ZretoolpJH7MofTvfggz3Em1P9uzcDH60WXLdOIPkl4M3DfDDXgelqw8BxHCz9GN7EddpmpqdkgC_RpW"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Đã đăng nhập</p>
                          <p className="font-headline text-sm font-bold text-on-surface">{currentUser?.email}</p>
                          <p className="text-[11px] text-on-surface-variant">Role: {currentUser?.role}</p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 py-3 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">manage_accounts</span>
                        Xem hồ sơ
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl bg-error text-on-error py-3 text-xs font-bold uppercase tracking-widest hover:opacity-95 transition-opacity"
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
      </div>
    </nav>
  );
}