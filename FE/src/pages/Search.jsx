import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

const API_BASE = '/api/v1';
const PAGE_SIZE = 12;

function formatPrice(p) {
  return (p ?? 0).toLocaleString('vi-VN') + '₫';
}

// Chọn đúng endpoint theo filter đang active
function buildUrl(q, sort, minPrice, maxPrice, brand, frameSize, verified, page) {
  const base = `Page=${page}&PageSize=${PAGE_SIZE}`;

  // Khi có title search — chỉ dùng /listings?Title=... (sort endpoints không filter được theo title)
  if (q) {
    const params = new URLSearchParams({ Title: q, Page: page, PageSize: PAGE_SIZE });
    if (minPrice) params.set('MinPrice', minPrice);
    if (maxPrice) params.set('MaxPrice', maxPrice);
    return `${API_BASE}/listings?${params}`;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    const params = new URLSearchParams({ Page: page, PageSize: PAGE_SIZE });
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    return `${API_BASE}/listings/filter/price-range?${params}`;
  }

  // Brand filter
  if (brand) return `${API_BASE}/listings/filter/brand/${encodeURIComponent(brand)}?${base}`;

  // Frame size filter
  if (frameSize) return `${API_BASE}/listings/filter/frame-size/${encodeURIComponent(frameSize)}?${base}`;

  // Verified filter
  if (verified) return `${API_BASE}/listings/filter/verified/true?${base}`;

  // Sort only
  if (sort === 'highest') return `${API_BASE}/listings/sort/price-highest?${base}`;
  if (sort === 'lowest')  return `${API_BASE}/listings/sort/price-lowest?${base}`;
  if (sort === 'oldest')  return `${API_BASE}/listings/sort/oldest?${base}`;
  return `${API_BASE}/listings/sort/newest?${base}`;
}

const SORT_OPTIONS = [
  { value: 'newest',  label: 'Mới nhất' },
  { value: 'oldest',  label: 'Cũ nhất' },
  { value: 'lowest',  label: 'Giá thấp → cao' },
  { value: 'highest', label: 'Giá cao → thấp' },
];

