import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

export default function Wallet() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState('');

  async function handleTopUp() {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) { setTopUpError('Vui lòng nhập số tiền hợp lệ.'); return; }
    setTopUpLoading(true);
    setTopUpError('');
    try {
      const res = await fetch(`${API_BASE}/wallet/top-up/vnpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error('Nạp tiền thất bại.');
      const data = await res.json();
      const paymentUrl = data.paymentUrl ?? data.url ?? data.redirectUrl;
      if (paymentUrl) window.location.href = paymentUrl;
    } catch (err) {
      setTopUpError(err.message || 'Có lỗi xảy ra.');
    } finally {
      setTopUpLoading(false);
    }
  }
  return (
    <main className="pt-20 min-h-screen bg-background text-on-surface">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-outline-variant/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,49,0,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(255,120,77,0.18),_transparent_28%),linear-gradient(180deg,_rgba(255,244,243,1),_rgba(255,237,235,0.92))]" />
        <div className="relative max-w-screen-2xl mx-auto px-8 py-20 lg:py-24">
          <div className="max-w-4xl space-y-8">
            <header className="space-y-3">
              <span className="font-label text-sm uppercase tracking-[0.35em] text-primary font-bold">
                Buyer Wallet
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-none">
                MANAGE<br />
                <span className="italic text-primary">YOUR BALANCE.</span>
              </h1>
            </header>
            <p className="max-w-2xl text-on-surface-variant text-lg leading-relaxed">
              Track your available funds, saved payment methods, and recent transactions in one
              editorial-style wallet dashboard built to match the marketplace experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-6 editorial-shadow border border-outline-variant/10">
                <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
                  Available Balance
                </span>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-headline text-3xl font-bold text-secondary">$12,450.00</p>
                    <p className="text-xs text-on-surface-variant mt-1">Ready for checkout</p>
                  </div>
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-6 editorial-shadow border border-outline-variant/10">
                <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
                  Pending Holds
                </span>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-headline text-3xl font-bold text-on-surface">$1,240.00</p>
                    <p className="text-xs text-on-surface-variant mt-1">Escrow locked</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary">schedule</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-6 editorial-shadow border border-outline-variant/10">
                <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
                  Rewards Earned
                </span>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-headline text-3xl font-bold text-tertiary">$318.00</p>
                    <p className="text-xs text-on-surface-variant mt-1">This month</p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-screen-2xl mx-auto px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow border border-outline-variant/10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
                    Payment Methods
                  </span>
                  <h2 className="font-headline text-3xl font-bold tracking-tight mt-2">
                    Linked Cards
                  </h2>
                </div>
                <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-[0.18em] hover:opacity-95 active:scale-[0.98] transition-all w-fit">
                  <span className="material-symbols-outlined text-[18px]">add_card</span>
                  Add Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="relative overflow-hidden rounded-3xl p-6 bg-[linear-gradient(135deg,_#a83100_0%,_#ff784d_52%,_#ffb199_100%)] text-on-primary shadow-[0_24px_60px_rgba(168,49,0,0.24)]">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_30%)]" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] font-bold opacity-80">Primary Card</p>
                      <h3 className="font-headline text-2xl font-bold mt-2">Visa Platinum</h3>
                    </div>
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                  <div className="relative mt-14 space-y-5">
                    <div className="flex gap-3 text-sm font-headline tracking-[0.3em]">
                      <span>••••</span>
                      <span>••••</span>
                      <span>••••</span>
                      <span>4286</span>
                    </div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] font-bold opacity-90">
                      <span>Expires 09/28</span>
                      <span>Kevin Nguyen</span>
                    </div>
                  </div>
                </article>

                <article className="relative overflow-hidden rounded-3xl p-6 bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">Backup Method</p>
                      <h3 className="font-headline text-2xl font-bold mt-2">Mastercard Debit</h3>
                    </div>
                    <span className="material-symbols-outlined text-primary">payments</span>
                  </div>
                  <div className="mt-14 space-y-5">
                    <div className="flex gap-3 text-sm font-headline tracking-[0.3em] text-on-surface">
                      <span>••••</span>
                      <span>••••</span>
                      <span>••••</span>
                      <span>1124</span>
                    </div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] font-bold text-on-surface-variant">
                      <span>Expires 03/27</span>
                      <span>Auto top-up off</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow border border-outline-variant/10">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
                    Activity Feed
                  </span>
                  <h2 className="font-headline text-3xl font-bold tracking-tight mt-2">
                    Recent Transactions
                  </h2>
                </div>
                <button className="text-xs font-bold uppercase tracking-[0.18em] text-primary hover:underline">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'S-Works Tarmac SL8',
                    detail: 'Marketplace checkout',
                    amount: '-$12,500.00',
                    tone: 'text-error',
                    icon: 'shopping_cart',
                  },
                  {
                    title: 'Refund from escrow',
                    detail: 'Order cancellation',
                    amount: '+$480.00',
                    tone: 'text-tertiary',
                    icon: 'reply',
                  },
                  {
                    title: 'Monthly wallet top-up',
                    detail: 'Bank transfer',
                    amount: '+$3,000.00',
                    tone: 'text-tertiary',
                    icon: 'trending_up',
                  },
                ].map((entry) => (
                  <div
                    key={entry.title}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">{entry.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-headline text-lg font-bold tracking-tight">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-on-surface-variant">{entry.detail}</p>
                      </div>
                    </div>
                    <div className={`font-headline text-xl font-bold ${entry.tone}`}>
                      {entry.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="xl:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow border border-outline-variant/10 sticky top-28">
              <span className="font-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant font-bold">
                Quick Actions
              </span>
              <h2 className="font-headline text-3xl font-bold tracking-tight mt-2 mb-8">
                Wallet Controls
              </h2>

              <div className="space-y-4">
                <button
                    onClick={() => { setShowTopUp(true); setTopUpAmount(''); setTopUpError(''); }}
                    className="w-full flex items-center justify-between rounded-2xl px-5 py-4 bg-primary text-on-primary hover:opacity-95 transition-opacity">
                  <span className="flex items-center gap-3 font-bold uppercase tracking-[0.18em] text-xs">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Top Up Funds
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button className="w-full flex items-center justify-between rounded-2xl px-5 py-4 bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors">
                  <span className="flex items-center gap-3 font-bold uppercase tracking-[0.18em] text-xs">
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Transfer Out
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button className="w-full flex items-center justify-between rounded-2xl px-5 py-4 bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors">
                  <span className="flex items-center gap-3 font-bold uppercase tracking-[0.18em] text-xs">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                    Escrow Settings
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              <div className="mt-8 p-5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <h3 className="font-bold text-lg">Secure by Design</h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Funds stay protected in escrow until you confirm delivery and condition. This
                  mirrors the trust-first style used across the marketplace.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Nạp tiền qua VNPay</h2>
              <button onClick={() => setShowTopUp(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Số tiền (VND)</label>
              <div className="relative">
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={topUpAmount}
                  onChange={(e) => { setTopUpAmount(e.target.value); setTopUpError(''); }}
                  placeholder="Nhập số tiền..."
                  className="w-full bg-surface-container-high rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">₫</span>
              </div>
              <div className="flex gap-2 pt-1">
                {[50000, 100000, 200000, 500000].map(v => (
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
              {topUpLoading
                ? <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Đang xử lý...</>
                : <><span className="material-symbols-outlined text-base">add_card</span> Thanh toán VNPay</>
              }
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
