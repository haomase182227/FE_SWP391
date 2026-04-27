import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';

const API_BASE = '/api/v1';

/* ── Rating helpers ─────────────────────────────────────────── */
const RATING_CFG = {
  5: { label: 'Xuất sắc',  cls: 'bg-emerald-100 text-emerald-700 border border-emerald-300', bar: 'bg-emerald-500', card: 'border-l-emerald-400', glow: 'rgba(16,185,129,0.12)' },
  4: { label: 'Tốt',       cls: 'bg-blue-100 text-blue-700 border border-blue-300',          bar: 'bg-blue-500',    card: 'border-l-blue-400',    glow: 'rgba(59,130,246,0.12)' },
  3: { label: 'Trung bình',cls: 'bg-amber-100 text-amber-700 border border-amber-300',       bar: 'bg-amber-500',   card: 'border-l-amber-400',   glow: 'rgba(245,158,11,0.12)' },
  2: { label: 'Kém',       cls: 'bg-orange-100 text-orange-700 border border-orange-300',    bar: 'bg-orange-500',  card: 'border-l-orange-400',  glow: 'rgba(249,115,22,0.12)' },
  1: { label: 'Tệ',        cls: 'bg-red-100 text-red-700 border border-red-300',             bar: 'bg-red-500',     card: 'border-l-red-400',     glow: 'rgba(239,68,68,0.12)'  },
};

const getRatingCfg = (r) => RATING_CFG[r] ?? RATING_CFG[3];

