import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
const API_BASE = '/api/v1';
const PAGE_SIZE = 8;

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [listings, setListings]   = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistDone, setWishlistDone]       = useState({});
  const [cartLoading, setCartLoading]         = useState({});
  const [cartDone, setCartDone]               = useState({});

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Price Range Filter
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [priceFilterActive, setPriceFilterActive] = useState(false);
  const PRICE_MAX = 100000000;

  // Sort
  const [sortMode, setSortMode] = useState('lowest'); // 'lowest' | 'highest' | 'newest' | 'oldest'

  // Brand filter
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Frame size filter
  const [selectedFrameSize, setSelectedFrameSize] = useState(null);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('');

  // ── Fetch main grid ──────────────────────────────────────────────────────────
  const fetchListings = useCallback(async (p = 1, append = false, title = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ Page: p, PageSize: PAGE_SIZE });
      if (title) params.set('Title', title);
      const res = await fetch(`${API_BASE}/listings?${params}`, { headers: { accept: '*/*' } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items = data.items ?? [];
      setTotalCount(data.totalCount ?? 0);
      setListings(prev => append ? [...prev, ...items] : items);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  // ── Fetch by sort ───────────────────────────────────────────────────────────
  const fetchSorted = useCallback(async (mode, p = 1, append = false) => {
    setLoading(true);
    try {
      const endpointMap = {
        lowest: 'sort/price-lowest',
        highest: 'sort/price-highest',
        newest: 'sort/newest',
        oldest: 'sort/oldest',
      };
      const endpoint = endpointMap[mode] ?? 'sort/price-lowest';
      const params = new URLSearchParams({ page: p, pageSize: PAGE_SIZE });
      const res = await fetch(`${API_BASE}/listings/${endpoint}?${params}`, { headers: { accept: '*/*' } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items = data.items ?? [];
      setTotalCount(data.totalCount ?? 0);
      setListings(prev => append ? [...prev, ...items] : items);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  // ── Fetch by brand ───────────────────────────────────────────────────────────
  const fetchByBrand = useCallback(async (brand, p = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, pageSize: PAGE_SIZE });
      const res = await fetch(`${API_BASE}/listings/filter/brand/${encodeURIComponent(brand)}?${params}`, { headers: { accept: '*/*' } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items = data.items ?? [];
      setTotalCount(data.totalCount ?? 0);
      setListings(prev => append ? [...prev, ...items] : items);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  // ── Fetch by frame size ──────────────────────────────────────────────────────
  const fetchByFrameSize = useCallback(async (size, p = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, pageSize: PAGE_SIZE });
      const res = await fetch(`${API_BASE}/listings/filter/frame-size/${encodeURIComponent(size)}?${params}`, { headers: { accept: '*/*' } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items = data.items ?? [];
      setTotalCount(data.totalCount ?? 0);
      setListings(prev => append ? [...prev, ...items] : items);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  // ── Fetch by category ───────────────────────────────────────────────────────
  const fetchByCategory = useCallback(async (category, p = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, pageSize: PAGE_SIZE });
      const res = await fetch(`${API_BASE}/listings/filter/category/${encodeURIComponent(category)}?${params}`, { headers: { accept: '*/*' } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items = data.items ?? [];
      setTotalCount(data.totalCount ?? 0);
      setListings(prev => append ? [...prev, ...items] : items);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  // ── Fetch by price range ─────────────────────────────────────────────────────
  const fetchByPriceRange = useCallback(async (p = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ minPrice: minPrice ?? 0, maxPrice: maxPrice ?? 100000000, page: p, pageSize: PAGE_SIZE });
      const res = await fetch(`${API_BASE}/listings/filter/price-range?${params}`, {
        headers: { accept: '*/*' }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items = data.items ?? [];
      setTotalCount(data.totalCount ?? 0);
      setListings(prev => append ? [...prev, ...items] : items);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setPage(1);
    fetchSorted('lowest', 1, false);
  }, [fetchSorted]);

  // ── Cart / Wishlist / Buy ────────────────────────────────────────────────────
  async function handleWishlist(e, listingId) {
    e.stopPropagation();
    if (!token) { navigate('/auth'); return; }
    if (wishlistDone[listingId] || wishlistLoading[listingId]) return;
    setWishlistLoading(prev => ({ ...prev, [listingId]: true }));
    try {
      await fetch(`${API_BASE}/buyer/Wishlist/${listingId}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistDone(prev => ({ ...prev, [listingId]: true }));
    } catch { /* ignore */ }
    finally { setWishlistLoading(prev => ({ ...prev, [listingId]: false })); }
  }

  async function handleAddToCart(e, listingId) {
    e.stopPropagation();
    if (!token) { navigate('/auth'); return; }
    if (cartDone[listingId] || cartLoading[listingId]) return;
    setCartLoading(prev => ({ ...prev, [listingId]: true }));
    try {
      await fetch(`${API_BASE}/buyer/cart/${listingId}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      setCartDone(prev => ({ ...prev, [listingId]: true }));
    } catch { /* ignore */ }
    finally { setCartLoading(prev => ({ ...prev, [listingId]: false })); }
  }

  async function handleBuyNow(e, listingId) {
    e.stopPropagation();
    if (!token) { navigate('/auth'); return; }
    setCartLoading(prev => ({ ...prev, [listingId]: true }));
    try {
      await fetch(`${API_BASE}/buyer/cart/${listingId}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/cart');
    } catch { /* ignore */ }
    finally { setCartLoading(prev => ({ ...prev, [listingId]: false })); }
  }

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    if (priceFilterActive) {
      fetchByPriceRange(next, true);
    } else if (selectedBrand) {
      fetchByBrand(selectedBrand, next, true);
    } else if (selectedFrameSize) {
      fetchByFrameSize(selectedFrameSize, next, true);
    } else if (selectedCategory) {
      fetchByCategory(selectedCategory, next, true);
    } else {
      fetchSorted(sortMode, next, true);
    }
  }

  function handleBrandSelect(brand) {
    const next = selectedBrand === brand ? null : brand;
    setSelectedBrand(next);
    setSelectedFrameSize(null);
    setSelectedCategory('');
    setPriceFilterActive(false);
    setPage(1);
    if (next) {
      fetchByBrand(next, 1, false);
    } else {
      fetchSorted(sortMode, 1, false);
    }
  }

  function handleFrameSizeSelect(size) {
    const next = selectedFrameSize === size ? null : size;
    setSelectedFrameSize(next);
    setSelectedBrand(null);
    setSelectedCategory('');
    setPriceFilterActive(false);
    setPage(1);
    if (next) {
      fetchByFrameSize(next, 1, false);
    } else {
      fetchSorted(sortMode, 1, false);
    }
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
    setSelectedBrand(null);
    setSelectedFrameSize(null);
    setPriceFilterActive(false);
    setPage(1);
    if (category) {
      fetchByCategory(category, 1, false);
    } else {
      fetchSorted(sortMode, 1, false);
    }
  }

  function handleSortChange(mode) {
    setSortMode(mode);
    setPriceFilterActive(false);
    setPage(1);
    fetchSorted(mode, 1, false);
  }

  function handlePriceRangeChange(value) {
    setMaxPrice(Number(value));
  }

  function applyPriceFilter() {
    setPriceFilterActive(true);
    setPage(1);
    fetchByPriceRange(1, false);
  }

  function clearPriceFilter() {
    setPriceFilterActive(false);
    setMinPrice(0);
    setMaxPrice(100000000);
    setPage(1);
    fetchSorted(sortMode, 1, false);
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
            src="https://images.unsplash.com/photo-1452573992436-6d508f200b30?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
          <div className="max-w-2xl space-y-8">
            <header className="space-y-2">
              <span className="font-label text-sm uppercase tracking-[0.3em] text-primary font-bold">Old Collection Now Live</span>
              <h1 className="font-headline text-7xl font-extrabold tracking-tighter leading-none text-on-surface">
                PRECISION<br /><span className="italic text-primary">VELOCITY.</span>
              </h1>
            </header>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              The world's most curated marketplace for high-performance cycling engineering. Every machine is verified, inspected, and ready for the podium.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {currentUser ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary px-6 py-3 rounded-lg font-headline font-bold uppercase tracking-tight border border-outline-variant/15 hover:bg-surface-container-low transition-all"
                >
                  Đổi tài khoản
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                </button>
              ) : (
                <>
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
                </>
              )}
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
            <div className="space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Brand Name</span>
              <div className="space-y-2">
                {/* None option */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === null}
                    onChange={() => handleBrandSelect(selectedBrand)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">All</span>
                </label>
                {['RAPTOR', 'MEREC', 'HYPER', 'GIANT', 'Java', 'Trek'].map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === brand}
                      onChange={() => handleBrandSelect(brand)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Investment Range</span>
              <div className="space-y-3">
                {/* Dual range slider */}
                <div className="relative h-5 flex items-center">
                  {/* Track */}
                  <div className="absolute w-full h-1.5 bg-surface-container-high rounded-full" />
                  {/* Active track */}
                  <div
                    className="absolute h-1.5 bg-primary rounded-full"
                    style={{
                      left: `${(minPrice / PRICE_MAX) * 100}%`,
                      right: `${100 - (maxPrice / PRICE_MAX) * 100}%`,
                    }}
                  />
                  {/* Min thumb */}
                  <input
                    type="range"
                    min={0}
                    max={PRICE_MAX}
                    step={500000}
                    value={minPrice}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v <= maxPrice) setMinPrice(v);
                    }}
                    style={{ zIndex: minPrice >= maxPrice - 500000 ? 5 : 3 }}
                    className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                  />
                  {/* Max thumb */}
                  <input
                    type="range"
                    min={0}
                    max={PRICE_MAX}
                    step={500000}
                    value={maxPrice}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= minPrice) setMaxPrice(v);
                    }}
                    style={{ zIndex: 4 }}
                    className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold font-headline">
                  <span>{minPrice.toLocaleString('vi-VN')}₫</span>
                  <span>{maxPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={applyPriceFilter}
                    className="flex-1 py-2 px-3 bg-primary text-on-primary rounded text-xs font-bold uppercase hover:opacity-90 transition-all"
                  >
                    Áp dụng
                  </button>
                  {priceFilterActive && (
                    <button
                      onClick={clearPriceFilter}
                      className="py-2 px-3 border border-outline-variant/20 rounded text-xs font-bold uppercase hover:bg-surface-container-low transition-all"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Frame Size</span>
              <div className="flex gap-2">
                {['S', 'M', 'L'].map(size => (
                  <button
                    key={size}
                    onClick={() => handleFrameSizeSelect(size)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all cursor-pointer shadow-sm
                      ${selectedFrameSize === size
                        ? 'bg-primary text-on-primary shadow-primary/30 shadow-md scale-105'
                        : 'bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container hover:scale-105'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-outline-variant/20 rounded px-3 py-1.5 text-xs font-bold tracking-wide bg-surface-container-lowest text-on-surface cursor-pointer focus:outline-none focus:border-primary/40"
              >
                <option value="">All Categories</option>
                <option value="Gravel & Adventure">Gravel &amp; Adventure</option>
                <option value="Mountain Tech">Mountain Tech</option>
                <option value="Road Performance">Road Performance</option>
                <option value="string">String</option>
                <option value="Time Trial">Time Trial</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Bike Grid */}
        <div className="flex-1 space-y-8">
          {/* Header row */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div className="space-y-1">
              <h2 className="font-headline text-3xl font-bold tracking-tight">Available Inventory</h2>
              <p className="text-on-surface-variant text-sm">
                {searchQuery
                  ? `${totalCount} kết quả cho "${searchQuery}"`
                  : `Showing ${listings.length} of ${totalCount} listings.`}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className="text-on-surface-variant">Sort By:</span>
              <select
                value={sortMode}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-outline-variant/20 rounded px-3 py-1.5 text-xs font-bold tracking-wide bg-surface-container-lowest text-on-surface cursor-pointer focus:outline-none focus:border-primary/40"
              >
                <option value="lowest">Lowest Price</option>
                <option value="highest">Highest Price</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

            </div>
          </div>

          {/* Bike Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading && listings.length === 0 &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow animate-pulse">
                  <div className="aspect-[4/3] bg-surface-container-high" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-surface-container-high rounded w-1/3" />
                    <div className="h-5 bg-surface-container-high rounded w-2/3" />
                  </div>
                </div>
              ))
            }
            {listings.map((bike) => (
              <div
                key={bike.id}
                onClick={() => navigate(`/bike/${bike.id}`)}
                className="group relative bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 editorial-shadow cursor-pointer flex flex-col"
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
                  {bike.isVerified && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Đã kiểm định
                      </span>
                    </div>
                  )}
                  <button
                    onClick={(e) => handleWishlist(e, bike.id)}
                    className={`absolute top-4 right-4 h-10 w-10 flex items-center justify-center backdrop-blur-md rounded-full transition-all
                      ${wishlistDone[bike.id] ? 'bg-primary text-on-primary' : 'bg-white/40 text-white hover:bg-white hover:text-primary'}`}
                    title={wishlistDone[bike.id] ? 'Added to wishlist' : 'Add to wishlist'}
                  >
                    {wishlistLoading[bike.id]
                      ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      : <span className="material-symbols-outlined" style={{ fontVariationSettings: wishlistDone[bike.id] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    }
                  </button>
                </div>
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{bike.status ?? ''}</span>
                      <span className="font-headline font-bold text-lg text-primary">{(bike.price ?? 0).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold tracking-tight">{bike.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleAddToCart(e, bike.id)}
                      disabled={cartLoading[bike.id] || cartDone[bike.id]}
                      className={`py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5
                        ${cartDone[bike.id] ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high border border-outline-variant/20'}`}
                    >
                      <span className="material-symbols-outlined text-base">shopping_cart</span>
                      {cartLoading[bike.id] ? '...' : cartDone[bike.id] ? 'Đã thêm' : 'Add to cart'}
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, bike.id)}
                      disabled={cartLoading[bike.id]}
                      className="py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-base">bolt</span>
                      Mua ngay
                    </button>
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
