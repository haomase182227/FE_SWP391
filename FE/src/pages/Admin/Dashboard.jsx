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
    totalApprovedListings: null,
    totalTransactions: null,
    pendingListings: null,
  });

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };

    // Total escrow volume + total transactions
    fetch(`${API_BASE}/admin/transactions?page=1&pageSize=1`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalEscrowVolume: d.totalEscrowVolume ?? 0, totalTransactions: d.totalTransactions ?? 0 })))
      .catch(() => {});

    // Total users
    fetch(`${API_BASE}/Auth/users?pageNumber=1&pageSize=1`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalUsers: d.totalRecords ?? 0 })))
      .catch(() => {});

    // Total reviews
    fetch(`${API_BASE}/admin/orders/reviews`, { headers: h })
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : (d.reviews ?? []);
        setStats(s => ({ ...s, totalReviews: list.length }));
      })
      .catch(() => {});

    // Total approved listings
    fetch(`${API_BASE}/admin/listings?page=1&pageSize=1&status=Approved`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalApprovedListings: d.totalItems ?? d.totalCount ?? d.total ?? (d.items ?? d.listings ?? []).length })))
      .catch(() => {});

    // Pending listings
    fetch(`${API_BASE}/admin/listings/pending?page=1&pageSize=1`, { headers: h })
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, pendingListings: d.totalItems ?? d.totalCount ?? d.total ?? (d.items ?? d.listings ?? []).length })))
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
          {/* Total Approved Listings */}
          <div className="bg-gradient-to-br from-tertiary/10 to-tertiary/5 p-8 rounded-2xl relative overflow-hidden shadow-[0_8px_32px_rgba(78,33,32,0.12)] group flex flex-col border-t-4 border-tertiary hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-tertiary">directions_bike</span>
            </div>
            <p className="text-[10px] uppercase font-black text-tertiary tracking-widest mb-4 h-10 flex items-start">
              Total Approved Listings
            </p>
            <h3 className="text-5xl font-headline font-black text-on-surface mb-3 tracking-tighter">
              {fmt(stats.totalApprovedListings)}
            </h3>
            <div className="flex items-center gap-2 text-tertiary/70 mt-auto">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span className="text-xs font-bold">Xe đã được duyệt</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          {(() => {
            const chartData = [
              { label: 'Users', value: stats.totalUsers ?? 0, color: '#6366f1' },
              { label: 'Transactions', value: stats.totalTransactions ?? 0, color: '#a83120' },
              { label: 'Reviews', value: stats.totalReviews ?? 0, color: '#f97316' },
              { label: 'Approved', value: stats.totalApprovedListings ?? 0, color: '#22c55e' },
              { label: 'Pending', value: stats.pendingListings ?? 0, color: '#eab308' },
            ];
            const W = 500, H = 300, padL = 50, padR = 16, padT = 28, padB = 50;
            const chartW = W - padL - padR;
            const chartH = H - padT - padB;
            const maxVal = Math.max(...chartData.map(d => d.value), 1);
            const barW = Math.min(52, (chartW / chartData.length) * 0.55);
            const gap = chartW / chartData.length;
            const yTicks = 5;
            return (
              <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(78,33,32,0.10)] border border-outline-variant/10 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-1">Biểu đồ cột</p>
                    <h3 className="text-xl font-headline font-black text-on-surface tracking-tighter">Platform Statistics</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full">Live</span>
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                  {Array.from({ length: yTicks + 1 }, (_, i) => {
                    const val = Math.round((maxVal / yTicks) * i);
                    const y = padT + chartH - (i / yTicks) * chartH;
                    return (
                      <g key={i}>
                        <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af" fontWeight="600">{val.toLocaleString()}</text>
                      </g>
                    );
                  })}
                  {chartData.map((d, i) => {
                    const barH = maxVal > 0 ? (d.value / maxVal) * chartH : 0;
                    const cx = padL + gap * i + gap / 2;
                    const x = cx - barW / 2;
                    const y = padT + chartH - barH;
                    return (
                      <g key={d.label}>
                        <rect x={x} y={y} width={barW} height={Math.max(barH, 2)} rx="5" fill={d.color} opacity="0.9" />
                        <text x={cx} y={y - 5} textAnchor="middle" fontSize="11" fill={d.color} fontWeight="800">{d.value.toLocaleString()}</text>
                        <text x={cx} y={padT + chartH + 16} textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="700">{d.label}</text>
                      </g>
                    );
                  })}
                  <line x1={padL} x2={W - padR} y1={padT + chartH} y2={padT + chartH} stroke="#d1d5db" strokeWidth="1.5" />
                </svg>
                <div className="flex flex-wrap gap-4 mt-3 pt-4 border-t border-outline-variant/10">
                  {chartData.map(d => (
                    <div key={d.label} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Pie Chart */}
          {(() => {
            const pieData = [
              { label: 'Users', value: stats.totalUsers ?? 0, color: '#6366f1' },
              { label: 'Transactions', value: stats.totalTransactions ?? 0, color: '#a83120' },
              { label: 'Reviews', value: stats.totalReviews ?? 0, color: '#f97316' },
              { label: 'Approved', value: stats.totalApprovedListings ?? 0, color: '#22c55e' },
              { label: 'Pending', value: stats.pendingListings ?? 0, color: '#eab308' },
            ].filter(d => d.value > 0);
            const total = pieData.reduce((s, d) => s + d.value, 0);
            const pcx = 160, pcy = 160, pr = 130;
            let cumAngle = -Math.PI / 2;
            const slices = pieData.map(d => {
              const angle = total > 0 ? (d.value / total) * 2 * Math.PI : 0;
              const start = cumAngle;
              cumAngle += angle;
              const end = cumAngle;
              const mid = start + angle / 2;
              return {
                ...d, angle,
                x1: pcx + pr * Math.cos(start), y1: pcy + pr * Math.sin(start),
                x2: pcx + pr * Math.cos(end),   y2: pcy + pr * Math.sin(end),
                lx: pcx + pr * 0.65 * Math.cos(mid),
                ly: pcy + pr * 0.65 * Math.sin(mid),
                large: angle > Math.PI ? 1 : 0,
              };
            });
            return (
              <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(78,33,32,0.10)] border border-outline-variant/10 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-1">Biểu đồ tròn</p>
                    <h3 className="text-xl font-headline font-black text-on-surface tracking-tighter">Data Distribution</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full">Live</span>
                </div>
                <div className="flex items-center gap-6 flex-1">
                  <svg viewBox="0 0 320 320" className="w-52 h-52 flex-shrink-0">
                    {total === 0
                      ? <circle cx={pcx} cy={pcy} r={pr} fill="#e5e7eb" />
                      : slices.map((s, i) => (
                        <path key={i}
                          d={`M ${pcx} ${pcy} L ${s.x1} ${s.y1} A ${pr} ${pr} 0 ${s.large} 1 ${s.x2} ${s.y2} Z`}
                          fill={s.color} opacity="0.9" stroke="white" strokeWidth="2" />
                      ))
                    }
                    {slices.map((s, i) => s.angle > 0.25 && (
                      <text key={i} x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle"
                        fontSize="13" fill="white" fontWeight="800">{s.value.toLocaleString()}</text>
                    ))}
                  </svg>
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    {pieData.map(d => (
                      <div key={d.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                          <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant truncate">{d.label}</span>
                        </div>
                        <span className="text-xs font-black text-on-surface flex-shrink-0">{d.value.toLocaleString()}</span>
                      </div>
                    ))}
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
