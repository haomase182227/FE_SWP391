import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

const STATUS_STYLES = {
  Paid:       'bg-secondary/10 text-secondary',
  Completed:  'bg-tertiary/10 text-tertiary',
  Cancelled:  'bg-error/10 text-error',
  Pending:    'bg-orange-500/10 text-orange-600',
  Shipping:   'bg-blue-500/10 text-blue-600',
  Refunded:   'bg-surface-container-high text-on-surface-variant',
};

const TABS = ['All', 'Paid', 'Completed', 'Cancelled', 'Pending'];

function formatPrice(p) {
  return (p ?? 0).toLocaleString('vi-VN') + '₫';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function OderManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const navigate = useNavigate();

  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Detail modal
  const [detail, setDetail]           = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seller/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : (data.items ?? []));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function openDetail(orderId) {
    setDetail({ id: orderId, _loading: true });
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seller/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }

  // Stats
  const stats = {
    total:     orders.length,
    paid:      orders.filter(o => o.status === 'Paid').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    revenue:   orders.filter(o => o.status === 'Completed').reduce((s, o) => s + (o.totalPrice ?? 0), 0),
  };

  // Filter
  const filtered = orders.filter(o => {
    const tabStatus = TABS[activeTab];
    const matchTab = activeTab === 0 || o.status === tabStatus;
    const q = search.toLowerCase();
    const matchSearch = !q
      || (o.orderCode ?? '').toLowerCase().includes(q)
      || (o.listingTitle ?? '').toLowerCase().includes(q)
      || (o.buyerName ?? '').toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        merchantName={currentUser?.name || 'Seller'}
        merchantSub="Seller Dashboard"
        bottomButton="+ New Listing"
        onBottomButtonClick={() => navigate('/seller/new-listing')}
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 ml-64 bg-surface/80 backdrop-blur-xl h-16 shadow-sm">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 outline-none"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
      </header>

      <main className="ml-64 p-10 min-h-screen">
        {/* Header + Stats */}
        <section className="mb-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Sales</p>
              <h1 className="text-5xl font-bold tracking-tighter font-headline">Order Management</h1>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'Total',     value: stats.total,     color: 'text-on-surface' },
                { label: 'Paid',      value: stats.paid,      color: 'text-secondary' },
                { label: 'Completed', value: stats.completed, color: 'text-tertiary' },
                { label: 'Cancelled', value: stats.cancelled, color: 'text-error' },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-10 bg-outline-variant/20" />}
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">{s.label}</p>
                    <p className={`text-2xl font-bold font-headline ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-primary/30 via-outline-variant/10 to-transparent" />
        </section>

        {/* Tabs */}
        <div className="flex gap-1 p-2 bg-surface-container-low rounded-xl mb-8">
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-6 py-2 text-xs uppercase tracking-tight font-semibold rounded-lg transition-colors ${
                activeTab === i
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}>
              {tab}
              {tab !== 'All' && (
                <span className="ml-1.5 opacity-60">({orders.filter(o => o.status === tab).length})</span>
              )}
            </button>
          ))}
          <div className="ml-auto flex items-center pr-2 text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">
            {filtered.length} results
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block animate-spin">progress_activity</span>
              <p className="font-bold uppercase tracking-widest text-xs">Loading...</p>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">receipt_long</span>
              <p className="font-bold uppercase tracking-widest text-xs">No orders found</p>
            </div>
          )}
          {!loading && filtered.map(order => (
            <div key={order.id}
              className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-primary-container/5 transition-all"
              style={{ boxShadow: '0 20px 40px rgba(78,33,32,0.04)' }}>

              {/* Image */}
              <div className="w-24 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                {order.listingImageUrl
                  ? <img src={order.listingImageUrl} alt={order.listingTitle} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">directions_bike</span>
                    </div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                {/* Title */}
                <div className="col-span-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{order.orderCode}</p>
                  <h4 className="font-headline font-bold text-base leading-tight mt-0.5 line-clamp-2">{order.listingTitle}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{formatDate(order.createdAt)}</p>
                </div>

                {/* Buyer */}
                <div className="col-span-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Buyer</p>
                  <p className="font-semibold text-sm">{order.buyerName || '—'}</p>
                  {order.isBuyerVerified
                    ? <p className="text-[10px] text-tertiary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                        Verified
                      </p>
                    : <p className="text-[10px] text-on-surface-variant">{order.buyerEmail || ''}</p>
                  }
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Total</p>
                  <p className="font-headline font-bold text-lg text-primary">{formatPrice(order.totalPrice)}</p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[order.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Action */}
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => openDetail(order.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
                    title="View details">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">visibility</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-outline-variant/10">
          <p className="text-sm text-on-surface-variant italic">Showing {filtered.length} of {orders.length} orders</p>
        </div>
      </main>

      {/* ── Detail Modal ── */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetail(null)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-white/40" onClick={e => e.stopPropagation()}>
            {detailLoading ? (
              <div className="p-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>
                Loading...
              </div>
            ) : (
              <div>
                {detail.listingImageUrl && (
                  <img src={detail.listingImageUrl} alt={detail.listingTitle} className="w-full h-48 object-cover rounded-t-2xl" />
                )}
                <div className="p-8 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{detail.orderCode}</p>
                      <h3 className="font-headline text-xl font-black text-on-surface tracking-tighter">{detail.listingTitle}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${STATUS_STYLES[detail.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                      {detail.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      ['Total Price', formatPrice(detail.totalPrice)],
                      ['Order Date', formatDate(detail.createdAt)],
                      ['Buyer', detail.buyerName],
                      ['Email', detail.buyerEmail],
                      ['Phone', detail.buyerPhone || '—'],
                      ['Shipping Address', detail.shippingAddress || '—'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">{k}</p>
                        <p className="font-medium text-on-surface">{v}</p>
                      </div>
                    ))}
                  </div>

                  {detail.isBuyerVerified && (
                    <div className="flex items-center gap-2 bg-tertiary/5 border border-tertiary/20 rounded-xl px-4 py-3">
                      <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                      <span className="text-xs font-bold text-tertiary uppercase tracking-widest">Verified Buyer</span>
                    </div>
                  )}

                  <button onClick={() => setDetail(null)}
                    className="w-full py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
