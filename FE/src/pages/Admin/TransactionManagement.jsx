import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const vnd = (n) => (n ?? 0).toLocaleString('vi-VN') + '₫';

const STATUS_STYLE = {
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

const TYPE_STYLE = {
  COMPLETED: 'bg-blue-50 text-blue-600',
  REFUNDED: 'bg-orange-50 text-orange-600',
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

  const filters = ['All', 'Completed', 'Cancelled'];

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface min-h-screen antialiased">
      <AdminSidebar />
      <AdminTopBar title="Transactions" searchPlaceholder="Search Transaction ID, User, or Item..." />

      <main className="ml-64 pt-24 px-8 pb-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Escrow Volume', value: vnd(stats.totalEscrowVolume), icon: 'trending_up', color: 'text-tertiary' },

            { label: 'Total Refunded', value: vnd(stats.totalRefunded), icon: 'undo', color: 'text-error' },
            { label: 'Total Transactions', value: stats.totalTransactions, icon: 'receipt_long', color: 'text-secondary' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-lowest p-6 rounded-xl hover:-translate-y-1 transition-transform duration-300">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-2xl font-black text-on-surface tracking-tighter">{s.value}</h3>
              <div className={`mt-3 flex items-center gap-1 ${s.color}`}>
                <span className="material-symbols-outlined text-sm">{s.icon}</span>
                <span className="text-[11px] font-bold">All time</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="flex items-center justify-between mb-6 bg-surface-container-low p-4 rounded-xl">
          <div className="flex gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  activeFilter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant hover:bg-primary-container/20'
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
              placeholder="Search order, buyer, seller..."
              className="pl-9 pr-4 py-2 text-xs bg-surface-container-lowest rounded-lg border border-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary/30 w-60"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="py-4 px-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Order</th>
                <th className="py-4 px-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Items</th>
                <th className="py-4 px-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Buyer</th>
                <th className="py-4 px-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Seller</th>
                <th className="py-4 px-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Total</th>
                <th className="py-4 px-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Escrow</th>
                <th className="py-4 px-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin mr-2 align-middle">progress_activity</span>
                    Đang tải...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-zinc-400">Không có dữ liệu.</td>
                </tr>
              ) : filtered.map(tx => (
                <>
                  <tr
                    key={tx.orderId}
                    onClick={() => setExpandedRow(expandedRow === tx.orderId ? null : tx.orderId)}
                    className="hover:bg-primary-container/5 transition-colors cursor-pointer"
                  >
                    {/* Order */}
                    <td className="py-4 px-5">
                      <p className="font-bold text-sm text-on-surface">{tx.orderCode}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{new Date(tx.orderDate).toLocaleDateString('vi-VN')}</p>
                      <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${TYPE_STYLE[tx.transactionType] ?? 'bg-zinc-100 text-zinc-500'}`}>
                        {tx.transactionType}
                      </span>
                    </td>
                    {/* Items preview */}
                    <td className="py-4 px-5">
                      <div className="flex -space-x-2">
                        {tx.items?.slice(0, 3).map(item => (
                          <img
                            key={item.orderItemId}
                            src={item.imageUrl}
                            alt={item.listingTitle}
                            className="w-9 h-9 rounded-lg object-cover border-2 border-white"
                          />
                        ))}
                        {tx.items?.length > 3 && (
                          <div className="w-9 h-9 rounded-lg bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-500">
                            +{tx.items.length - 3}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">{tx.items?.length} item{tx.items?.length !== 1 ? 's' : ''}</p>
                    </td>
                    {/* Buyer */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-white">
                          {tx.buyerName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-on-surface">{tx.buyerName}</p>
                          <p className="text-[10px] text-zinc-400">{tx.buyerEmail}</p>
                        </div>
                      </div>
                    </td>
                    {/* Seller */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                          {tx.sellerName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-on-surface">{tx.sellerName}</p>
                          <p className="text-[10px] text-zinc-400">{tx.sellerEmail}</p>
                        </div>
                      </div>
                    </td>
                    {/* Total */}
                    <td className="py-4 px-5 text-right font-bold text-sm text-on-surface">{vnd(tx.totalPrice)}</td>
                    {/* Escrow */}
                    <td className="py-4 px-5 text-center">
                      {tx.isEscrowReleased ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-sm">check_circle</span> Released
                        </span>
                      ) : tx.isRefunded ? (
                        <span className="inline-flex items-center gap-1 text-orange-500 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-sm">undo</span> Refunded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-400 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-sm">lock</span> Held
                        </span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="py-4 px-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${STATUS_STYLE[tx.status] ?? 'bg-zinc-100 text-zinc-500'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded detail row */}
                  {expandedRow === tx.orderId && (
                    <tr key={`${tx.orderId}-detail`} className="bg-primary-container/5">
                      <td colSpan={7} className="px-8 py-5">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Items list */}
                          <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Items</p>
                            <div className="space-y-3">
                              {tx.items?.map(item => (
                                <div key={item.orderItemId} className="flex items-center gap-3">
                                  <img src={item.imageUrl} alt={item.listingTitle} className="w-12 h-12 rounded-lg object-cover" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-on-surface truncate">{item.listingTitle}</p>
                                    <p className="text-[10px] text-zinc-400">{item.brandName} · {item.modelName}</p>
                                  </div>
                                  <p className="text-xs font-bold text-on-surface shrink-0">{vnd(item.price)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Order info */}
                          <div className="space-y-2 text-xs">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Order Info</p>
                            <div className="flex justify-between"><span className="text-zinc-400">Shipping Address</span><span className="font-semibold text-right max-w-[60%]">{tx.shippingAddress}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Order Date</span><span className="font-semibold">{new Date(tx.orderDate).toLocaleString('vi-VN')}</span></div>
                            {tx.escrowReleasedAt && <div className="flex justify-between"><span className="text-zinc-400">Escrow Released</span><span className="font-semibold">{new Date(tx.escrowReleasedAt).toLocaleString('vi-VN')}</span></div>}
                            {tx.refundedAt && <div className="flex justify-between"><span className="text-zinc-400">Refunded At</span><span className="font-semibold text-orange-500">{new Date(tx.refundedAt).toLocaleString('vi-VN')}</span></div>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-5 bg-surface-container-high/20 flex items-center justify-between">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              Showing {filtered.length} of {stats.totalTransactions} results
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container-highest disabled:opacity-40 hover:bg-primary-container/20 transition-colors"
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-zinc-500">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container-highest disabled:opacity-40 hover:bg-primary-container/20 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