export default function AdminReviews() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [reviews, setReviews]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');
  const [stats, setStats] = useState({
    total: 0, averageRating: 0,
    fiveStars: 0, fourStars: 0, threeStars: 0, twoStars: 0, oneStar: 0,
  });

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    const fetchReviews = async () => {
      setIsLoading(true); setError('');
      try {
        const res = await fetch(`${API_BASE}/admin/orders/reviews`, {
          headers: { Authorization: `Bearer ${token}`, accept: '*/*' },
        });
        if (!res.ok) { if (res.status === 404) { setReviews([]); return; } throw new Error(`HTTP ${res.status}`); }
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.reviews || []);
        setReviews(list);
        if (list.length > 0) {
          const avg = (list.reduce((s, r) => s + (r.rating || 0), 0) / list.length).toFixed(1);
          setStats({
            total: list.length, averageRating: avg,
            fiveStars:  list.filter(r => r.rating === 5).length,
            fourStars:  list.filter(r => r.rating === 4).length,
            threeStars: list.filter(r => r.rating === 3).length,
            twoStars:   list.filter(r => r.rating === 2).length,
            oneStar:    list.filter(r => r.rating === 1).length,
          });
        }
      } catch (e) { setError(e.message || 'Không thể tải đánh giá'); setReviews([]); }
      finally { setIsLoading(false); }
    };
    fetchReviews();
  }, [token]);

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return '—'; }
  };

  if (!token) return (
    <main className="min-h-screen bg-[#fff4f3] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-on-surface-variant">Vui lòng đăng nhập để xem đánh giá.</p>
        <button onClick={() => navigate('/auth')} className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90">Đăng nhập</button>
      </div>
    </main>
  );

  /* ── Stat cards config ──────────────────────────────────── */
  const statCards = [
    {
      label: 'Tổng đánh giá',
      value: stats.total,
      icon: 'rate_review',
      gradient: 'linear-gradient(135deg,#4e2120,#9b3a38)',
      glow: '0 12px 40px rgba(78,33,32,0.35)',
      accent: '#fecaca', sub2: '#fca5a5',
      sub: 'All reviews',
    },
    {
      label: 'Điểm trung bình',
      value: `${stats.averageRating} ⭐`,
      icon: 'star',
      gradient: 'linear-gradient(135deg,#b45309,#f59e0b)',
      glow: '0 12px 40px rgba(245,158,11,0.35)',
      accent: '#fde68a', sub2: '#fcd34d',
      sub: 'Average rating',
    },
    {
      label: '5 Sao',
      value: stats.fiveStars,
      icon: 'star',
      gradient: 'linear-gradient(135deg,#065f46,#10b981)',
      glow: '0 12px 40px rgba(16,185,129,0.35)',
      accent: '#a7f3d0', sub2: '#6ee7b7',
      sub: 'Xuất sắc',
    },
    {
      label: '4 Sao',
      value: stats.fourStars,
      icon: 'star_half',
      gradient: 'linear-gradient(135deg,#1e40af,#3b82f6)',
      glow: '0 12px 40px rgba(59,130,246,0.35)',
      accent: '#bfdbfe', sub2: '#93c5fd',
      sub: 'Tốt',
    },
    {
      label: '3 Sao',
      value: stats.threeStars,
      icon: 'star_half',
      gradient: 'linear-gradient(135deg,#92400e,#d97706)',
      glow: '0 12px 40px rgba(217,119,6,0.35)',
      accent: '#fde68a', sub2: '#fbbf24',
      sub: 'Trung bình',
    },
    {
      label: '2 Sao',
      value: stats.twoStars,
      icon: 'star_border',
      gradient: 'linear-gradient(135deg,#7c2d12,#ea580c)',
      glow: '0 12px 40px rgba(234,88,12,0.35)',
      accent: '#fed7aa', sub2: '#fdba74',
      sub: 'Kém',
    },
    {
      label: '1 Sao',
      value: stats.oneStar,
      icon: 'star_border',
      gradient: 'linear-gradient(135deg,#7f1d1d,#dc2626)',
      glow: '0 12px 40px rgba(220,38,38,0.35)',
      accent: '#fecaca', sub2: '#fca5a5',
      sub: 'Tệ',
    },
  ];

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      <main className="ml-64 pt-8 px-8 pb-16">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 6px 20px rgba(78,33,32,0.4)' }}>
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>rate_review</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-0.5">Admin Panel</p>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none">Quản lý Đánh giá</h1>
            <p className="text-sm text-on-surface-variant mt-1">Theo dõi và quản lý tất cả đánh giá trên toàn hệ thống</p>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────── */}
        {!isLoading && !error && reviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
            {statCards.map(s => (
              <div key={s.label} className="relative rounded-2xl overflow-hidden p-5 flex flex-col gap-2 cursor-default hover:-translate-y-1 transition-transform duration-300"
                style={{ background: s.gradient, boxShadow: s.glow }}>
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-xl pointer-events-none"
                  style={{ background: `radial-gradient(circle,${s.accent},transparent)` }} />
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-[9px] uppercase font-black tracking-[0.2em]" style={{ color: s.accent }}>{s.label}</p>
                  <span className="material-symbols-outlined text-base text-white/60" style={{ fontVariationSettings: '"FILL" 1' }}>{s.icon}</span>
                </div>
                <h3 className="text-2xl font-headline font-black tracking-tighter text-white relative z-10 leading-none">{s.value}</h3>
                <div className="flex items-center gap-1 relative z-10">
                  <span className="w-1 h-1 rounded-full" style={{ background: s.sub2 }} />
                  <span className="text-[9px] font-bold" style={{ color: s.sub2 }}>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="text-sm text-on-surface-variant">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────── */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-red-500">error</span>
            </div>
            <p className="text-red-600 font-bold">{error}</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity">
              Thử lại
            </button>
          </div>
        )}

        {/* ── Empty ────────────────────────────────────────── */}
        {!isLoading && !error && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-rose-300">rate_review</span>
            </div>
            <p className="text-on-surface-variant font-medium">Chưa có đánh giá nào trên hệ thống.</p>
            <p className="text-sm text-on-surface-variant/60">Các đánh giá từ người dùng sẽ xuất hiện ở đây.</p>
          </div>
        )}

        {/* ── Reviews list ─────────────────────────────────── */}
        {!isLoading && !error && reviews.length > 0 && (
          <div className="space-y-5">
            {reviews.map((review) => {
              const id     = review.reviewItemId || review.id;
              const rating = review.rating || 0;
              const cfg    = getRatingCfg(rating);

              return (
                <div key={id}
                  className={`bg-white rounded-2xl overflow-hidden border-l-4 ${cfg.card} shadow-[0_4px_20px_rgba(78,33,32,0.07)] hover:shadow-[0_8px_32px_rgba(78,33,32,0.12)] hover:-translate-y-0.5 transition-all duration-200`}
                  style={{ boxShadow: `0 4px 20px ${cfg.glow}, 0 1px 4px rgba(78,33,32,0.06)` }}>

                  <div className="flex gap-6 p-6">
                    {/* ── Left: content ── */}
                    <div className="flex-1 min-w-0">

                      {/* Product title */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)' }}>
                          <span className="material-symbols-outlined text-white text-sm">directions_bike</span>
                        </div>
                        <h3 className="font-headline font-black text-base text-on-surface tracking-tight leading-tight">
                          {review.listingTitle || 'Sản phẩm'}
                        </h3>
                      </div>

                      {/* Buyer → Seller */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200">
                          <span className="material-symbols-outlined text-indigo-500 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>person</span>
                          <span className="text-[11px] font-bold text-indigo-700">
                            Người mua: <span className="font-black">{review.buyerName || 'N/A'}</span>
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant/30 text-sm">arrow_forward</span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                          <span className="material-symbols-outlined text-emerald-600 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>storefront</span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            Người bán: <span className="font-black">{review.sellerName || 'N/A'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Stars + rating badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star}
                              className={`material-symbols-outlined text-xl ${star <= rating ? 'text-amber-400' : 'text-zinc-200'}`}
                              style={{ fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0' }}>
                              star
                            </span>
                          ))}
                        </div>
                        <span className="font-black text-base text-on-surface">{rating}/5</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.cls}`}>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="rounded-xl p-4 mb-4 bg-rose-50 border border-rose-100 border-l-4 border-l-primary">
                        <p className="text-sm text-on-surface leading-relaxed italic">
                          "{review.comment || 'Không có nội dung đánh giá.'}"
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-4 pt-3 border-t border-rose-100 text-[11px] text-on-surface-variant">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-primary/50">calendar_today</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                        {review.orderId && (
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-primary/50">receipt</span>
                            <span>Order #{review.orderId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Right: image ── */}
                    <div className="flex-shrink-0">
                      <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-rose-100 shadow-sm">
                        {review.listingImageUrl ? (
                          <img src={review.listingImageUrl} alt={review.listingTitle || 'Bike'}
                            className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-rose-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-rose-200">directions_bike</span>
                          </div>
                        )}
                      </div>
                      {/* Rating circle */}
                      <div className="mt-2 flex items-center justify-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${cfg.cls}`}>
                          {rating}★
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
