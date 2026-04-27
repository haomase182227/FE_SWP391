import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

function LoadingRow() {
  return (
    <div className="flex items-center gap-3 text-on-surface-variant py-8">
      <span className="material-symbols-outlined animate-spin">progress_activity</span>
      Đang tải...
    </div>
  );
}

function EmptyRow({ text }) {
  return <p className="text-sm text-on-surface-variant py-8">{text}</p>;
}

function TxStatusBadge({ status }) {
  const map = {
    Success:   'bg-tertiary/10 text-tertiary',
    Completed: 'bg-tertiary/10 text-tertiary',
    Pending:   'bg-orange-500/10 text-orange-600',
    Failed:    'bg-error/10 text-error',
    Cancelled: 'bg-error/10 text-error',
  };
  const cls = map[status] ?? 'bg-surface-container-high text-on-surface-variant';
  return (
    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${cls}`}>
      {status ?? '—'}
    </span>
  );
}

export default function Wallet() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [depositHistory, setDepositHistory] = useState([]);
  const [depositLoading, setDepositLoading] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState('');

  // ── Transaction history tabs ─────────────────────────────────
  const [txTab, setTxTab] = useState('purchases'); // 'purchases' | 'wallet'

  // GET /api/v1/buyer/transactions
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchaseStats, setPurchaseStats] = useState(null);

  // GET /api/v1/buyer/transactions/{orderId} — detail modal
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);

  // GET /api/v1/wallet/history  +  GET /api/v1/buyer/wallet/history
  const [walletHistory, setWalletHistory] = useState([]);
  const [walletHistoryLoading, setWalletHistoryLoading] = useState(false);

  // Fetch wallet balance from API
  const fetchWalletBalance = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();
      console.log('[Wallet] User data:', data);
      // Parse wallet balance from response
      const balance = data.user?.wallet ?? data.wallet ?? 0;
      setWalletBalance(balance);
    } catch (err) {
      console.error('[Wallet] Error fetching balance:', err);
      setWalletBalance(0);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Fetch buyer transactions ─────────────────────────────────
  const fetchPurchases = useCallback(async () => {
    if (!token) return;
    setPurchasesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/transactions?page=1&pageSize=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Response shape: { totalSpent, activeEscrows, ..., transactions: [...] }
      const list = Array.isArray(data) ? data : (data.transactions ?? data.items ?? []);
      setPurchases(list);
      if (!Array.isArray(data)) {
        setPurchaseStats({
          totalSpent:       data.totalSpent ?? 0,
          activeEscrows:    data.activeEscrows ?? 0,
          totalRefunded:    data.totalRefunded ?? 0,
          totalOrders:      data.totalOrders ?? 0,
          completedOrders:  data.completedOrders ?? 0,
          pendingOrders:    data.pendingOrders ?? 0,
          cancelledOrders:  data.cancelledOrders ?? 0,
        });
      }
    } catch {
      setPurchases([]);
    } finally {
      setPurchasesLoading(false);
    }
  }, [token]);

  // ── Fetch order detail ───────────────────────────────────────
  async function fetchOrderDetail(orderId) {
    setOrderDetailLoading(true);
    setOrderDetail(null);
    try {
      const res = await fetch(`${API_BASE}/buyer/transactions/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrderDetail(data);
    } catch (e) {
      setOrderDetail({ error: e.message });
    } finally {
      setOrderDetailLoading(false);
    }
  }

  // ── Fetch wallet history (both endpoints, merge) ─────────────
  const fetchWalletHistory = useCallback(async () => {
    if (!token) return;
    setWalletHistoryLoading(true);
    try {
      const [r1, r2] = await Promise.allSettled([
        fetch(`${API_BASE}/wallet/history`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/buyer/wallet/history`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const parse = async (result) => {
        if (result.status !== 'fulfilled' || !result.value.ok) return [];
        const d = await result.value.json();
        return Array.isArray(d) ? d : (d.items ?? d.transactions ?? []);
      };
      const [list1, list2] = await Promise.all([parse(r1), parse(r2)]);
      // Deduplicate by id
      const merged = [...list1];
      const ids = new Set(list1.map(x => x.id ?? x.transactionId));
      list2.forEach(x => { if (!ids.has(x.id ?? x.transactionId)) merged.push(x); });
      setWalletHistory(merged);
    } catch {
      setWalletHistory([]);
    } finally {
      setWalletHistoryLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchWalletBalance();
    fetchPurchases();
    fetchWalletHistory();

    setDepositLoading(true);
    fetch(`${API_BASE}/wallet/top-up/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setDepositHistory(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setDepositLoading(false));
  }, [token, fetchWalletBalance, fetchPurchases, fetchWalletHistory, navigate]);

  async function handleTopUp() {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) {
      setTopUpError('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    setTopUpLoading(true);
    setTopUpError('');
    try {
      const res = await fetch(`${API_BASE}/wallet/top-up/vnpay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Top-up thất bại.');
      if (data.paymentUrl) {
        sessionStorage.setItem('topup_role', 'Buyer');
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      setTopUpError(err.message || 'Có lỗi xảy ra.');
    } finally {
      setTopUpLoading(false);
    }
  }

  return (
    <main className="pt-20 min-h-screen bg-background text-on-surface">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-outline-variant/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,49,0,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(255,120,77,0.18),_transparent_28%),linear-gradient(180deg,_rgba(255,244,243,1),_rgba(255,237,235,0.92))]" />
        <div className="relative max-w-screen-xl mx-auto px-8 py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <header className="space-y-3">
              <span className="font-label text-sm uppercase tracking-[0.35em] text-primary font-bold">
                Buyer Wallet
              </span>
              <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter leading-none">
                MANAGE<br />
                <span className="italic text-primary">YOUR BALANCE.</span>
              </h1>
            </header>
            <p className="max-w-xl mx-auto text-on-surface-variant text-base leading-relaxed">
              Track your available funds and manage your wallet in one clean, editorial-style dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Centered Layout */}
      <section className="max-w-screen-lg mx-auto px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Available Balance Card */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 shadow-xl shadow-orange-500/30 text-white">
            <span className="font-label text-[10px] uppercase tracking-[0.28em] text-white/80 font-bold">
              Available Balance
            </span>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                {loading ? (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-2xl text-white">progress_activity</span>
                    <p className="font-headline text-2xl font-bold text-white/80">Đang tải...</p>
                  </div>
                ) : (
                  <>
                    <p className="font-headline text-4xl md:text-5xl font-bold text-white">
                      {walletBalance.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-sm text-white/80 mt-2">Ready for checkout</p>
                  </>
                )}
              </div>
              <span className="material-symbols-outlined text-4xl text-white/90">account_balance_wallet</span>
            </div>
          </div>

          {/* Wallet Controls Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow border border-outline-variant/10">
            <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
              Quick Actions
            </span>
            <h2 className="font-headline text-2xl font-bold tracking-tight mt-2 mb-6">
              Wallet Controls
            </h2>

            <button
              onClick={() => {
                setShowTopUp(true);
                setTopUpAmount('');
                setTopUpError('');
              }}
              className="w-full flex items-center justify-between rounded-2xl px-6 py-5 bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
            >
              <span className="flex items-center gap-3 font-bold uppercase tracking-[0.18em] text-sm">
                <span className="material-symbols-outlined text-[20px]">add</span>
                Nạp tiền
              </span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <div className="mt-6 p-5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <h3 className="font-bold text-base">Secure by Design</h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Funds stay protected in escrow until you confirm delivery and condition. This mirrors the trust-first style used across the marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction History Tabs */}
      <section className="max-w-screen-lg mx-auto px-8 pb-16 space-y-6">
        {/* Tab header */}
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-bold tracking-tight">Lịch sử giao dịch</h2>
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1">
            {[
              { key: 'purchases', label: 'Mua hàng', icon: 'shopping_bag' },
              { key: 'deposit',   label: 'Nạp tiền',  icon: 'add_card' },
            ].map(({ key, label, icon }) => (
              <button key={key} onClick={() => setTxTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  txTab === key ? 'bg-surface-container-lowest shadow text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
                }`}>
                <span className="material-symbols-outlined text-[14px]">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB: MUA HÀNG ── */}
        {txTab === 'purchases' && (
          purchasesLoading
            ? <LoadingRow />
            : purchases.length === 0
              ? <EmptyRow text="Chưa có giao dịch mua hàng nào." />
              : <div className="space-y-4">
                  {/* Dashboard stats */}
                  {purchaseStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                      {[
                        { label: 'Đã chi', value: purchaseStats.totalSpent.toLocaleString('vi-VN') + '₫', color: 'text-primary' },
                        { label: 'Đang escrow', value: purchaseStats.activeEscrows, color: 'text-orange-600' },
                        { label: 'Hoàn tiền', value: purchaseStats.totalRefunded.toLocaleString('vi-VN') + '₫', color: 'text-blue-600' },
                        { label: 'Tổng đơn', value: `${purchaseStats.completedOrders}/${purchaseStats.totalOrders}`, color: 'text-tertiary' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{label}</p>
                          <p className={`font-headline text-lg font-bold mt-1 ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Transaction rows */}
                  {purchases.map(tx => {
                    const orderId = tx.orderId ?? tx.id;
                    const firstItem = tx.items?.[0];
                    const title = firstItem?.listingTitle ?? tx.orderCode ?? `Đơn hàng #${orderId}`;
                    const imgSrc = firstItem?.imageUrl ?? null;
                    const extraItems = (tx.items?.length ?? 0) - 1;
                    return (
                      <div key={orderId}
                        className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => fetchOrderDetail(orderId)}>
                        <div className="flex items-center gap-4">
                          {imgSrc
                            ? <img src={imgSrc} alt={title} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                            : <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">shopping_bag</span>
                              </div>
                          }
                          <div>
                            <p className="font-bold text-sm text-on-surface line-clamp-1">
                              {title}{extraItems > 0 ? ` +${extraItems} sản phẩm` : ''}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {tx.orderCode ?? `#${orderId}`}
                              {tx.sellerName ? ` • ${tx.sellerName}` : ''}
                              {tx.orderDate ? ` • ${new Date(tx.orderDate).toLocaleDateString('vi-VN')}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <TxStatusBadge status={tx.status} />
                          <p className="font-bold font-headline text-on-surface">
                            {(tx.totalPrice ?? tx.amount ?? 0).toLocaleString('vi-VN')}₫
                          </p>
                          <span className="material-symbols-outlined text-on-surface-variant text-lg group-hover:text-primary transition-colors">chevron_right</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
        )}

        {/* ── TAB: VÍ ── */}
        {txTab === 'wallet' && (
          walletHistoryLoading
            ? <LoadingRow />
            : walletHistory.length === 0
              ? <EmptyRow text="Chưa có lịch sử giao dịch ví." />
              : <div className="space-y-3">
                  {walletHistory.map((tx, i) => {
                    const isCredit = (tx.amount ?? 0) > 0 || tx.type === 'Credit' || tx.transactionType === 'Credit';
                    return (
                      <div key={tx.id ?? tx.transactionId ?? i}
                        className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-tertiary/10' : 'bg-error/10'}`}>
                            <span className={`material-symbols-outlined text-xl ${isCredit ? 'text-tertiary' : 'text-error'}`}>
                              {isCredit ? 'arrow_downward' : 'arrow_upward'}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-on-surface">
                              {tx.description ?? tx.note ?? (isCredit ? 'Tiền vào ví' : 'Tiền ra ví')}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : '—'}
                              {tx.referenceId ? ` • Ref #${tx.referenceId}` : ''}
                            </p>
                          </div>
                        </div>
                        <p className={`font-bold font-headline ${isCredit ? 'text-tertiary' : 'text-error'}`}>
                          {isCredit ? '+' : '-'}{Math.abs(tx.amount ?? 0).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    );
                  })}
                </div>
        )}

        {/* ── TAB: NẠP TIỀN ── */}
        {txTab === 'deposit' && (
          depositLoading
            ? <LoadingRow />
            : depositHistory.length === 0
              ? <EmptyRow text="Không có lịch sử nạp tiền." />
              : <div className="space-y-3">
                  {depositHistory.map((tx) => {
                    const isSuccess = tx.status === 'Success';
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${isSuccess ? 'bg-tertiary-container/30' : 'bg-surface-container-high'}`}>
                            <span className={`material-symbols-outlined text-xl ${isSuccess ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                              {isSuccess ? 'add_card' : 'schedule'}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-on-surface">Nạp tiền qua VNPay</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {tx.transactionRef}{tx.bankCode ? ` • ${tx.bankCode}` : ''} • {new Date(tx.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <TxStatusBadge status={tx.status} />
                          <p className={`font-bold font-headline ${isSuccess ? 'text-secondary' : 'text-on-surface-variant'}`}>
                            +{tx.amount.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
        )}
      </section>

      {/* Order Detail Modal */}
      {(orderDetailLoading || orderDetail) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setOrderDetail(null)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-white/40 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            {orderDetailLoading && (
              <div className="p-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>Đang tải...
              </div>
            )}
            {!orderDetailLoading && orderDetail && (
              orderDetail.error
                ? <div className="p-8 text-center text-error">{orderDetail.error}</div>
                : <div className="p-8 space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Chi tiết đơn hàng</p>
                        <h3 className="font-headline text-xl font-bold text-on-surface mt-1">
                          {orderDetail.orderCode ?? `#${orderDetail.orderId ?? orderDetail.id}`}
                        </h3>
                      </div>
                      <TxStatusBadge status={orderDetail.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        ['Người bán', orderDetail.sellerName ?? '—'],
                        ['Địa chỉ giao', orderDetail.shippingAddress ?? '—'],
                        ['Tổng tiền', `${(orderDetail.totalPrice ?? orderDetail.amount ?? 0).toLocaleString('vi-VN')}₫`],
                        ['Ngày đặt', orderDetail.orderDate ? new Date(orderDetail.orderDate).toLocaleString('vi-VN') : '—'],
                        ['Escrow', orderDetail.isEscrowReleased ? 'Đã giải phóng' : 'Đang giữ'],
                        ['Hoàn tiền', orderDetail.isRefunded ? `Đã hoàn • ${new Date(orderDetail.refundedAt).toLocaleDateString('vi-VN')}` : 'Không'],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-0.5">{k}</p>
                          <p className="font-medium text-on-surface text-sm">{v}</p>
                        </div>
                      ))}
                    </div>
                    {/* Items */}
                    {orderDetail.items?.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Sản phẩm</p>
                        <div className="space-y-2">
                          {orderDetail.items.map(item => (
                            <div key={item.orderItemId} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                              {item.imageUrl && <img src={item.imageUrl} alt={item.listingTitle} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-on-surface line-clamp-1">{item.listingTitle}</p>
                                <p className="text-xs text-on-surface-variant">{item.brandName} {item.modelName}</p>
                              </div>
                              <p className="font-bold text-sm text-on-surface flex-shrink-0">{item.price.toLocaleString('vi-VN')}₫</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button onClick={() => setOrderDetail(null)}
                      className="w-full py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                      Đóng
                    </button>
                  </div>
            )}
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Nạp tiền qua VNPay</h2>
              <button
                onClick={() => setShowTopUp(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Số tiền (VND)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={topUpAmount}
                  onChange={(e) => {
                    setTopUpAmount(e.target.value);
                    setTopUpError('');
                  }}
                  placeholder="Nhập số tiền..."
                  className="w-full bg-surface-container-high rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                  ₫
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                {[50000, 100000, 200000, 500000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTopUpAmount(String(v))}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase border border-outline-variant/20 rounded-lg hover:border-primary/40 hover:bg-surface-container-low transition-all"
                  >
                    {v.toLocaleString('vi-VN')}₫
                  </button>
                ))}
              </div>
              {topUpError && <p className="text-xs text-error">{topUpError}</p>}
            </div>
            <button
              onClick={handleTopUp}
              disabled={topUpLoading}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-orange-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
            >
              {topUpLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                  </span>{' '}
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">add_card</span> Thanh toán
                  VNPay
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
