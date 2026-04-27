import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const vnd = (n) => (n ?? 0).toLocaleString('vi-VN') + '₫';

/* ── Status & type config ─────────────────────────────────── */
const STATUS_CFG = {
  Completed: {
    cls: 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.25)]',
    icon: 'check_circle',
  },
  Cancelled: {
    cls: 'bg-red-100 text-red-700 border border-red-300 shadow-[0_2px_8px_rgba(239,68,68,0.25)]',
    icon: 'cancel',
  },
};

const ESCROW_CFG = {
  released: { cls: 'text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-0.5', icon: 'check_circle', label: 'Released' },
  refunded: { cls: 'text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5',   icon: 'undo',         label: 'Refunded' },
  held:     { cls: 'text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5',  icon: 'lock',         label: 'Held'     },
};

const TYPE_CFG = {
  COMPLETED: { cls: 'bg-blue-100 text-blue-700 border border-blue-200',   label: 'COMPLETED' },
  REFUNDED:  { cls: 'bg-amber-100 text-amber-700 border border-amber-200', label: 'REFUNDED'  },
};

export default function TransactionManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalEscrowVolume: 0, activeEscrows: 0, totalRefunded: 0, totalTransactions: 0 });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page, pageSize: 20 });
    if (activeFilter === 'Completed') params.set('status', 'Completed');
    if (activeFilter === 'Cancelled') params.set('status', 'Cancelled');
    fetch(`${API_BASE}/admin/transactions?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setTransactions(data.transactions || []);
        setStats({
          totalEscrowVolume: data.totalEscrowVolume || 0,
          activeEscrows: data.activeEscrows || 0,
          totalRefunded: data.totalRefunded || 0,
          totalTransactions: data.totalTransactions || 0,
        });
        setTotalPages(data.totalPages || 1);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token, page, activeFilter]);

  const filtered = transactions.filter(tx => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tx.orderCode?.toLowerCase().includes(q) ||
      tx.buyerName?.toLowerCase().includes(q) ||
      tx.sellerName?.toLowerCase().includes(q) ||
      tx.buyerEmail?.toLowerCase().includes(q) ||
      tx.sellerEmail?.toLowerCase().includes(q) ||
      tx.shippingAddress?.toLowerCase().includes(q)
    );
  });

  /* ── Stat cards ─────────────────────────────────────────── */
  const statCards = [
    {
      label: 'Total Escrow Volume',
      value: vnd(stats.totalEscrowVolume),
      icon: 'trending_up',
      gradient: 'linear-gradient(135deg,#1e40af,#3b82f6)',
      glow: '0 12px 40px rgba(59,130,246,0.35)',
      accent: '#bfdbfe',
      sub: '#93c5fd',
    },
    {
      label: 'Total Refunded',
      value: vnd(stats.totalRefunded),
      icon: 'undo',
      gradient: 'linear-gradient(135deg,#b45309,#f59e0b)',
      glow: '0 12px 40px rgba(245,158,11,0.35)',
      accent: '#fde68a',
      sub: '#fcd34d',
    },
    {
      label: 'Total Transactions',
      value: stats.totalTransactions,
      icon: 'receipt_long',
      gradient: 'linear-gradient(135deg,#4e2120,#9b3a38)',
      glow: '0 12px 40px rgba(78,33,32,0.35)',
      accent: '#fecaca',
      sub: '#fca5a5',
    },
  ];

  /* ── Filter config ──────────────────────────────────────── */
  const filterCfg = [
    {
      key: 'All',
      label: 'All',
      icon: 'apps',
      activeCls: 'bg-slate-800 text-white shadow-[0_4px_14px_rgba(30,41,59,0.35)]',
    },
    {
      key: 'Completed',
      label: 'Completed',
      icon: 'check_circle',
      activeCls: 'bg-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.45)]',
    },
    {
      key: 'Cancelled',
      label: 'Cancelled',
      icon: 'cancel',
      activeCls: 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.45)]',
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
            <span className="material-symbols-outlined text-white text-2xl">receipt_long</span>
          </div>
          <div>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none">Transaction Management</h1>
            <p className="text-sm text-on-surface-variant mt-1">Quản lý toàn bộ giao dịch trên nền tảng</p>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map(s => (
            <div key={s.label} className="relative rounded-3xl overflow-hidden p-7 flex flex-col gap-4 cursor-default hover:-translate-y-1 transition-transform duration-300"
              style={{ background: s.gradient, boxShadow: s.glow }}>
              {/* dot grid texture */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              {/* glow blob */}
              <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full opacity-25 blur-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle,${s.accent},transparent)` }} />

              <div className="flex items-center justify-between relative z-10">
                <p className="text-[10px] uppercase font-black tracking-[0.25em]" style={{ color: s.accent }}>{s.label}</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <span className="material-symbols-outlined text-xl text-white">{s.icon}</span>
                </div>
              </div>
              <h3 className="text-3xl font-headline font-black tracking-tighter text-white relative z-10 leading-none">{s.value}</h3>
              <div className="flex items-center gap-1.5 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.sub }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.sub }}>All time</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter + Search bar ──────────────────────────── */}
        <div className="flex items-center justify-between mb-6 p-2.5 rounded-2xl bg-white shadow-[0_4px_20px_rgba(78,33,32,0.1)] border border-rose-100">
          {/* Filter tabs */}
          <div className="flex gap-2">
            {filterCfg.map(f => (
              <button key={f.key} onClick={() => { setActiveFilter(f.key); setPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
                  activeFilter === f.key
                    ? f.activeCls
                    : 'text-on-surface-variant hover:bg-rose-50 hover:text-on-surface'
                }`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-rose-300 text-sm">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order, buyer, seller..."
              className="pl-9 pr-4 py-2 text-xs rounded-xl w-64 outline-none transition-all bg-rose-50 border border-rose-200 text-on-surface placeholder:text-rose-300 focus:border-primary/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(78,33,32,0.08)]"
            />
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(78,33,32,0.1)] border border-rose-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.06),rgba(78,33,32,0.03))', borderBottom: '2px solid rgba(78,33,32,0.08)' }}>
                {[
                  { label: 'Order',  center: false },
                  { label: 'Items',  center: false },
                  { label: 'Buyer',  center: false },
                  { label: 'Seller', center: false },
                  { label: 'Total',  center: true  },
                  { label: 'Escrow', center: true  },
                  { label: 'Status', center: true  },
                ].map(h => (
                  <th key={h.label}
                    className={`py-4 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ${h.center ? 'text-center' : ''}`}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-3 text-primary">progress_activity</span>
                    <span className="text-sm">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-on-surface-variant text-sm">Không có dữ liệu.</td>
                </tr>
              ) : filtered.map(tx => {
                const isExpanded = expandedRow === tx.orderId;
                const escrowKey = tx.isEscrowReleased ? 'released' : tx.isRefunded ? 'refunded' : 'held';
                const escrow = ESCROW_CFG[escrowKey];
                const statusCfg = STATUS_CFG[tx.status];
                const typeCfg = TYPE_CFG[tx.transactionType];

                return (
                  <>
                    <tr
                      key={tx.orderId}
                      onClick={() => setExpandedRow(isExpanded ? null : tx.orderId)}
                      className="cursor-pointer transition-colors duration-150"
                      style={{ background: isExpanded ? 'rgba(78,33,32,0.04)' : undefined }}
                      onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(78,33,32,0.025)'; }}
                      onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = ''; }}
                    >
                      {/* Order */}
                      <td className="py-4 px-5">
                        <p className="font-black text-sm text-on-surface tracking-tight">{tx.orderCode}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{new Date(tx.orderDate).toLocaleDateString('vi-VN')}</p>
                        {typeCfg && (
                          <span className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${typeCfg.cls}`}>
                            {typeCfg.label}
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-4 px-5">
                        <div className="flex -space-x-2">
                          {tx.items?.slice(0, 3).map(item => (
                            <img key={item.orderItemId} src={item.imageUrl} alt={item.listingTitle}
                              className="w-9 h-9 rounded-lg object-cover border-2 border-white shadow-sm" />
                          ))}
                          {tx.items?.length > 3 && (
                            <div className="w-9 h-9 rounded-lg bg-rose-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-rose-400 shadow-sm">
                              +{tx.items.length - 3}
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-1.5">{tx.items?.length} item{tx.items?.length !== 1 ? 's' : ''}</p>
                      </td>

                      {/* Buyer */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
                            {tx.buyerName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-on-surface">{tx.buyerName}</p>
                            <p className="text-[10px] text-on-surface-variant">{tx.buyerEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#b45309,#f59e0b)', boxShadow: '0 2px 8px rgba(245,158,11,0.35)' }}>
                            {tx.sellerName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-on-surface">{tx.sellerName}</p>
                            <p className="text-[10px] text-on-surface-variant">{tx.sellerEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-5 text-center">
                        <p className="font-black text-sm text-on-surface">{vnd(tx.totalPrice)}</p>
                      </td>

                      {/* Escrow */}
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${escrow.cls}`}>
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>{escrow.icon}</span>
                          {escrow.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center">
                        {statusCfg ? (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusCfg.cls}`}>
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>{statusCfg.icon}</span>
                            {tx.status}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                            {tx.status}
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* ── Expanded detail row ── */}
                    {isExpanded && (
                      <tr key={`${tx.orderId}-detail`}>
                        <td colSpan={7} className="px-8 py-6 border-b border-rose-100"
                          style={{ background: 'linear-gradient(135deg,rgba(78,33,32,0.03),rgba(78,33,32,0.015))' }}>
                          <div className="grid grid-cols-2 gap-8">
                            {/* Items list */}
                            <div>
                              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-primary">inventory_2</span>
                                Items in order
                              </p>
                              <div className="space-y-2.5">
                                {tx.items?.map(item => (
                                  <div key={item.orderItemId} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-rose-100 shadow-sm">
                                    <img src={item.imageUrl} alt={item.listingTitle}
                                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-rose-100" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-on-surface truncate">{item.listingTitle}</p>
                                      <p className="text-[10px] text-on-surface-variant mt-0.5">{item.brandName} · {item.modelName}</p>
                                    </div>
                                    <p className="text-sm font-black text-primary shrink-0">{vnd(item.price)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order info */}
                            <div>
                              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-primary">info</span>
                                Order Info
                              </p>
                              <div className="space-y-2.5">
                                {[
                                  { label: 'Shipping Address', value: tx.shippingAddress, icon: 'location_on', color: 'text-slate-500' },
                                  { label: 'Order Date', value: new Date(tx.orderDate).toLocaleString('vi-VN'), icon: 'calendar_today', color: 'text-slate-500' },
                                  tx.escrowReleasedAt && { label: 'Escrow Released', value: new Date(tx.escrowReleasedAt).toLocaleString('vi-VN'), icon: 'check_circle', color: 'text-emerald-600' },
                                  tx.refundedAt && { label: 'Refunded At', value: new Date(tx.refundedAt).toLocaleString('vi-VN'), icon: 'undo', color: 'text-amber-600' },
                                ].filter(Boolean).map(row => (
                                  <div key={row.label} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-rose-100 shadow-sm">
                                    <span className={`material-symbols-outlined text-sm mt-0.5 flex-shrink-0 ${row.color}`}
                                      style={{ fontVariationSettings: '"FILL" 1' }}>{row.icon}</span>
                                    <div>
                                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{row.label}</p>
                                      <p className={`text-xs font-semibold mt-0.5 ${row.color}`}>{row.value}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>

          {/* ── Pagination ───────────────────────────────── */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-rose-100 bg-rose-50/40">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Showing {filtered.length} of {stats.totalTransactions} results
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition-all disabled:opacity-40 bg-white border border-rose-200 text-on-surface hover:bg-rose-50">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : Math.max(1, page - 2) + i;
                  if (p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl font-black text-xs transition-all ${
                        page === p
                          ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(78,33,32,0.35)]'
                          : 'bg-white border border-rose-200 text-on-surface hover:bg-rose-50'
                      }`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition-all disabled:opacity-40 bg-white border border-rose-200 text-on-surface hover:bg-rose-50">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
