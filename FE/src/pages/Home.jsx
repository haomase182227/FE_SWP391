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
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-50/30 to-transparent" />
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
          <div className="max-w-2xl space-y-8">
            <header className="space-y-2">
              <span className="font-label text-sm uppercase tracking-[0.3em] text-orange-600 font-bold">Old Collection Now Live</span>
              <h1 className="font-headline text-7xl xl:text-8xl font-extrabold tracking-tighter leading-none text-gray-900">
                PRECISION<br /><span className="italic text-orange-600">VELOCITY.</span>
              </h1>
            </header>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              The world's most curated marketplace for high-performance cycling engineering. Every machine is verified, inspected, and ready for the podium.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {currentUser ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-tight border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 active:scale-95 shadow-lg shadow-orange-500/10"
                >
                  Đổi tài khoản
                  <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth')}
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-tight hover:bg-orange-700 transition-all duration-300 active:scale-95 shadow-lg shadow-orange-500/30"
                  >
                    Khám phá ngay
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    Có thể chuyển giữa login và register ngay trong trang này.
                  </span>
                </>
              )}
            </div>

            </div>
        </div>
      </section>

      {/* Marketplace Canvas */}
      <div className="bg-[#fafaf9]">
        <div className="max-w-screen-2xl mx-auto px-8 py-20 flex gap-12">
        {/* Filters (Left Rail) */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-4">
          <h3 className="font-headline text-xl font-bold tracking-tight px-1 mb-6 text-orange-600">Refine Results</h3>

          {/* Brand filter card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Brand Name</span>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === null}
                  onChange={() => handleBrandSelect(selectedBrand)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-all duration-300">All</span>
              </label>
              {['RAPTOR', 'MEREC', 'HYPER', 'GIANT', 'Java', 'Trek'].map((brand) => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === brand}
                    onChange={() => handleBrandSelect(brand)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-all duration-300">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range filter card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Investment Range</span>
            <div className="space-y-3">
              <div className="relative h-5 flex items-center">
                <div className="absolute w-full h-1.5 bg-gray-100 rounded-full" />
                <div
                  className="absolute h-1.5 bg-orange-500 rounded-full"
                  style={{
                    left: `${(minPrice / PRICE_MAX) * 100}%`,
                    right: `${100 - (maxPrice / PRICE_MAX) * 100}%`,
                  }}
                />
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
                  className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:shadow-md"
                />
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
                  className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-orange-700">
                <span>{minPrice.toLocaleString('vi-VN')}₫</span>
                <span>{maxPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyPriceFilter}
                  className="flex-1 py-2 px-3 bg-orange-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-orange-700 transition-all duration-200 active:scale-95"
                >
                  Áp dụng
                </button>
                {priceFilterActive && (
                  <button
                    onClick={clearPriceFilter}
                    className="py-2 px-3 border border-orange-200 text-orange-600 rounded-xl text-xs font-bold uppercase hover:border-orange-600 hover:bg-orange-50 transition-all duration-200"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Frame size filter card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Frame Size</span>
            <div className="flex gap-2">
              {['S', 'M', 'L'].map(size => (
                <button
                  key={size}
                  onClick={() => handleFrameSizeSelect(size)}
                  className={`flex-1 py-3 px-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer
                    ${selectedFrameSize === size
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-500 hover:text-orange-600'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer transition-all duration-300"
            >
              <option value="">All Categories</option>
              <option value="Gravel & Adventure">Gravel &amp; Adventure</option>
              <option value="Mountain Tech">Mountain Tech</option>
              <option value="Road Performance">Road Performance</option>
              <option value="string">String</option>
              <option value="Time Trial">Time Trial</option>
            </select>
          </div>
        </aside>

        {/* Bike Grid */}
        <div className="flex-1 space-y-8">
          {/* Header row */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div className="space-y-1">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-orange-600">Available Inventory</h2>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? `${totalCount} kết quả cho "${searchQuery}"`
                  : `Showing ${listings.length} of ${totalCount} listings.`}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
              <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Sort By:</span>
              <select
                value={sortMode}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer transition-all duration-300"
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
                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3]" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-200 rounded-xl w-1/3" />
                    <div className="h-5 bg-gray-200 rounded-xl w-2/3" />
                  </div>
                </div>
              ))
            }
            {listings.map((bike) => (
              <div
                key={bike.id}
                onClick={() => navigate(`/bike/${bike.id}`)}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  {bike.imageUrl ? (
                    <img
                      src={bike.imageUrl}
                      alt={bike.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-gray-300">directions_bike</span>
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
                    className={`absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full shadow-md transition-all duration-300
                      ${wishlistDone[bike.id] ? 'bg-primary text-on-primary' : 'bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700'}`}
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
                      <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">{bike.status ?? ''}</span>
                      <span className="font-headline font-bold text-lg text-primary">{(bike.price ?? 0).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold tracking-tight text-gray-900">{bike.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleAddToCart(e, bike.id)}
                      disabled={cartLoading[bike.id] || cartDone[bike.id]}
                      className={`py-2.5 flex items-center justify-center gap-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95
                        ${cartDone[bike.id] ? 'bg-orange-500 text-white' : 'bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50'}`}
                    >
                      <span className="material-symbols-outlined text-base">shopping_cart</span>
                      {cartLoading[bike.id] ? '...' : cartDone[bike.id] ? 'Đã thêm' : 'Add to cart'}
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, bike.id)}
                      disabled={cartLoading[bike.id]}
                      className="py-2.5 flex items-center justify-center gap-1.5 bg-orange-600 text-white hover:bg-orange-700 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-60 shadow-lg shadow-orange-500/30"
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
                className="flex items-center gap-4 px-12 py-4 border-2 border-orange-500 text-orange-600 font-extrabold uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all duration-300 active:scale-95 rounded-xl disabled:opacity-50 shadow-lg shadow-orange-500/20"
              >
                {loading ? 'Loading...' : 'Load More Machines'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            ) : (
              !loading && listings.length > 0 && (
                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">All {totalCount} listings shown</p>
              )
            )}
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
