import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE_URL = 'https://swp391-bike-marketplace-backend-1.onrender.com/api/v1';

/* ── Badge configs ──────────────────────────────────────────── */
const STATUS_CFG = {
  Success: {
    cls: 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.2)]',
    icon: 'check_circle',
    dot: 'bg-emerald-500',
  },
  Pending: {
    cls: 'bg-amber-100 text-amber-700 border border-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.2)]',
    icon: 'schedule',
    dot: 'bg-amber-500',
  },
  Failed: {
    cls: 'bg-red-100 text-red-700 border border-red-300 shadow-[0_2px_8px_rgba(239,68,68,0.2)]',
    icon: 'cancel',
    dot: 'bg-red-500',
  },
};

const ROLE_CFG = {
  Buyer: {
    cls: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    icon: 'person',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    glow: '0 2px 8px rgba(99,102,241,0.35)',
  },
  Seller: {
    cls: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: 'storefront',
    gradient: 'linear-gradient(135deg,#b45309,#f59e0b)',
    glow: '0 2px 8px rgba(245,158,11,0.35)',
  },
};

export default function WalletManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTopUpVolume: 0,
    totalTopUpToday: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    successRate: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({ status: '', userRole: '' });

  useEffect(() => {
    if (token) fetchTransactions();
  }, [currentPage, filters, token]);

  async function fetchTransactions() {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, pageSize });
      if (filters.status)   params.append('status', filters.status);
      if (filters.userRole) params.append('userRole', filters.userRole);
      const res = await fetch(`${API_BASE_URL}/admin/wallets/top-ups?${params}`, {
        headers: { Authorization: `Bearer ${token}`, accept: '*/*' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setStats({
        totalTopUpVolume:       data.totalTopUpVolume       || 0,
        totalTopUpToday:        data.totalTopUpToday        || 0,
        totalTransactions:      data.totalTransactions      || 0,
        successfulTransactions: data.successfulTransactions || 0,
        pendingTransactions:    data.pendingTransactions    || 0,
        failedTransactions:     data.failedTransactions     || 0,
        successRate:            data.successRate            || 0,
      });
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }

  /* ── Stat cards ─────────────────────────────────────────── */
  const statCards = [
    {
      label: 'Tổng nạp',
      value: fmt(stats.totalTopUpVolume),
      icon: 'account_balance_wallet',
      sub: 'All time',
      subIcon: 'account_balance_wallet',
      gradient: 'linear-gradient(135deg,#1e40af,#3b82f6)',
      glow: '0 12px 40px rgba(59,130,246,0.35)',
      accent: '#bfdbfe',
      sub2: '#93c5fd',
    },
    {
      label: 'Nạp hôm nay',
      value: fmt(stats.totalTopUpToday),
      icon: 'today',
      sub: "Today's deposits",
      subIcon: 'today',
      gradient: 'linear-gradient(135deg,#065f46,#10b981)',
      glow: '0 12px 40px rgba(16,185,129,0.35)',
      accent: '#a7f3d0',
      sub2: '#6ee7b7',
    },
    {
      label: 'Giao dịch',
      value: stats.totalTransactions,
      icon: 'receipt_long',
      sub: null,
      gradient: 'linear-gradient(135deg,#4e2120,#9b3a38)',
      glow: '0 12px 40px rgba(78,33,32,0.35)',
      accent: '#fecaca',
      sub2: '#fca5a5',
      breakdown: true,
    },
    {
      label: 'Tỷ lệ thành công',
      value: `${stats.successRate.toFixed(1)}%`,
      icon: 'trending_up',
      sub: 'Success rate',
      subIcon: 'trending_up',
      gradient: 'linear-gradient(135deg,#6d28d9,#8b5cf6)',
      glow: '0 12px 40px rgba(109,40,217,0.35)',
      accent: '#ddd6fe',
      sub2: '#c4b5fd',
    },
  ];

  /* ── Filter options ─────────────────────────────────────── */
  const statusOpts = [
    { val: '',         label: 'Tất cả trạng thái', icon: 'apps' },
    { val: 'Success',  label: 'Success',            icon: 'check_circle' },
    { val: 'Pending',  label: 'Pending',            icon: 'schedule' },
    { val: 'Failed',   label: 'Failed',             icon: 'cancel' },
  ];
  const roleOpts = [
    { val: '',       label: 'Tất cả vai trò', icon: 'group' },
    { val: 'Buyer',  label: 'Buyer',          icon: 'person' },
    { val: 'Seller', label: 'Seller',         icon: 'storefront' },
  ];

  const statusActiveCls = {
    '':        'bg-slate-800 text-white shadow-[0_4px_14px_rgba(30,41,59,0.3)]',
    Success:   'bg-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.45)]',
    Pending:   'bg-amber-500 text-white shadow-[0_4px_14px_rgba(245,158,11,0.45)]',
    Failed:    'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.45)]',
  };
  const roleActiveCls = {
    '':       'bg-slate-800 text-white shadow-[0_4px_14px_rgba(30,41,59,0.3)]',
    Buyer:    'bg-indigo-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.45)]',
    Seller:   'bg-amber-500 text-white shadow-[0_4px_14px_rgba(245,158,11,0.45)]',
  };

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      <main className="ml-64 pt-8 px-8 pb-16">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 6px 20px rgba(78,33,32,0.4)' }}>
            <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-0.5">Financial Overview</p>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none">Wallet Management</h1>
            <p className="text-sm text-on-surface-variant mt-1">Quản lý lịch sử nạp tiền của Buyer và Seller</p>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {statCards.map(s => (
            <div key={s.label} className="relative rounded-3xl overflow-hidden p-6 flex flex-col gap-3 cursor-default hover:-translate-y-1 transition-transform duration-300"
              style={{ background: s.gradient, boxShadow: s.glow }}>
              {/* dot grid */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              {/* glow blob */}
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-25 blur-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle,${s.accent},transparent)` }} />

              <div className="flex items-center justify-between relative z-10">
                <p className="text-[10px] uppercase font-black tracking-[0.22em]" style={{ color: s.accent }}>{s.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <span className="material-symbols-outlined text-lg text-white">{s.icon}</span>
                </div>
              </div>

              <h3 className="text-2xl font-headline font-black tracking-tighter text-white relative z-10 leading-none">{s.value}</h3>

              {s.breakdown ? (
                <div className="flex items-center gap-3 relative z-10">
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-200">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                    {stats.successfulTransactions}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-200">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>schedule</span>
                    {stats.pendingTransactions}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-red-200">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>cancel</span>
                    {stats.failedTransactions}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.sub2 }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.sub2 }}>{s.sub}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Filter bar ──────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-white shadow-[0_4px_20px_rgba(78,33,32,0.1)] border border-rose-100">
          {/* Role filter — bên trái */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(78,33,32,0.05)' }}>
            {roleOpts.map(o => (
              <button key={o.val} onClick={() => handleFilterChange('userRole', o.val)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                  filters.userRole === o.val
                    ? roleActiveCls[o.val]
                    : 'text-on-surface-variant hover:bg-rose-50 hover:text-on-surface'
                }`}>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>{o.icon}</span>
                {o.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-rose-200" />

          {/* Status filter — bên phải */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(78,33,32,0.05)' }}>
            {statusOpts.map(o => (
              <button key={o.val} onClick={() => handleFilterChange('status', o.val)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                  filters.status === o.val
                    ? statusActiveCls[o.val]
                    : 'text-on-surface-variant hover:bg-rose-50 hover:text-on-surface'
                }`}>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>{o.icon}</span>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(78,33,32,0.1)] border border-rose-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
              <p className="text-sm text-on-surface-variant">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.06),rgba(78,33,32,0.03))', borderBottom: '2px solid rgba(78,33,32,0.08)' }}>
                      {[
                        { label: 'ID',            center: false },
                        { label: 'Mã GD',         center: false },
                        { label: 'Người dùng',    center: false },
                        { label: 'Vai trò',       center: true  },
                        { label: 'Số tiền',       center: true  },
                        { label: 'Trạng thái',    center: true  },
                        { label: 'Ngày tạo',      center: false },
                        { label: 'Ngày thanh toán', center: false },
                      ].map(h => (
                        <th key={h.label}
                          className={`py-4 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ${h.center ? 'text-center' : ''}`}>
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-20 text-center">
                          <span className="material-symbols-outlined text-5xl text-rose-200 block mx-auto mb-3">receipt_long</span>
                          <p className="text-sm text-on-surface-variant">Không có giao dịch nào</p>
                          <p className="text-xs text-on-surface-variant/60 mt-1">Dữ liệu sẽ hiển thị khi có giao dịch nạp tiền</p>
                        </td>
                      </tr>
                    ) : transactions.map(tx => {
                      const stCfg  = STATUS_CFG[tx.status];
                      const rolCfg = ROLE_CFG[tx.userRole];
                      return (
                        <tr key={tx.transactionId}
                          className="transition-colors duration-150"
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(78,33,32,0.025)'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}>

                          {/* ID */}
                          <td className="py-4 px-5">
                            <p className="font-black text-sm text-on-surface tracking-tight">#{tx.transactionId}</p>
                          </td>

                          {/* Mã GD */}
                          <td className="py-4 px-5">
                            <p className="text-[11px] font-mono text-on-surface-variant bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 inline-block max-w-[160px] truncate">
                              {tx.transactionRef}
                            </p>
                          </td>

                          {/* Người dùng */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                                style={{ background: rolCfg?.gradient ?? 'linear-gradient(135deg,#64748b,#94a3b8)', boxShadow: rolCfg?.glow ?? 'none' }}>
                                {tx.userName?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-on-surface">{tx.userName}</p>
                                <p className="text-[10px] text-on-surface-variant">{tx.userEmail}</p>
                                <p className="text-[10px] text-on-surface-variant/60">ID: {tx.userId}</p>
                              </div>
                            </div>
                          </td>

                          {/* Vai trò */}
                          <td className="py-4 px-5 text-center">
                            {rolCfg ? (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${rolCfg.cls}`}>
                                <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>{rolCfg.icon}</span>
                                {tx.userRole}
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                                {tx.userRole}
                              </span>
                            )}
                          </td>

                          {/* Số tiền */}
                          <td className="py-4 px-5 text-center">
                            <p className="font-black text-sm text-primary">{fmt(tx.amount)}</p>
                          </td>

                          {/* Trạng thái */}
                          <td className="py-4 px-5 text-center">
                            {stCfg ? (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stCfg.cls}`}>
                                <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>{stCfg.icon}</span>
                                {tx.status}
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                                {tx.status}
                              </span>
                            )}
                          </td>

                          {/* Ngày tạo */}
                          <td className="py-4 px-5">
                            <p className="text-[11px] text-on-surface-variant">{fmtDate(tx.transactionDate)}</p>
                          </td>

                          {/* Ngày thanh toán */}
                          <td className="py-4 px-5">
                            {tx.paidAt ? (
                              <p className="text-[11px] text-emerald-600 font-semibold">{fmtDate(tx.paidAt)}</p>
                            ) : (
                              <span className="text-[11px] text-on-surface-variant/40">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ─────────────────────────────── */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-rose-100 bg-rose-50/40">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Trang {currentPage} / {totalPages} · Tổng {stats.totalTransactions} giao dịch
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 bg-white border border-rose-200 text-on-surface hover:bg-rose-50">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = totalPages <= 5 ? i + 1 : Math.max(1, currentPage - 2) + i;
                    if (p > totalPages) return null;
                    return (
                      <button key={p} onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl font-black text-xs transition-all ${
                          currentPage === p
                            ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(78,33,32,0.35)]'
                            : 'bg-white border border-rose-200 text-on-surface hover:bg-rose-50'
                        }`}>
                        {p}
                      </button>
                    );
                  })}

                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 bg-white border border-rose-200 text-on-surface hover:bg-rose-50">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
