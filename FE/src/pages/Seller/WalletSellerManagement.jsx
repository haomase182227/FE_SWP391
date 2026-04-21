import { useState, useEffect } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const vnd = (n) => (n ?? 0).toLocaleString('vi-VN') + '₫';

const TRANSACTIONS = [
  {
    id: 'VK-90214',
    label: 'Sale: Pinarello Dogma F12',
    meta: 'Today, 2:15 PM',
    icon: 'shopping_bag',
    iconBg: 'bg-secondary-container/30',
    iconColor: 'text-secondary',
    status: 'Completed',
    statusStyle: 'bg-tertiary-container/40 text-on-tertiary-container',
    amount: '+8.420.000₫',
    amountStyle: 'text-tertiary',
  },
  {
    id: 'VK-88120',
    label: 'Withdrawal to Chase Bank',
    meta: 'Yesterday, 10:45 AM',
    icon: 'outbox',
    iconBg: 'bg-error-container/10',
    iconColor: 'text-error',
    status: 'Processing',
    statusStyle: 'bg-surface-container-highest text-on-surface-variant',
    amount: '-1.500.000₫',
    amountStyle: 'text-on-surface',
  },
  {
    id: 'VK-87912',
    label: 'Sale: Zipp 404 Firecrest Wheelset',
    meta: 'Feb 24, 2024',
    icon: 'shopping_bag',
    iconBg: 'bg-secondary-container/30',
    iconColor: 'text-secondary',
    status: 'Completed',
    statusStyle: 'bg-tertiary-container/40 text-on-tertiary-container',
    amount: '+1.850.000₫',
    amountStyle: 'text-tertiary',
  },
  {
    id: 'VK-87001',
    label: 'Marketplace Listing Fee',
    meta: 'Feb 22, 2024',
    icon: 'receipt_long',
    iconBg: 'bg-surface-container-high',
    iconColor: 'text-on-surface-variant',
    status: 'Completed',
    statusStyle: 'bg-tertiary-container/40 text-on-tertiary-container',
    amount: '-15.000₫',
    amountStyle: 'text-on-surface',
  },
];

const BAR_HEIGHTS = ['40%', '60%', '50%', '80%', '100%'];
const BAR_OPACITIES = ['bg-primary/10', 'bg-primary/10', 'bg-primary/20', 'bg-primary/40', 'bg-primary'];

