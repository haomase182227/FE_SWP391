import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const vnd = (n) => (n ?? 0).toLocaleString('vi-VN') + '₫';

const TX_STATUS_STYLES = {
  Completed: 'bg-tertiary/10 text-tertiary',
  Paid:      'bg-secondary/10 text-secondary',
  Cancelled: 'bg-error/10 text-error',
};

const TX_TYPE_ICONS = {
  COMPLETED: { icon: 'check_circle', color: 'text-tertiary', bg: 'bg-tertiary/10' },
  ESCROW:    { icon: 'lock_clock',   color: 'text-secondary', bg: 'bg-secondary/10' },
  REFUNDED:  { icon: 'undo',         color: 'text-error',     bg: 'bg-error/10' },
};

export default function WalletSellerManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const [searchParams] = useSearchParams();

  // ── Topup result (VNPay callback) ────────────────────────────
  const [topupResult, setTopupResult] = useState(null);
  const [topupCountdown, setTopupCountdown] = useState(5);

  useEffect(() => {
    const vnpResponse = searchParams.get('vnp_ResponseCode');
    const status = searchParams.get('status');
    if (!vnpResponse && !status) return;

    const query = searchParams.toString();
    fetch(`${API_BASE}/wallet/vnpay/return?${query}`)
      .then(r => r.json())
      .then(data => {
        const msg = data.message ?? '';
        const isSuccess = msg.toLowerCase().includes('thành công') || msg.toLowerCase().includes('success');
        const txnRef = searchParams.get('vnp_TxnRef') ?? searchParams.get('txnRef');
        const rawAmount = searchParams.get('vnp_Amount');
        const amount = rawAmount ? Number(rawAmount) / 100 : null;
        setTopupResult({ isSuccess, message: msg, txnRef, amount });
      })
      .catch(() => {
        const isSuccess = vnpResponse === '00' || status === 'success';
        const txnRef = searchParams.get('vnp_TxnRef') ?? searchParams.get('txnRef');
        const rawAmount = searchParams.get('vnp_Amount');
        const amount = rawAmount ? Number(rawAmount) / 100 : null;
        setTopupResult({ isSuccess, message: isSuccess ? 'Nạp tiền thành công.' : 'Giao dịch không thành công.', txnRef, amount });
      });
  }, []);

  useEffect(() => {
    if (!topupResult) return;
    const timer = setInterval(() => {
      setTopupCountdown(c => {
        if (c <= 1) { clearInterval(timer); setTopupResult(null); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [topupResult]);

  // ── Wallet balance ───────────────────────────────────────────
  const [walletBalance, setWalletBalance] = useState(null);

  const fetchBalance = useCallback(() => {
    if (!token) return;
    fetch(`${API_BASE}/Auth/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setWalletBalance(data?.user?.wallet ?? 0))
      .catch(() => {});
  }, [token]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  // ── Deposit history ──────────────────────────────────────────
  const [depositHistory, setDepositHistory] = useState([]);
  const [depositLoading, setDepositLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setDepositLoading(true);
    fetch(`${API_BASE}/wallet/top-up/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setDepositHistory(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setDepositLoading(false));
  }, [token]);

  // ── Transactions ─────────────────────────────────────────────
  const [txData, setTxData]         = useState(null);
  const [txLoading, setTxLoading]   = useState(false);
  const [txPage, setTxPage]         = useState(1);
  const [txStatus, setTxStatus]     = useState('');
  const [txDetail, setTxDetail]     = useState(null);
  const [txDetailLoading, setTxDetailLoading] = useState(false);

  const fetchTransactions = useCallback(async (page = 1, status = '') => {
    if (!token) return;
    setTxLoading(true);
    try {
      const qs = new URLSearchParams({ page, pageSize: 10 });
      if (status) qs.set('status', status);
      const res = await fetch(`${API_BASE}/seller/transactions?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTxData(data);
    } catch { setTxData(null); }
    finally { setTxLoading(false); }
  }, [token]);

  useEffect(() => { fetchTransactions(txPage, txStatus); }, [txPage, txStatus, fetchTransactions]);

  async function openTxDetail(orderId) {
    setTxDetail({ _loading: true });
    setTxDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seller/transactions/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setTxDetail(await res.json());
    } catch { setTxDetail(null); }
    finally { setTxDetailLoading(false); }
  }

  // ── Top-up modal ─────────────────────────────────────────────
  const [showTopUp, setShowTopUp]   = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState('');

  async function handleTopUp() {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) { setTopUpError('Vui lòng nhập số tiền hợp lệ.'); return; }
    setTopUpLoading(true); setTopUpError('');
    try {
      const res = await fetch(`${API_BASE}/wallet/top-up/vnpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Top-up thất bại.');
      if (data.paymentUrl) { sessionStorage.setItem('topup_role', 'Seller'); window.location.href = data.paymentUrl; }
    } catch (err) { setTopUpError(err.message); }
    finally { setTopUpLoading(false); }
  }

  const transactions = txData?.transactions ?? [];

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar />

      <header className="sticky top-0 z-40 flex items-center justify-between px-8 ml-64 h-16 bg-surface/80 backdrop-blur-xl shadow-sm">
        <p className="font-headline text-lg font-bold text-on-surface">Wallet &amp; Earnings</p>
        <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
      </header>

      <main className="ml-64 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Topup Result Banner */}
          {topupResult && (
            <div className={`rounded-2xl p-6 flex items-center gap-5 ${topupResult.isSuccess ? 'bg-tertiary/10 border border-tertiary/20' : 'bg-error/10 border border-error/20'}`}>
              <span className={`material-symbols-outlined text-4xl ${topupResult.isSuccess ? 'text-tertiary' : 'text-error'}`}
                style={{ fontVariationSettings: '"FILL" 1' }}>
                {topupResult.isSuccess ? 'check_circle' : 'cancel'}
              </span>
              <div className="flex-1">
                <p className={`font-bold text-base ${topupResult.isSuccess ? 'text-tertiary' : 'text-error'}`}>
                  {topupResult.isSuccess ? 'Nạp tiền thành công' : 'Nạp tiền thất bại'}
                </p>
                <p className="text-sm text-on-surface-variant">{topupResult.message}</p>
                {topupResult.amount && <p className="font-headline text-xl font-bold text-tertiary mt-1">{vnd(topupResult.amount)}</p>}
                {topupResult.txnRef && <p className="text-xs text-on-surface-variant font-mono mt-1">Ref: {topupResult.txnRef}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-on-surface-variant">Tự đóng sau <span className="font-bold text-primary">{topupCountdown}s</span></p>
                <button onClick={() => setTopupResult(null)} className="text-xs text-primary font-bold hover:underline mt-1">Đóng</button>
              </div>
            </div>
          )}

          {/* Header */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Financial Overview</p>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Wallet &amp; Earnings</h1>
          </div>

          {/* Balance card */}
          <div className="bg-surface-container-low rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="material-symbols-outlined" style={{ fontSize: '140px' }}>account_balance_wallet</span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-2">Available Balance</p>
            <h2 className="text-6xl font-bold font-headline tracking-tighter text-on-surface mb-6">
              {walletBalance === null ? '...' : vnd(walletBalance)}
            </h2>
            <button onClick={() => { setShowTopUp(true); setTopUpAmount(''); setTopUpError(''); }}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">add_card</span>
              Top Up
            </button>
          </div>

          {/* Transaction Dashboard */}
          {txData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue',   value: vnd(txData.totalRevenue),   color: 'text-tertiary' },
                { label: 'Pending Escrow',  value: vnd(txData.pendingRevenue), color: 'text-secondary' },
                { label: 'Total Refunded',  value: vnd(txData.totalRefunded),  color: 'text-error' },
                { label: 'Total Orders',    value: txData.totalOrders,         color: 'text-on-surface' },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-lowest rounded-xl p-5 border border-white shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{s.label}</p>
                  <p className={`font-headline text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Transactions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-headline">Transactions</h3>
              <div className="flex gap-2">
                {['', 'Paid', 'Completed', 'Cancelled'].map(s => (
                  <button key={s} onClick={() => { setTxStatus(s); setTxPage(1); }}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${txStatus === s ? 'bg-primary text-on-primary' : 'border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low'}`}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {txLoading && (
              <div className="flex items-center justify-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Loading...
              </div>
            )}
            {!txLoading && transactions.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant text-sm">No transactions found.</div>
            )}
            {!txLoading && transactions.map(tx => {
              const typeInfo = TX_TYPE_ICONS[tx.transactionType] ?? TX_TYPE_ICONS.ESCROW;
              const item = tx.items?.[0];
              return (
                <div key={tx.orderId}
                  className="flex items-center gap-5 p-5 bg-surface-container-lowest rounded-xl hover:bg-primary-container/5 transition-all cursor-pointer"
                  onClick={() => openTxDetail(tx.orderId)}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo.bg}`}>
                    <span className={`material-symbols-outlined ${typeInfo.color}`}>{typeInfo.icon}</span>
                  </div>
                  {/* Image */}
                  {item?.imageUrl && (
                    <img src={item.imageUrl} alt={item.listingTitle} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  )}
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface truncate">{item?.listingTitle ?? tx.orderCode}</p>
                    <p className="text-xs text-on-surface-variant">
                      {tx.orderCode} · {tx.buyerName} · {new Date(tx.orderDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {/* Status + Amount */}
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter mb-1 ${TX_STATUS_STYLES[tx.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                      {tx.status}
                    </span>
                    <p className={`font-headline text-base font-bold ${tx.isRefunded ? 'text-error' : 'text-tertiary'}`}>
                      {tx.isRefunded ? '-' : '+'}{vnd(tx.totalPrice)}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant text-sm">chevron_right</span>
                </div>
              );
            })}

            {/* Pagination */}
            {txData && txData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low disabled:opacity-40 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="text-xs text-on-surface-variant font-bold">{txPage} / {txData.totalPages}</span>
                <button onClick={() => setTxPage(p => Math.min(txData.totalPages, p + 1))} disabled={txPage === txData.totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low disabled:opacity-40 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* Deposit History */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-headline">Deposit History</h3>
            {depositLoading ? (
              <div className="flex items-center justify-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Loading...
              </div>
            ) : depositHistory.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant text-sm">No deposit history.</div>
            ) : (
              <div className="space-y-3">
                {depositHistory.map(tx => {
                  const isSuccess = tx.status === 'Success';
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-xl hover:bg-primary-container/5 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuccess ? 'bg-tertiary/10' : 'bg-surface-container-high'}`}>
                          <span className={`material-symbols-outlined text-lg ${isSuccess ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                            {isSuccess ? 'add_card' : 'schedule'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface">VNPay Top-up</p>
                          <p className="text-xs text-on-surface-variant">
                            {tx.transactionRef}{tx.bankCode ? ` · ${tx.bankCode}` : ''} · {new Date(tx.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-tighter ${isSuccess ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          {tx.status}
                        </span>
                        <p className={`font-headline text-base font-bold ${isSuccess ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                          +{vnd(tx.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Nạp tiền qua VNPay</h2>
              <button onClick={() => setShowTopUp(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Số tiền (VND)</label>
              <div className="relative">
                <input type="number" min={1000} step={1000} value={topUpAmount}
                  onChange={e => { setTopUpAmount(e.target.value); setTopUpError(''); }}
                  placeholder="Nhập số tiền..."
                  className="w-full bg-surface-container-high rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">₫</span>
              </div>
              <div className="flex gap-2">
                {[50000, 100000, 200000, 500000].map(v => (
                  <button key={v} onClick={() => setTopUpAmount(String(v))}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase border border-outline-variant/20 rounded-lg hover:border-primary/40 hover:bg-surface-container-low transition-all">
                    {v.toLocaleString('vi-VN')}₫
                  </button>
                ))}
              </div>
              {topUpError && <p className="text-xs text-error">{topUpError}</p>}
            </div>
            <button onClick={handleTopUp} disabled={topUpLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
              {topUpLoading
                ? <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Đang xử lý...</>
                : <><span className="material-symbols-outlined text-base">add_card</span> Thanh toán VNPay</>}
            </button>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {txDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setTxDetail(null)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-white/40 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {txDetailLoading ? (
              <div className="p-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>Loading...
              </div>
            ) : txDetail && !txDetail._loading && (
              <div className="p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{txDetail.orderCode}</p>
                    <h3 className="font-headline text-xl font-black text-on-surface">{txDetail.items?.[0]?.listingTitle ?? '—'}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${TX_STATUS_STYLES[txDetail.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                    {txDetail.status}
                  </span>
                </div>

                {txDetail.items?.[0]?.imageUrl && (
                  <img src={txDetail.items[0].imageUrl} alt="" className="w-full h-40 object-cover rounded-xl" />
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ['Total Price', vnd(txDetail.totalPrice)],
                    ['Transaction Type', txDetail.transactionType],
                    ['Buyer', txDetail.buyerName],
                    ['Buyer Email', txDetail.buyerEmail],
                    ['Order Date', txDetail.orderDate ? new Date(txDetail.orderDate).toLocaleDateString('vi-VN') : '—'],
                    ['Shipping', txDetail.shippingAddress || '—'],
                    ['Escrow Released', txDetail.isEscrowReleased ? `✅ ${new Date(txDetail.escrowReleasedAt).toLocaleDateString('vi-VN')}` : '⏳ Pending'],
                    ['Refunded', txDetail.isRefunded ? `✅ ${new Date(txDetail.refundedAt).toLocaleDateString('vi-VN')}` : 'No'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">{k}</p>
                      <p className="font-medium text-on-surface">{v}</p>
                    </div>
                  ))}
                </div>

                <button onClick={() => setTxDetail(null)}
                  className="w-full py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

