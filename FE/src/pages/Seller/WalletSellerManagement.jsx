import React, { useState } from 'react';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Account', href: '#' },
  { icon: 'directions_bike', label: 'Listings', href: '#' },
  { icon: 'shopping_cart', label: 'Orders', href: '#' },
  { icon: 'account_balance_wallet', label: 'Wallet', href: '#', active: true, filled: true },
  { icon: 'verified', label: 'Inspections', href: '#' },
];

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
    amount: '+$8,420.00',
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
    amount: '-$1,500.00',
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
    amount: '+$1,850.00',
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
    amount: '-$15.00',
    amountStyle: 'text-on-surface',
  },
];

const BAR_HEIGHTS = ['40%', '60%', '50%', '80%', '100%'];
const BAR_OPACITIES = ['bg-primary/10', 'bg-primary/10', 'bg-primary/20', 'bg-primary/40', 'bg-primary'];

export default function WalletSellerManagement() {
  const [search, setSearch] = useState('');

  const filtered = TRANSACTIONS.filter(
    (t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full flex flex-col py-6 w-64 border-r border-outline-variant/20 bg-surface-container-low z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">directions_bike</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-primary">Veloce Kinetic</span>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                item.active
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-low scale-95'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={item.active && item.filled ? { fontVariationSettings: '"FILL" 1' } : {}}
              >
                {item.icon}
              </span>
              <span className="text-xs uppercase tracking-wider">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="px-6 pt-6 mt-auto border-t border-outline-variant/10">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
            <img
              alt="Seller Profile Avatar"
              className="w-10 h-10 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh9Q9_fY-ouIys8629M86NNrQJIg92nQPcsJBqsXJZe9JpIhS_4O1BTYPv6fkdx04128V339iWFKnNo_2Qr2SCEeG3KOprb0-a1xryQOoKlWYaroBr_3zxSEq93pDeHfCo5AyQ-ftWamMd7IcvofnitwdqZXx-RAD5G6KMyqeXfLaziiaP1Ig4EEH5mU7CSa1EepNIY7zxxpqShMFh8jA23nv3-zh7sqZpkw48OONfi7nkBORuEiHz0GY2ULX-k-NroVgz4NXuCD3H"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Verified Merchant</p>
              <p className="text-[10px] text-on-surface-variant">Profile Settings</p>
            </div>
          </div>
        </div>
      </nav>

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
            <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-10 relative overflow-hidden group">
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
                    $12,482.<span className="text-primary-container">50</span>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-3">
                    <span className="material-symbols-outlined">payments</span>
                    Withdraw Funds
                  </button>
                  <button className="border border-outline/20 hover:bg-surface-container-high transition-colors px-8 py-4 rounded-xl font-bold uppercase tracking-wider flex items-center gap-3">
                    <span className="material-symbols-outlined">schedule</span>
                    View Schedule
                  </button>
                </div>
                <div className="pt-6 border-t border-outline-variant/10 grid grid-cols-3 gap-8">
                  {[
                    { label: 'Pending Clearance', value: '$2,140.00' },
                    { label: 'Lifetime Earnings', value: '$84,921.12' },
                    { label: 'Tax Year 2024', value: '$42,300.40' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1">{stat.label}</p>
                      <p className="text-xl font-bold font-headline text-on-surface">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payout Destination */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-highest rounded-xl p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold font-headline">Payout Destination</h3>
                  <span className="px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/20 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">account_balance</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Chase Business</p>
                      <p className="text-xs text-on-surface-variant">Ending in •••• 9210</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/5">
                    <span>Verification Date</span>
                    <span className="font-medium text-on-surface">Oct 12, 2023</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/20">
                Manage Bank Details
              </button>
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
    </div>
  );
}
