import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

export default function Wallet() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState('');

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

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchWalletBalance();
  }, [token, fetchWalletBalance, navigate]);

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
          <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow border border-outline-variant/10">
            <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
              Available Balance
            </span>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                {loading ? (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span>
                    <p className="font-headline text-2xl font-bold text-on-surface-variant">Đang tải...</p>
                  </div>
                ) : (
                  <>
                    <p className="font-headline text-4xl md:text-5xl font-bold text-secondary">
                      {walletBalance.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-sm text-on-surface-variant mt-2">Ready for checkout</p>
                  </>
                )}
              </div>
              <span className="material-symbols-outlined text-4xl text-primary">account_balance_wallet</span>
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
              className="w-full flex items-center justify-between rounded-2xl px-6 py-5 bg-primary text-on-primary hover:opacity-95 transition-opacity shadow-lg"
            >
              <span className="flex items-center gap-3 font-bold uppercase tracking-[0.18em] text-sm">
                <span className="material-symbols-outlined text-[20px]">add</span>
                Top Up Funds
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
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
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