export default function WalletSellerManagement() {
  const [search, setSearch] = useState('');
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/Auth/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setWalletBalance(data?.user?.wallet ?? 0))
      .catch(() => {});
  }, [token]);

  // Top-up state
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Top-up thất bại.');
      if (data.paymentUrl) {
        sessionStorage.setItem('topup_role', 'Seller');
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      setTopUpError(err.message || 'Có lỗi xảy ra.');
    } finally {
      setTopUpLoading(false);
    }
  }

  const filtered = TRANSACTIONS.filter(
    (t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBh9Q9_fY-ouIys8629M86NNrQJIg92nQPcsJBqsXJZe9JpIhS_4O1BTYPv6fkdx04128V339iWFKnNo_2Qr2SCEeG3KOprb0-a1xryQOoKlWYaroBr_3zxSEq93pDeHfCo5AyQ-ftWamMd7IcvofnitwdqZXx-RAD5G6KMyqeXfLaziiaP1Ig4EEH5mU7CSa1EepNIY7zxxpqShMFh8jA23nv3-zh7sqZpkw48OONfi7nkBORuEiHz0GY2ULX-k-NroVgz4NXuCD3H"
        merchantName="Verified Merchant"
        merchantSub="Profile Settings"
      />

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 ml-64 w-full h-16 bg-surface/80 backdrop-blur-xl shadow-sm shadow-on-surface/5">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full bg-surface-container-high/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-on-surface-variant/60"
              placeholder="Search transactions..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              notifications
            </span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              settings
            </span>
          </div>
          <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all">
            Support
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Page Header */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Financial Overview</p>
              <h1 className="text-4xl font-bold tracking-tight font-headline">Wallet &amp; Earnings</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <img
                  alt="Visa Logo"
                  className="w-8 h-8 rounded-full border-2 border-surface bg-white p-1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDGcEOHIVhM3ZlbbY-rGHPWfl_sKbhMEguZf3sVPbWXzQ9-VivOzj_oMd-OahmNoW9GTV2iJQbCa1dycm66oGFZGYnmSU8H3ehBGSku0ZuuMnnd0KiBuLkiN3jB9_silXSKyJJ0BuCHQhXoUP_2wqTt2JIWrGTgx7pfXNLG3TiMDOMAWQIS7kWBRrAJIHEXrYnQbsghcRCUjz23K_ZgO22HItuuF8Z5ZPkT-IderjmOCFXwhsJBu1cIzEqyA6UopFvgvpdup6r6dqM"
                />
                <img
                  alt="Mastercard Logo"
                  className="w-8 h-8 rounded-full border-2 border-surface bg-white p-1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQHFBiVPxi9Vn3UOUOV3yj8ZERds0sDZAycb1FVXqX62n0EHc6ZBI88uJJb1x_Sy1YJJGh9y_gLSASoa4vF-paT_d5F-rYqeROu5BMgh_gthJzqGyqvXzjJfWDx6xvhFGpYR19nb03LvhiGi9h0cntIuyqFr-EMoJH_2zgJEzpX9RDtG6b6jE7beVgHgQse761GVk_IvwJD2wcEWs98r3HMowVkf7nCIt3Kk_3Nn_HloUriwql79nNn0RgyVEg8ahAgIgRO4B_U5hB"
                />
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Secure AES-256 Payouts</span>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Available Balance */}
            <div className="col-span-12 bg-surface-container-low rounded-xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>account_balance_wallet</span>
              </div>
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                    Available Balance
                    <span className="material-symbols-outlined text-xs text-tertiary">info</span>
                  </p>
                  <h2 className="text-7xl font-bold font-headline mt-2 tracking-tighter text-on-surface">
                    {walletBalance === null ? '...' : vnd(walletBalance)}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => { setShowTopUp(true); setTopUpAmount(''); setTopUpError(''); }}
                    className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined">add_card</span>
                    Top Up
                  </button>
                </div>
                <div className="pt-6 border-t border-outline-variant/10 grid grid-cols-3 gap-8">
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="col-span-12 space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold font-headline">Recent Transactions</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-tighter bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors">
                    Export CSV
                  </button>
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-tighter text-on-surface-variant">
                    Filter
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filtered.map((tx) => (
                  <div
                    key={tx.id}
                    className="group flex items-center justify-between p-5 bg-surface-container-lowest hover:bg-primary-container/5 transition-all rounded-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-full ${tx.iconBg} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${tx.iconColor}`}>{tx.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{tx.label}</p>
                        <p className="text-xs text-on-surface-variant">Transaction #{tx.id} • {tx.meta}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div className="hidden md:block">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter ${tx.statusStyle}`}>
                          {tx.status}
                        </span>
                      </div>
                      <p className={`text-lg font-bold font-headline ${tx.amountStyle}`}>{tx.amount}</p>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        chevron_right
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Analysis */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Earnings Velocity */}
              <div className="bg-surface-container rounded-xl p-6 border-l-4 border-primary/30">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Earnings Velocity</p>
                <div className="flex items-end gap-3 h-24">
                  {BAR_HEIGHTS.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 ${BAR_OPACITIES[i]} rounded-t-sm`}
                      style={{ height: h }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm font-medium text-on-surface-variant">
                  Your earnings are up 24% compared to last month.
                </p>
              </div>

              {/* Payout Cycle */}
              <div className="bg-surface-container rounded-xl p-6 border-l-4 border-secondary/30">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Payout Cycle</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant uppercase">Next Auto-Payout</span>
                    <span className="font-bold text-sm">March 1, 2024</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-2/3" />
                  </div>
                  <p className="text-[10px] text-on-surface-variant">Scheduled for Wednesday at 00:00 UTC</p>
                </div>
              </div>

              {/* Security Status */}
              <div className="bg-surface-container rounded-xl p-6 border-l-4 border-tertiary/30">
                <p className="text-xs font-bold uppercase tracking-widest text-tertiary mb-4">Security Status</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-tertiary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      verified_user
                    </span>
                    <span className="text-sm font-bold">Encrypted Connection</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    All financial data is processed via PCI-DSS Level 1 compliant gateways. No full card or bank
                    details are stored on Kinetic servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
}
