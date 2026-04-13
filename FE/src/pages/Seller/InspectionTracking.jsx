import React, { useState } from 'react';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Account', href: '#' },
  { icon: 'directions_bike', label: 'Listings', href: '#' },
  { icon: 'shopping_cart', label: 'Orders', href: '#' },
  { icon: 'account_balance_wallet', label: 'Wallet', href: '#' },
  { icon: 'verified', label: 'Inspections', href: '#', active: true },
];

const TABS = ['All Inspections', 'Pending', 'In Progress', 'Verified'];

const INSPECTIONS = [
  {
    id: 1,
    model: 'S-Works Tarmac SL8',
    serial: 'VELO-8821-2024',
    date: 'Oct 12, 2023',
    time: '14:32 UTC',
    inspectorInitials: 'MW',
    inspectorName: 'Marcus Wright',
    inspectorBg: 'bg-secondary-container',
    inspectorText: 'text-on-secondary-container',
    status: 'Verified',
    statusStyle: 'bg-tertiary text-on-tertiary',
    statusIcon: 'verified',
    statusIconFill: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY1mgDFs04s2iMDkhAKGq_ZDoOLDUSddniDMcbC1HLwwQm8F68y7JGMY4WsxZHEC2XTup-h13VqoHqrqs5Vm1NbVuSU02_w_j45MBsWVT_XKFzjQjL1H_rij0Mk4RLuDQossMvTZ024hxNEhbJ6pUzJxp1Xz60yDAW5pEtlnLF7SLF8oI4g5bEmrUZrM-rBnCTLGeF0HoVJSUc2ZiEl_D8d8ud3xRF4rChthtNuSM8-zMZX9z98TiSpr92oiFV2R77gMSWW7pM-tn1',
    action: 'report',
  },
  {
    id: 2,
    model: 'Pinarello Dogma F12',
    serial: 'VELO-4412-2023',
    date: 'Oct 14, 2023',
    time: '09:15 UTC',
    inspectorInitials: 'SC',
    inspectorName: 'Sarah Chen',
    inspectorBg: 'bg-primary-container/20',
    inspectorText: 'text-primary',
    status: 'In Progress',
    statusStyle: 'bg-secondary text-on-secondary',
    statusIcon: 'settings_backup_restore',
    statusIconFill: false,
    statusIconPulse: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXyo7YdlJSH2xIqe0oPWTutjDA6qIF0XhoGKXvIsv_0RvfOlxZCu0It4WTKHxWzesdON0Cng2QmIPAOqzZGzaefB7LDkVTad84JeIcKhhGeS_5H49gMWm_8f71tuprTUItCcV6xB8ifVBeCQTpqaAXDov6nX_IHyb0kGhbN4abqymzp_cxnguT5mYK-d4Qn1DV__vAaKKy1vw4ysAMP1Qw6WkZOhADCMMJIW1jKgvkVVI_hGID1_9lAWie6ApfeDtCh2icuK_7yUjv',
    action: 'pending',
  },
  {
    id: 3,
    model: 'Canyon Aeroad CFR',
    serial: 'VELO-1190-2024',
    date: 'Oct 11, 2023',
    time: '11:02 UTC',
    inspectorInitials: 'JB',
    inspectorName: 'James Bond',
    inspectorBg: 'bg-error-container/20',
    inspectorText: 'text-error',
    status: 'Failed',
    statusStyle: 'bg-error text-on-error',
    statusIcon: 'dangerous',
    statusIconFill: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOoyHDg4AlV-CYLRqlQ-_kkEXm05i0fDxm06Up8bkcWmdgZ9m7ZLK1h306CQN9TP8FfehNjU5iXtIi7aWRf1akdnAeREI_IvnL0S80AJ0oagdBvJF3T1RJUHeQf2vVA7IaCdFEfkHpWa3CGyDW4JW9M8D5eppqURTwAuuudctRQ-xHmMiXVDZap-pEdc9zDYq8dSZHd1AvzNwvqiMtVP5HbQeqP2_zmohto-fX4rEAMCN0M6S9M3g-pa2NR2qWQ9YTPsb_IvU0TTN',
    action: 'review',
  },
  {
    id: 4,
    model: 'Cannondale SuperSix',
    serial: 'VELO-3329-2024',
    date: 'Oct 15, 2023',
    time: 'Just now',
    inspectorInitials: null,
    inspectorName: null,
    inspectorBg: '',
    inspectorText: '',
    status: 'Pending',
    statusStyle: 'border border-outline-variant/30 text-on-surface-variant',
    statusIcon: 'schedule',
    statusIconFill: false,
    img: null,
    action: 'none',
  },
];

