import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const vnd = (n) => (n ?? 0).toLocaleString('vi-VN') + '₫';

const STATUS_STYLE = {
  Success: 'bg-tertiary text-on-tertiary',
  Pending: 'bg-surface-container-highest text-zinc-500',
  Failed: 'bg-error text-on-error',
};

const SELLER_USER_ID = 23;
const BUYER_USER_ID = 7;

export default function TransactionManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [sellerHistory, setSellerHistory] = useState([]);
  const [buyerHistory, setBuyerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Ledgers');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/wallet/top-up/history`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/wallet/top-up/history`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).catch(() => []),
    ]).then(([s, b]) => {
      setSellerHistory(Array.isArray(s) ? s.map(x => ({ ...x, role: 'Seller', userName: 'seller@gmail.com' })) : []);
      setBuyerHistory(Array.isArray(b) ? b.map(x => ({ ...x, role: 'Buyer', userName: 'buyer@gmail.com' })) : []);
    }).finally(() => setLoading(false));
  }, [token]);

  const allRows = [...sellerHistory, ...buyerHistory].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filtered = allRows.filter(tx => {
    const matchSearch =
      !search ||
      tx.transactionRef?.toLowerCase().includes(search.toLowerCase()) ||
      tx.userName?.toLowerCase().includes(search.toLowerCase()) ||
      tx.bankCode?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'All Ledgers' ||
      (activeFilter === 'Seller' && tx.role === 'Seller') ||
      (activeFilter === 'Buyer' && tx.role === 'Buyer') ||
      (activeFilter === 'Success' && tx.status === 'Success') ||
      (activeFilter === 'Pending' && tx.status === 'Pending');
    return matchSearch && matchFilter;
  });

  const filters = ['All Ledgers', 'Seller', 'Buyer', 'Success', 'Pending'];

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface min-h-screen antialiased">
      <AdminSidebar />
      <AdminTopBar title="Transactions" searchPlaceholder="Search Transaction ID, User, or Item..." />

      <main className="ml-64 pt-24 px-8 pb-12">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Topup Volume</p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">
              {vnd(allRows.filter(t => t.status === 'Success').reduce((s, t) => s + t.amount, 0))}
            </h3>
            <div className="mt-4 flex items-center text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              <span className="text-[11px] font-bold">All time</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Seller Deposits</p>
            <h3 className="text-3xl font-black text-primary tracking-tighter">
              {vnd(sellerHistory.filter(t => t.status === 'Success').reduce((s, t) => s + t.amount, 0))}
            </h3>
            <div className="mt-4 flex items-center text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">store</span>
              <span className="text-[11px] font-bold">{sellerHistory.filter(t => t.status === 'Success').length} transactions</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Buyer Deposits</p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">
              {vnd(buyerHistory.filter(t => t.status === 'Success').reduce((s, t) => s + t.amount, 0))}
            </h3>
            <div className="mt-4 flex items-center text-secondary">
              <span className="material-symbols-outlined text-sm mr-1">person</span>
              <span className="text-[11px] font-bold">{buyerHistory.filter(t => t.status === 'Success').length} transactions</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Pending</p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">
              {allRows.filter(t => t.status === 'Pending').length}
            </h3>
            <div className="mt-4 flex items-center text-error">
              <span className="material-symbols-outlined text-sm mr-1">schedule</span>
              <span className="text-[11px] font-bold">Awaiting payment</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6 bg-surface-container-low p-4 rounded-xl">
          <div className="flex gap-3 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  activeFilter === f
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-highest text-on-surface-variant hover:bg-primary-container/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ref, user..."
              className="pl-9 pr-4 py-2 text-xs bg-surface-container-lowest rounded-lg border border-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary/30 w-52"
            />
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">ID / Date</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type &amp; Entity</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Participants</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Gross Amount</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Fee</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin mr-2 align-middle">progress_activity</span>
                    Đang tải...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-zinc-400">Không có dữ liệu.</td>
                </tr>
              ) : (
                filtered.map(tx => (
                  <tr key={`${tx.role}-${tx.id}`} className="hover:bg-primary-container/5 transition-colors">
                    <td className="py-5 px-6">
                      <p className="font-headline font-bold text-on-surface tracking-tighter text-sm">{tx.transactionRef}</p>
                      <p className="text-[11px] text-zinc-400 mt-1">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-zinc-400">account_balance_wallet</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface">VNPAY Top-up</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            {tx.bankCode ?? 'Wallet'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${tx.role === 'Seller' ? 'bg-primary' : 'bg-secondary'}`}>
                          {tx.role === 'Seller' ? 'S' : 'B'}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-on-surface">{tx.userName}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${tx.role === 'Seller' ? 'text-primary' : 'text-secondary'}`}>{tx.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right font-headline font-bold text-on-surface">{vnd(tx.amount)}</td>
                    <td className="py-5 px-6 text-right font-headline font-bold text-zinc-300">0₫</td>
                    <td className="py-5 px-6">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${STATUS_STYLE[tx.status] ?? 'bg-zinc-100 text-zinc-500'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="p-6 bg-surface-container-high/20 flex items-center justify-between">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              Showing {filtered.length} results
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(168,49,0,0.3)] hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
        </button>
      </div>
    </div>
  );
}