const FRAME_SIZES = ['S', 'M', 'L', 'XL'];

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';

  const [results, setResults]       = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);

  // Filters
  const [sort, setSort]             = useState('newest');
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [brand, setBrand]           = useState('');
  const [frameSize, setFrameSize]   = useState('');
  const [verified, setVerified]     = useState(false);

  // Applied price (chỉ apply khi bấm nút)
  const [appliedMin, setAppliedMin] = useState('');
  const [appliedMax, setAppliedMax] = useState('');

  const fetchResults = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const url = buildUrl(q, sort, appliedMin, appliedMax, brand, frameSize, verified, p);
      const res = await fetch(url, { headers: { accept: '*/*' } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.items ?? []);
      setTotal(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, sort, appliedMin, appliedMax, brand, frameSize, verified]);

  // Reset page và fetch khi filter thay đổi
  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [q, sort, appliedMin, appliedMax, brand, frameSize, verified]);

  useEffect(() => {
    fetchResults(page);
  }, [page]);

  function applyPrice() {
    setAppliedMin(minPrice);
    setAppliedMax(maxPrice);
    setPage(1);
  }

  function clearFilters() {
    setSort('newest');
    setMinPrice(''); setMaxPrice('');
    setAppliedMin(''); setAppliedMax('');
    setBrand('');
    setFrameSize('');
    setVerified(false);
    setPage(1);
  }

  const hasActiveFilter = appliedMin || appliedMax || brand || frameSize || verified;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen antialiased">
      <TopNavBar />

      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-label uppercase tracking-widest text-orange-600 mb-1">
            {q ? 'Kết quả tìm kiếm' : 'Tất cả sản phẩm'}
          </p>
          {q && (
            <h1 className="font-headline text-3xl font-black tracking-tighter text-orange-600">
              "{q}"
            </h1>
          )}
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {total > 0 ? `${total} kết quả` : 'Không tìm thấy kết quả nào'}
            </p>
          )}
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0 space-y-5">

            {/* Khoảng giá */}
            <div className="bg-surface-container-lowest rounded-2xl border border-white shadow-[0_8px_24px_rgba(78,33,32,0.06)] p-5">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-orange-600 mb-4 font-bold">Khoảng giá</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-widest">Từ (₫)</label>
                  <input
                    type="number" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full mt-1 bg-surface-container-low rounded-lg px-3 py-2 text-sm text-on-surface outline-none border-2 border-transparent focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-widest">Đến (₫)</label>
                  <input
                    type="number" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="100.000.000"
                    className="w-full mt-1 bg-surface-container-low rounded-lg px-3 py-2 text-sm text-on-surface outline-none border-2 border-transparent focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <button onClick={applyPrice}
                  className="w-full py-2 bg-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all">
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Frame size */}
            <div className="bg-surface-container-lowest rounded-2xl border border-white shadow-[0_8px_24px_rgba(78,33,32,0.06)] p-5">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-orange-600 mb-3 font-bold">Cỡ khung</h3>
              <div className="grid grid-cols-4 gap-2">
                {FRAME_SIZES.map(s => (
                  <button key={s} onClick={() => setFrameSize(frameSize === s ? '' : s)}
                    className={`py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${frameSize === s ? 'bg-primary text-on-primary' : 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Đã kiểm định */}
            <div className="bg-surface-container-lowest rounded-2xl border border-white shadow-[0_8px_24px_rgba(78,33,32,0.06)] p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setVerified(v => !v)}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${verified ? 'bg-primary border-primary' : 'border-outline'}`}>
                  {verified && <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '13px' }}>check</span>}
                </button>
                <span className="text-sm font-medium text-on-surface">Đã kiểm định</span>
              </label>
            </div>

            {/* Clear filters */}
            {hasActiveFilter && (
              <button onClick={clearFilters}
                className="w-full py-2.5 border border-outline-variant/30 text-on-surface-variant rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                Xóa bộ lọc
              </button>
            )}
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar — chỉ hiện khi không search theo tên */}
            {!q && (
              <div className="flex items-center gap-2 flex-wrap mb-6">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setSort(opt.value)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${sort === opt.value && !hasActiveFilter ? 'bg-primary text-on-primary' : 'border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
              </div>
            )}

            {/* Empty */}
            {!loading && results.length === 0 && (
              <div className="text-center py-24 space-y-4">
                <span className="material-symbols-outlined text-6xl text-outline-variant block">search_off</span>
                <p className="font-headline text-xl font-bold text-on-surface">Không tìm thấy kết quả</p>
                <p className="text-sm text-on-surface-variant">Thử thay đổi bộ lọc hoặc từ khóa khác</p>
                <button onClick={clearFilters}
                  className="mt-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && results.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {results.map(item => (
                    <Link key={item.id} to={`/bike/${item.id}`}
                      className="group bg-surface-container-lowest rounded-2xl border border-white shadow-[0_8px_24px_rgba(78,33,32,0.06)] overflow-hidden hover:shadow-[0_16px_40px_rgba(168,49,0,0.12)] hover:-translate-y-1 transition-all duration-200">
                      {/* Image */}
                      <div className="aspect-[4/3] bg-surface-container overflow-hidden relative">
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-4xl text-outline-variant">directions_bike</span>
                            </div>
                        }
                        {item.isVerified && (
                          <div className="absolute top-2 left-2 bg-tertiary text-on-tertiary text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                            Đã kiểm định
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-4 space-y-1.5">
                        <p className="font-headline text-sm font-bold text-on-surface line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <p className="font-headline text-base font-black text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low disabled:opacity-40 transition-colors">
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                      .reduce((acc, p, i, arr) => {
                        if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) => p === '...'
                        ? <span key={`e${i}`} className="px-1 text-on-surface-variant text-sm">...</span>
                        : <button key={p} onClick={() => setPage(p)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${page === p ? 'bg-primary text-on-primary' : 'border border-outline-variant/20 hover:bg-surface-container-low text-on-surface'}`}>
                            {p}
                          </button>
                      )
                    }
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low disabled:opacity-40 transition-colors">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
