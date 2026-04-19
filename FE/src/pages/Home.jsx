import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

const API_BASE = '/api/v1';
const PAGE_SIZE = 8;

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [listings, setListings]     = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState({}); // { [listingId]: bool }
  const [wishlistDone, setWishlistDone]       = useState({}); // { [listingId]: bool }

  const fetchListings = useCallback(async (p = 1, append = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/listings?Page=${p}&PageSize=${PAGE_SIZE}`,
        { headers: { accept: '*/*' } }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items = data.items ?? [];
      setTotalCount(data.totalCount ?? 0);
      setListings(prev => append ? [...prev, ...items] : items);
    } catch {
      // silently fail — keep existing data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchListings(1, false); }, [fetchListings]);

  async function handleWishlist(e, listingId) {
    e.stopPropagation();
    if (!token) { navigate('/auth'); return; }
    if (wishlistDone[listingId] || wishlistLoading[listingId]) return;
    setWishlistLoading(prev => ({ ...prev, [listingId]: true }));
    try {
      await fetch(`${API_BASE}/buyer/Wishlist/${listingId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistDone(prev => ({ ...prev, [listingId]: true }));
    } catch {
      // ignore
    } finally {
      setWishlistLoading(prev => ({ ...prev, [listingId]: false }));
    }
  }

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage, true);
  }

  const hasMore = listings.length < totalCount;
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[716px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Hero Bike" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFaYOxBD8H8BWUDNZUu13_LsVCvKnzk78pZFkwSoRALs1v_ZUpNmf87tzBjhYEi51FXC5heEiu3e6H6zIWT2XGL3XW8gNp4YiQq-pK995r-hSbwLSJoCzztBoLuwF9cDVzCpDq80vT1k5vUIf7AyJrNhKOAPCVjv_panzs_Vg2MkB64HPAqlxRKPNUABnSfRyZ09jtYfnT9x9nLREoLYouKRNaxBLI4zpXUbeRDOJX10qHzTsoyLYYDNKz4vttPHDYu3KXTA_OgqJC"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
          <div className="max-w-2xl space-y-8">
            <header className="space-y-2">
              <span className="font-label text-sm uppercase tracking-[0.3em] text-primary font-bold">2024 Collection Now Live</span>
              <h1 className="font-headline text-7xl font-extrabold tracking-tighter leading-none text-on-surface">
                PRECISION<br/><span className="italic text-primary">VELOCITY.</span>
              </h1>
            </header>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              The world's most curated marketplace for high-performance cycling engineering. Every machine is verified, inspected, and ready for the podium.
            </p>
            {/* Search Bar Shell */}
            <div className="flex items-center p-2 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl editorial-shadow max-w-xl group focus-within:ring-2 ring-primary/20 transition-all">
              <div className="flex-1 flex items-center px-4 gap-3">
                <span className="material-symbols-outlined text-primary">search</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body py-3 outline-none" 
                  placeholder="Search by brand, model, or discipline..." 
                  type="text"
                />
              </div>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-headline font-bold uppercase tracking-tight scale-100 hover:scale-[1.02] active:scale-95 transition-all">
                Explore
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary px-6 py-3 rounded-lg font-headline font-bold uppercase tracking-tight border border-outline-variant/15 hover:bg-surface-container-low transition-all"
              >
                Đăng nhập / Đăng ký
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <span className="text-sm text-on-surface-variant">
                Có thể chuyển giữa login và register ngay trong trang này.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Canvas */}
      <div className="max-w-screen-2xl mx-auto px-8 py-20 flex gap-12">
        {/* Filters (Left Rail) */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-12">
          <div className="space-y-6">
            <h3 className="font-headline text-xl font-bold tracking-tight">Refine Results</h3>
            {/* Category Filter */}
            <div className="space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Discipline</span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Road Performance</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Gravel &amp; Adventure</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Mountain Tech</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Time Trial</span>
                </label>
              </div>
            </div>
            {/* Price Range */}
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Investment Range</span>
              <div className="space-y-4">
                <input className="w-full accent-primary h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer" type="range"/>
                <div className="flex justify-between text-xs font-bold font-headline">
                  <span>$1,500</span>
                  <span>$25,000+</span>
                </div>
              </div>
            </div>
            {/* Brand Filter */}
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Elite Partners</span>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">S-Works</button>
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">Pinarello</button>
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">Canyon</button>
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">Colnago</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Bike Grid */}
        <div className="flex-1 space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="font-headline text-3xl font-bold tracking-tight">Available Inventory</h2>
              <p className="text-on-surface-variant text-sm">Showing {listings.length} of {totalCount} listings.</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className="text-on-surface-variant">Sort By:</span>
              <button className="flex items-center gap-1 text-primary cursor-pointer">Newest Arrivals <span className="material-symbols-outlined text-sm">expand_more</span></button>
            </div>
          </div>
          
          {/* Bento Grid for Featured/Standard items */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading && listings.length === 0 && (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow animate-pulse">
                  <div className="aspect-[4/3] bg-surface-container-high" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-surface-container-high rounded w-1/3" />
                    <div className="h-5 bg-surface-container-high rounded w-2/3" />
                  </div>
                </div>
              ))
            )}
            {listings.map((bike) => (
              <div
                key={bike.id}
                onClick={() => navigate(`/bike/${bike.id}`)}
                className="group relative bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 editorial-shadow cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  {bike.imageUrl ? (
                    <img
                      src={bike.imageUrl}
                      alt={bike.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">directions_bike</span>
                    </div>
                  )}

                  {/* Verified badge */}
                  {bike.isVerified && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Đã kiểm định
                      </span>
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => handleWishlist(e, bike.id)}
                    className={`absolute top-4 right-4 h-10 w-10 flex items-center justify-center backdrop-blur-md rounded-full transition-all
                      ${wishlistDone[bike.id]
                        ? 'bg-primary text-on-primary'
                        : 'bg-white/40 text-white hover:bg-white hover:text-primary'
                      }`}
                    title={wishlistDone[bike.id] ? 'Added to wishlist' : 'Add to wishlist'}
                  >
                    {wishlistLoading[bike.id]
                      ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      : <span className="material-symbols-outlined" style={{ fontVariationSettings: wishlistDone[bike.id] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    }
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                        {bike.status ?? ''}
                      </span>
                      <span className="font-headline font-bold text-lg text-primary">
                        {(bike.price ?? 0).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <h3 className="font-headline text-xl font-bold tracking-tight">{bike.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center pt-12">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="flex items-center gap-4 px-12 py-4 border-2 border-primary text-primary font-headline font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Machines'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            ) : (
              !loading && listings.length > 0 && (
                <p className="text-sm text-on-surface-variant font-label uppercase tracking-widest">All {totalCount} listings shown</p>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
