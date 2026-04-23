import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE_URL = 'https://swp391-bike-marketplace-backend-1.onrender.com/api/v1';

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
  const [filters, setFilters] = useState({
    status: '',
    userRole: '',
  });

  useEffect(() => {
    if (token) fetchTransactions();
  }, [currentPage, filters, token]);

  async function fetchTransactions() {
    if (!token) {
      console.log('No token available');
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: pageSize,
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.userRole) params.append('userRole', filters.userRole);

      console.log('Fetching with token:', token?.substring(0, 20) + '...');
      const url = `${API_BASE_URL}/admin/wallets/top-ups?${params}`;
      console.log('API URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setTransactions(data.transactions || []);
      setStats({
        totalTopUpVolume: data.totalTopUpVolume || 0,
        totalTopUpToday: data.totalTopUpToday || 0,
        totalTransactions: data.totalTransactions || 0,
        successfulTransactions: data.successfulTransactions || 0,
        pendingTransactions: data.pendingTransactions || 0,
        failedTransactions: data.failedTransactions || 0,
        successRate: data.successRate || 0,
      });
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusBadge(status) {
    const statusStyles = {
      Success: 'bg-green-100 text-green-800 border-green-200',
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Failed: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  }

  function getRoleBadge(role) {
    const roleStyles = {
      Buyer: 'bg-blue-100 text-blue-800 border-blue-200',
      Seller: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface min-h-screen antialiased">
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-64 pt-8 px-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Financial Overview</p>
          <h1 className="text-4xl font-bold tracking-tight font-headline">Wallet Management</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Quản lý lịch sử nạp tiền của Buyer và Seller
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Tổng nạp</p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">{formatCurrency(stats.totalTopUpVolume)}</h3>
            <div className="mt-4 flex items-center text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">account_balance_wallet</span>
              <span className="text-[11px] font-bold">All time</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Nạp hôm nay</p>
            <h3 className="text-3xl font-black text-primary tracking-tighter">{formatCurrency(stats.totalTopUpToday)}</h3>
            <div className="mt-4 flex items-center text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">today</span>
              <span className="text-[11px] font-bold">Today's deposits</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Giao dịch</p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">{stats.totalTransactions}</h3>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <span className="text-tertiary font-bold">✓ {stats.successfulTransactions}</span>
              <span className="text-secondary font-bold">⏳ {stats.pendingTransactions}</span>
              <span className="text-error font-bold">✗ {stats.failedTransactions}</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Tỷ lệ thành công</p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">{stats.successRate.toFixed(1)}%</h3>
            <div className="mt-4 flex items-center text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              <span className="text-[11px] font-bold">Success rate</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 bg-surface-container-low p-4 rounded-xl">
          <div className="flex gap-3">
            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container/20 transition-colors border-none focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div>
              <select
                value={filters.userRole}
                onChange={(e) => handleFilterChange('userRole', e.target.value)}
                className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container/20 transition-colors border-none focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="">Tất cả vai trò</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/50 border-none">
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">ID</th>
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mã GD</th>
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Người dùng</th>
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vai trò</th>
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Số tiền</th>
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Trạng thái</th>
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ngày tạo</th>
                      <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ngày thanh toán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/50">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-5xl text-zinc-300">receipt_long</span>
                            <p className="text-sm text-zinc-500">Không có giao dịch nào</p>
                            <p className="text-xs text-zinc-400">Dữ liệu sẽ hiển thị khi có giao dịch nạp tiền</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                        <tr key={transaction.transactionId} className="hover:bg-primary-container/5 transition-colors group">
                          <td className="py-5 px-6">
                            <p className="font-headline font-bold text-on-surface tracking-tighter">{transaction.transactionId}</p>
                          </td>
                          <td className="py-5 px-6">
                            <p className="text-xs font-mono text-zinc-700">{transaction.transactionRef}</p>
                          </td>
                          <td className="py-5 px-6">
                            <div className="text-sm font-bold text-on-surface">{transaction.userName}</div>
                            <div className="text-[11px] text-zinc-400 mt-1">{transaction.userEmail}</div>
                            <div className="text-[10px] text-zinc-400">ID: {transaction.userId}</div>
                          </td>
                          <td className="py-5 px-6">{getRoleBadge(transaction.userRole)}</td>
                          <td className="py-5 px-6 text-right">
                            <p className="font-headline font-bold text-primary">{formatCurrency(transaction.amount)}</p>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex justify-center">{getStatusBadge(transaction.status)}</div>
                          </td>
                          <td className="py-5 px-6">
                            <p className="text-[11px] text-zinc-400">{formatDate(transaction.transactionDate)}</p>
                          </td>
                          <td className="py-5 px-6">
                            <p className="text-[11px] text-zinc-400">
                              {transaction.paidAt ? formatDate(transaction.paidAt) : '-'}
                            </p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 bg-surface-container-high/20 flex items-center justify-between">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  Trang {currentPage} / {totalPages} - Tổng {stats.totalTransactions} giao dịch
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded bg-surface-container-lowest border border-zinc-100 flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded bg-surface-container-lowest border border-zinc-100 flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(168,49,0,0.3)] hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
        </button>
      </div>
    </div>
  );
}