function InspectionCard({ item }) {
  return (
    <div className="group relative bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 hover:bg-primary-container/5 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
        {/* Image */}
        <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
          {item.img ? (
            <img
              src={item.img}
              alt={item.model}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-high animate-pulse flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">directions_bike</span>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-widest mb-1">Bike Model</p>
            <h3 className="text-xl font-bold font-headline leading-tight">{item.model}</h3>
            <p className="text-xs text-on-surface-variant mt-1">SN: {item.serial}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-widest mb-1">Requested On</p>
            <p className="text-sm font-semibold font-headline">{item.date}</p>
            <p className="text-[10px] text-on-surface-variant mt-1">{item.time}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-widest mb-1">Lead Inspector</p>
            {item.inspectorName ? (
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-5 h-5 rounded-full ${item.inspectorBg} flex items-center justify-center text-[10px] font-bold ${item.inspectorText}`}>
                  {item.inspectorInitials}
                </div>
                <p className="text-sm font-semibold">{item.inspectorName}</p>
              </div>
            ) : (
              <p className="text-sm font-medium italic text-on-surface-variant">Unassigned</p>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <span className={`w-fit px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 ${item.statusStyle}`}>
              <span
                className={`material-symbols-outlined text-[14px] ${item.statusIconPulse ? 'animate-pulse' : ''}`}
                style={item.statusIconFill ? { fontVariationSettings: '"FILL" 1' } : {}}
              >
                {item.statusIcon}
              </span>
              {item.status}
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-4">
          {item.action === 'report' && (
            <a href="#" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-1">
              View Report
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          )}
          {item.action === 'pending' && (
            <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest opacity-50">
              Pending Completion
            </span>
          )}
          {item.action === 'review' && (
            <button className="text-xs font-bold uppercase tracking-widest text-error hover:opacity-70 transition-opacity">
              Review Issues
            </button>
          )}
          {item.action === 'none' && (
            <button className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/50 cursor-not-allowed">
              No Action
            </button>
          )}
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-surface-container/20 to-transparent pointer-events-none" />
    </div>
  );
}

export default function InspectionTracking() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Request Date');

  const filtered = INSPECTIONS.filter((item) => {
    const matchSearch =
      item.model.toLowerCase().includes(search.toLowerCase()) ||
      item.serial.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 0) return matchSearch;
    const tabMap = ['', 'Pending', 'In Progress', 'Verified'];
    return matchSearch && item.status === tabMap[activeTab];
  });

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen font-body">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-6 w-64 border-r border-outline-variant/20 bg-surface-container-low z-50">
        <div className="px-6 mb-10">
          <h1 className="text-xl font-bold tracking-tighter text-primary">Veloce Kinetic</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium mt-1">Verified Merchant</p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                item.active
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-low'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-xs uppercase tracking-tight font-semibold">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-4 rounded-xl bg-surface-container-high flex items-center gap-3 mb-6">
            <img
              className="w-10 h-10 rounded-full object-cover"
              alt="Seller Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZXG5oTevhws0zmhZD8hvuA6DAemO_EQDSyTXihqNKpf5XVVrGZW059j7s4wOgjHFxzfuRimqRr8jXzVcUdYXCJQFhzCDiA2j4WANoAZkEhJtjRmYZEvEwte2U91PLTFl1xRQgAN0fkFJfEwzlW8H-k88B_ZWqrxaPE1Ddo3TVcC36XTSF1FxFpHG4ALlT2kmWvgCu6deK8BYsOBZ42OduERWXWTbKD2keMaaI1LePnL5VO6nsZLZDe35yUO9AqpuNIFMwoda90Oir"
            />
            <div>
              <p className="text-xs font-bold leading-none">Veloce Kinetic</p>
              <p className="text-[10px] text-on-surface-variant">Merchant ID: 8829</p>
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary text-xs font-bold uppercase tracking-widest rounded-lg scale-95 active:scale-90 transition-transform">
            Create Listing
          </button>
        </div>
      </aside>

      {/* Main Shell */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 w-full h-16 bg-surface/80 backdrop-blur-xl shadow-sm shadow-on-surface/5">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none focus:ring-1 focus:ring-primary/20 text-sm rounded-lg placeholder:text-on-surface-variant/50"
                placeholder="Search inspections..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                notifications
              </span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                settings
              </span>
            </div>
            <div className="h-6 w-px bg-outline-variant/20" />
            <button className="text-sm font-medium text-primary hover:opacity-80 transition-opacity">Support</button>
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8">
          {/* Hero Header */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Quality Control</p>
                <h2 className="text-5xl font-bold tracking-tighter font-headline text-on-surface">Inspection Tracking</h2>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">Total Active</p>
                  <p className="text-2xl font-bold font-headline">12</p>
                </div>
                <div className="h-10 w-px bg-outline-variant/30" />
                <div className="text-right">
                  <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">Pass Rate</p>
                  <p className="text-2xl font-bold font-headline text-tertiary">94.2%</p>
                </div>
              </div>
            </div>
            <div className="w-full h-[2px] bg-gradient-to-r from-primary/30 via-outline-variant/10 to-transparent" />
          </section>

          {/* Filter Bar */}
          <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-xl">
            <div className="flex gap-1">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-6 py-2 text-xs uppercase tracking-tight font-semibold rounded-lg transition-colors ${
                    activeTab === i
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pr-2">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-on-surface focus:ring-0 cursor-pointer"
              >
                <option>Request Date</option>
                <option>Status</option>
                <option>Value</option>
              </select>
            </div>
          </div>

          {/* Inspection Cards */}
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((item) => (
              <InspectionCard key={item.id} item={item} />
            ))}
          </div>

          {/* Bottom Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            {/* Guidelines */}
            <div className="lg:col-span-2 p-8 bg-surface-container-high rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-bold font-headline mb-4">Inspection Guidelines 2024</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
                  All kinetic-certified listings must undergo a rigorous 48-point technical inspection. Our team
                  verifies frame integrity, drivetrain wear, and electronic shifting diagnostics using proprietary
                  Veloce Kinetic software.
                </p>
              </div>
              <div className="mt-8 flex gap-8">
                {[
                  { value: '48', label: 'Points Checked' },
                  { value: '24h', label: 'Avg Response' },
                  { value: '100%', label: 'Authenticity' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold font-headline">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-primary tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Card */}
            <div className="p-8 bg-primary text-on-primary rounded-2xl relative overflow-hidden flex flex-col">
              <h4 className="text-xl font-bold font-headline relative z-10 mb-2">Need a faster turnaround?</h4>
              <p className="text-sm text-primary-container font-medium relative z-10 mb-8">
                Upgrade your listing to Pro-Priority for 4-hour inspection windows.
              </p>
              <button className="mt-auto w-full py-4 bg-on-primary text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-surface-container transition-colors relative z-10">
                Upgrade to Pro
              </button>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full border-[12px] border-primary-container/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-on-primary/10 rounded-full" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
