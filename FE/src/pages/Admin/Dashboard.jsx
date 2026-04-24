import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [stats, setStats] = useState({
    totalEscrowVolume: null,
    totalUsers: null,
    totalReviews: null,
    totalSoldListings: null,
    totalApprovedListings: null,
    totalTransactions: null,
    pendingListings: null,
    rejectedListings: null,
    totalRefunded: null,
    activeEscrows: null,
    avgRating: null,
    reportCount: null,
    reportPending: null,
    reportResolved: null,
    reportDismissed: null,
    reportWaitAdmin: null,
  });

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };

    // Transactions
    fetch(`${API_BASE}/admin/transactions?page=1&pageSize=1`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalEscrowVolume: d.totalEscrowVolume ?? 0, totalTransactions: d.totalTransactions ?? 0, totalRefunded: d.totalRefunded ?? 0, activeEscrows: d.activeEscrows ?? 0 })))
      .catch(() => {});

    // Users
    fetch(`${API_BASE}/Auth/users?pageNumber=1&pageSize=1`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalUsers: d.totalRecords ?? 0 })))
      .catch(() => {});

    // Reviews
    fetch(`${API_BASE}/admin/orders/reviews`, { headers: h })
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : (d.reviews ?? []);
        const avg = list.length > 0 ? (list.reduce((s, r) => s + (r.rating ?? 0), 0) / list.length).toFixed(1) : 0;
        setStats(s => ({ ...s, totalReviews: list.length, avgRating: avg }));
      })
      .catch(() => {});

    // Sold listings
    fetch(`${API_BASE}/admin/listings?page=1&pageSize=1&status=Sold`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalSoldListings: d.totalItems ?? d.totalCount ?? d.total ?? (d.items ?? d.listings ?? []).length })))
      .catch(() => {});

    // Approved listings
    fetch(`${API_BASE}/admin/listings?page=1&pageSize=1&status=Approved`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalApprovedListings: d.totalItems ?? d.totalCount ?? d.total ?? (d.items ?? d.listings ?? []).length })))
      .catch(() => {});

    // Pending listings
    fetch(`${API_BASE}/admin/listings/pending?page=1&pageSize=1`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, pendingListings: d.totalItems ?? d.totalCount ?? d.total ?? (d.items ?? d.listings ?? []).length })))
      .catch(() => {});

    // Rejected listings
    fetch(`${API_BASE}/admin/listings?page=1&pageSize=1&status=Rejected`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, rejectedListings: d.totalItems ?? d.totalCount ?? d.total ?? (d.items ?? d.listings ?? []).length })))
      .catch(() => {});

    // Reports — fetch full list để lấy breakdown theo status
    fetch(`${API_BASE}/admin/reports`, { headers: h })
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : (d.reports ?? d.data ?? []);
        const pending   = list.filter(r => r.status === 'Pending').length;
        const resolved  = list.filter(r => r.status === 'Resolved').length;
        const dismissed = list.filter(r => r.status === 'Dismissed' || r.status === 'DismissedInsp').length;
        const waitAdmin = list.filter(r => r.status === 'WaitingForAdmin').length;
        setStats(s => ({ ...s, reportCount: list.length, reportPending: pending, reportResolved: resolved, reportDismissed: dismissed, reportWaitAdmin: waitAdmin }));
      })
      .catch(() => {});
  }, [token]);

  const fmt = (v) => v === null ? '—' : v.toLocaleString();

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-8 px-8 pb-12 min-h-screen">
        {/* Header Section */}
        <header className="mb-12 rounded-2xl overflow-hidden relative flex items-center bg-gradient-to-r from-primary/10 via-surface to-surface shadow-[0_4px_24px_rgba(78,33,32,0.08)] px-10 py-8 min-h-[160px]">
          <h2 className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tighter leading-tight z-10 relative">
            Admin<br />Overview.
          </h2>
          <div className="absolute inset-0 left-1/3">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
              alt="Analytics"
              className="w-full h-full object-cover"
              style={{ filter: 'hue-rotate(160deg) saturate(0.6) brightness(0.8)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent" />
          </div>
        </header>

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-2xl relative overflow-hidden shadow-[0_8px_32px_rgba(78,33,32,0.12)] group flex flex-col border-t-4 border-primary hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-primary">receipt_long</span>
            </div>
            <p className="text-[10px] uppercase font-black text-primary tracking-widest mb-4 h-10 flex items-start">
              Total Revenue
            </p>
            <h3 className="text-5xl font-headline font-black text-primary mb-3 tracking-tighter">
              {stats.totalEscrowVolume === null ? '—' : `${stats.totalEscrowVolume.toLocaleString('vi-VN')}₫`}
            </h3>
            <div className="flex items-center gap-2 text-primary/70 mt-auto">
              <span className="material-symbols-outlined text-sm">payments</span>
              <span className="text-xs font-bold">Tổng tiền giao dịch</span>
            </div>
          </div>
          {/* Active Users */}
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-8 rounded-2xl relative overflow-hidden shadow-[0_8px_32px_rgba(78,33,32,0.12)] group flex flex-col border-t-4 border-secondary hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-secondary">group</span>
            </div>
            <p className="text-[10px] uppercase font-black text-secondary tracking-widest mb-4 h-10 flex items-start">
              Active Users
            </p>
            <h3 className="text-5xl font-headline font-black text-on-surface mb-3 tracking-tighter">
              {fmt(stats.totalUsers)}
            </h3>
            <div className="flex items-center gap-2 text-secondary/70 mt-auto">
              <span className="material-symbols-outlined text-sm">person</span>
              <span className="text-xs font-bold">Tổng người dùng</span>
            </div>
          </div>
          {/* Total Number Of Reviews */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-8 rounded-2xl relative overflow-hidden shadow-[0_8px_32px_rgba(78,33,32,0.12)] group flex flex-col border-t-4 border-orange-500 hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-orange-500">rate_review</span>
            </div>
            <p className="text-[10px] uppercase font-black text-orange-600 tracking-widest mb-4 h-10 flex items-start">
              Total Number Of Reviews
            </p>
            <h3 className="text-5xl font-headline font-black text-on-surface mb-3 tracking-tighter">
              {fmt(stats.totalReviews)}
            </h3>
            <div className="flex items-center gap-2 text-orange-500/70 mt-auto">
              <span className="material-symbols-outlined text-sm">star</span>
              <span className="text-xs font-bold">Tổng đánh giá</span>
            </div>
          </div>
          {/* Total Sold Listings */}
          <div className="bg-gradient-to-br from-tertiary/10 to-tertiary/5 p-8 rounded-2xl relative overflow-hidden shadow-[0_8px_32px_rgba(78,33,32,0.12)] group flex flex-col border-t-4 border-tertiary hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-tertiary">sell</span>
            </div>
            <p className="text-[10px] uppercase font-black text-tertiary tracking-widest mb-4 h-10 flex items-start">
              Total Sold Listings
            </p>
            <h3 className="text-5xl font-headline font-black text-on-surface mb-3 tracking-tighter">
              {fmt(stats.totalSoldListings)}
            </h3>
            <div className="flex items-center gap-2 text-tertiary/70 mt-auto">
              <span className="material-symbols-outlined text-sm">directions_bike</span>
              <span className="text-xs font-bold">Tổng xe đã bán</span>
            </div>
          </div>
        </div>

        {/* 5 Module Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* 1 · USER MANAGEMENT */}
          {(() => {
            const total = stats.totalUsers ?? 0;
            const r = 62, cx = 80, cy = 80, sw = 11, circ = 2 * Math.PI * r;
            return (
              <div className="relative rounded-3xl overflow-hidden p-7 flex flex-col gap-5 cursor-default"
                style={{ background: 'linear-gradient(145deg,#0f0c29,#302b63,#24243e)', boxShadow: '0 30px 80px -10px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle,#818cf8,transparent)' }} />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.25em] text-indigo-400 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />User Management
                    </span>
                    <h4 className="text-2xl font-headline font-black text-white tracking-tighter leading-none">Người dùng</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.25)', backdropFilter: 'blur(12px)', border: '1px solid rgba(165,180,252,0.2)' }}>
                    <span className="material-symbols-outlined text-indigo-300 text-2xl">group</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 relative z-10">
                  <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0" style={{ filter: 'drop-shadow(0 0 20px rgba(129,140,248,0.6))' }}>
                    <defs><linearGradient id="ug1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c7d2fe" /><stop offset="100%" stopColor="#6366f1" /></linearGradient></defs>
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#ug1)" strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={0} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
                    <circle cx={cx} cy={cy} r={r - sw - 6} fill="rgba(255,255,255,0.04)" />
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="30" fontWeight="900" fill="white">{total}</text>
                    <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9" fontWeight="800" fill="rgba(165,180,252,0.7)" letterSpacing="3">USERS</text>
                  </svg>
                  <div className="flex-1 space-y-3">
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">Total Users</p>
                      <p className="text-4xl font-black text-white leading-none">{total.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(165,180,252,0.15)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      <span className="text-[10px] text-indigo-300 font-bold">Live · Platform active</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2 · LISTING MODERATION */}
          {(() => {
            const approved = stats.totalApprovedListings ?? 0;
            const pending  = stats.pendingListings ?? 0;
            const rejected = stats.rejectedListings ?? 0;
            const sold     = stats.totalSoldListings ?? 0;
            const total    = approved + pending + rejected + sold || 1;
            const segs = [
              { label: 'Approved', value: approved, c1: '#6ee7b7', c2: '#10b981', glow: 'rgba(16,185,129,0.6)' },
              { label: 'Pending',  value: pending,  c1: '#fde68a', c2: '#f59e0b', glow: 'rgba(245,158,11,0.6)' },
              { label: 'Rejected', value: rejected, c1: '#fca5a5', c2: '#ef4444', glow: 'rgba(239,68,68,0.6)'  },
              { label: 'Sold',     value: sold,     c1: '#c4b5fd', c2: '#8b5cf6', glow: 'rgba(139,92,246,0.6)' },
            ];
            return (
              <div className="relative rounded-3xl overflow-hidden p-7 flex flex-col gap-5 cursor-default"
                style={{ background: 'linear-gradient(145deg,#022c22,#064e3b,#065f46)', boxShadow: '0 30px 80px -10px rgba(16,185,129,0.45), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle,#34d399,transparent)' }} />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.25em] text-emerald-400 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />Listing Moderation
                    </span>
                    <h4 className="text-2xl font-headline font-black text-white tracking-tighter leading-none">Trạng thái listing</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(110,231,183,0.2)' }}>
                    <span className="material-symbols-outlined text-emerald-300 text-2xl">directions_bike</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="flex h-6 rounded-2xl overflow-hidden gap-px mb-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    {segs.map(s => (
                      <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: `linear-gradient(90deg,${s.c1},${s.c2})`, boxShadow: `0 0 12px ${s.glow}` }}
                        className="transition-all duration-1000 first:rounded-l-2xl last:rounded-r-2xl" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {segs.map(s => (
                      <div key={s.label} className="flex items-center justify-between rounded-xl px-4 py-2.5"
                        style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ background: `linear-gradient(135deg,${s.c1},${s.c2})`, boxShadow: `0 0 8px ${s.glow}` }} />
                          <span className="text-xs text-emerald-100 font-bold">{s.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400 font-bold">{total > 0 ? Math.round((s.value / total) * 100) : 0}%</span>
                          <span className="text-base font-black text-white">{s.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3 · TRANSACTIONS */}
          {(() => {
            const txTotal   = stats.totalTransactions ?? 0;
            const refunded  = stats.totalRefunded ?? 0;
            const active    = stats.activeEscrows ?? 0;
            const escrowVolume = stats.totalEscrowVolume ?? 0;
            const completed = Math.max(txTotal - active, 0);
            const maxV = Math.max(txTotal, 1);
            const rows = [
              { label: 'Total',                value: txTotal,      display: txTotal.toLocaleString('vi-VN'),                    c1: '#fca5a5', c2: '#f87171', glow: 'rgba(248,113,113,0.7)', pct: 100 },
              { label: 'Completed',            value: completed,    display: completed.toLocaleString('vi-VN'),                  c1: '#6ee7b7', c2: '#34d399', glow: 'rgba(52,211,153,0.7)',  pct: Math.max((completed / maxV) * 100, completed > 0 ? 4 : 0) },
              { label: 'Total Escrow Volume',  value: escrowVolume, display: escrowVolume.toLocaleString('vi-VN') + '₫',         c1: '#a5b4fc', c2: '#818cf8', glow: 'rgba(129,140,248,0.7)', pct: escrowVolume > 0 ? 85 : 0 },
              { label: 'Total Refunded',       value: refunded,     display: refunded.toLocaleString('vi-VN') + '₫',             c1: '#fde68a', c2: '#fbbf24', glow: 'rgba(251,191,36,0.7)',  pct: refunded > 0 ? 80 : 0 },
            ];
            return (
              <div className="relative rounded-3xl overflow-hidden p-7 flex flex-col gap-5 cursor-default"
                style={{ background: 'linear-gradient(145deg,#3b0000,#7f1d1d,#991b1b)', boxShadow: '0 30px 80px -10px rgba(239,68,68,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                <div className="absolute -top-20 right-0 w-60 h-60 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle,#fca5a5,transparent)' }} />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.25em] text-red-300 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />Transactions
                    </span>
                    <h4 className="text-2xl font-headline font-black text-white tracking-tighter leading-none">Giao dịch</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(252,165,165,0.2)' }}>
                    <span className="material-symbols-outlined text-red-300 text-2xl">receipt_long</span>
                  </div>
                </div>
                <div className="space-y-4 relative z-10">
                  {rows.map(b => (
                    <div key={b.label}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: b.c2, boxShadow: `0 0 6px ${b.glow}` }} />
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-red-200">{b.label}</span>
                        </div>
                        <span className="text-sm font-black text-white">{b.display}</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${b.pct}%`, background: `linear-gradient(90deg,${b.c1},${b.c2})`, boxShadow: `0 0 10px ${b.glow}` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 4 · REVIEWS */}
          {(() => {
            const total = stats.totalReviews ?? 0;
            const avg   = parseFloat(stats.avgRating ?? 0);
            const pct   = avg / 5;
            const r = 62, cx = 80, cy = 80, sw = 11, circ = 2 * Math.PI * r;
            return (
              <div className="relative rounded-3xl overflow-hidden p-7 flex flex-col gap-5 cursor-default"
                style={{ background: 'linear-gradient(145deg,#1c0a00,#7c2d12,#c2410c)', boxShadow: '0 30px 80px -10px rgba(249,115,22,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle,#fdba74,transparent)' }} />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.25em] text-orange-300 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />Reviews
                    </span>
                    <h4 className="text-2xl font-headline font-black text-white tracking-tighter leading-none">Đánh giá</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(253,186,116,0.2)' }}>
                    <span className="material-symbols-outlined text-orange-300 text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 relative z-10">
                  <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0" style={{ filter: 'drop-shadow(0 0 24px rgba(249,115,22,0.6))' }}>
                    <defs><linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fed7aa" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#rg1)" strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
                    <circle cx={cx} cy={cy} r={r - sw - 6} fill="rgba(255,255,255,0.04)" />
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="28" fontWeight="900" fill="white">{avg}</text>
                    <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9" fontWeight="800" fill="rgba(253,186,116,0.7)" letterSpacing="2">{total} REVIEWS</text>
                  </svg>
                  <div className="flex-1 space-y-3">
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-[9px] text-orange-400 font-black uppercase tracking-[0.2em] mb-1">Avg Rating</p>
                      <p className="text-4xl font-black text-white leading-none">{avg}<span className="text-2xl ml-1">⭐</span></p>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-[9px] text-orange-400 font-black uppercase tracking-[0.2em] mb-1">Total Reviews</p>
                      <p className="text-3xl font-black text-white leading-none">{total}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 5 · REPORTS */}
          {(() => {
            const count      = stats.reportCount ?? 0;
            const pending    = stats.reportPending ?? 0;
            const resolved   = stats.reportResolved ?? 0;
            const dismissed  = stats.reportDismissed ?? 0;
            const waitAdmin  = stats.reportWaitAdmin ?? 0;
            const maxR = Math.max(count, 10);
            const pct = Math.min(count / maxR, 1);
            const r = 68, cx = 100, cy = 90, sw = 12;
            const circ = Math.PI * r;
            const sx = cx - r, ex = cx + r;
            const breakdown = [
              { label: 'Pending',    value: pending,   color: '#fbbf24', glow: 'rgba(251,191,36,0.7)'  },
              { label: 'Resolved',   value: resolved,  color: '#34d399', glow: 'rgba(52,211,153,0.7)'  },
              { label: 'Dismissed',  value: dismissed, color: '#f87171', glow: 'rgba(248,113,113,0.7)' },
              { label: 'Chờ Admin',  value: waitAdmin, color: '#a5b4fc', glow: 'rgba(165,180,252,0.7)' },
            ].filter(b => b.value > 0);
            return (
              <div className="relative rounded-3xl overflow-hidden p-7 flex flex-col gap-5 cursor-default"
                style={{ background: 'linear-gradient(145deg,#09090b,#18181b,#27272a)', boxShadow: '0 30px 80px -10px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse,#ef4444,transparent)' }} />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.25em] text-red-400 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />Reports
                    </span>
                    <h4 className="text-2xl font-headline font-black text-white tracking-tighter leading-none">Báo cáo vi phạm</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(252,165,165,0.15)' }}>
                    <span className="material-symbols-outlined text-red-400 text-2xl">flag</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 relative z-10">
                  {/* Gauge */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <svg width="180" height="110" viewBox="0 0 200 120" style={{ filter: 'drop-shadow(0 0 30px rgba(239,68,68,0.5))' }}>
                      <defs><linearGradient id="rpg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fca5a5" /><stop offset="100%" stopColor="#dc2626" /></linearGradient></defs>
                      <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} strokeLinecap="round" />
                      <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke="url(#rpg)" strokeWidth={sw} strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                        style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.9))' }} />
                      <text x={cx} y={cy - 12} textAnchor="middle" fontSize="36" fontWeight="900" fill="white">{count}</text>
                      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fontWeight="800" fill="rgba(252,165,165,0.7)" letterSpacing="3">TOTAL REPORTS</text>
                    </svg>
                  </div>
                  {/* Breakdown */}
                  <div className="flex-1 space-y-2">
                    {breakdown.length > 0 ? breakdown.map(b => (
                      <div key={b.label} className="flex items-center justify-between rounded-xl px-3 py-2"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color, boxShadow: `0 0 6px ${b.glow}` }} />
                          <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{b.label}</span>
                        </div>
                        <span className="text-sm font-black text-white">{b.value}</span>
                      </div>
                    )) : (
                      <div className="rounded-xl px-3 py-3 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-zinc-400 font-bold">Chưa có dữ liệu</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
