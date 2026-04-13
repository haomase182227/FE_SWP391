import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      {/* TopNavBar Shell */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)] flex justify-between items-center px-8 h-16 w-full">
        <div className="flex items-center gap-8">
          <span className="text-xl font-['Space_Grotesk'] font-bold tracking-tighter text-orange-700 dark:text-orange-500">
            The Kinetic Editorial Admin
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <a
              className="text-orange-700 dark:text-orange-500 font-bold border-b-2 border-orange-700 font-['Inter'] tracking-tight hover:text-orange-600 transition-colors"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-zinc-500 dark:text-zinc-400 font-medium font-['Inter'] tracking-tight hover:text-orange-600 transition-colors"
              href="#"
            >
              Logs
            </a>
            <a
              className="text-zinc-500 dark:text-zinc-400 font-medium font-['Inter'] tracking-tight hover:text-orange-600 transition-colors"
              href="#"
            >
              Settings
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-500 active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-zinc-500 active:scale-95 duration-200">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <img
            alt="Admin Avatar"
            className="w-8 h-8 rounded-full border border-outline-variant/20 object-cover"
            data-alt="Close up portrait of a professional male architect with salt and pepper hair against a neutral background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiPk_Vf9LAwAiW_XX14uOlyG3ee5oXRFH17nspNf-47PqdydBy6R8wwenc4aFA2wU8vVZSwVFfhVsiTF9j_iaEXI60r4PDvTFUbbwjNSc5LGgFq7MjOzTxOPh3eXPA_HEozC-qxRzROPMSC9LaWGxPWwyRDGbkmNSiWvCl5NNGYpYZ8PopqWr5XWxbI8rhJsqpMyBplc4Vn2WZAfNXRBzBNYXmp8arVV6ZI28WbKrwJ8qA90l8mC06dtJWhaSUpg2wjak7OGiilXqc"
          />
        </div>
      </nav>

      {/* SideNavBar Shell */}
      <aside className="fixed left-0 h-full w-64 z-50 bg-zinc-50 dark:bg-zinc-950 flex flex-col h-screen py-8 px-4 border-r border-zinc-200/20 hidden md:flex">
        <div className="mb-10 px-2">
          <h1 className="font-['Space_Grotesk'] text-2xl font-black italic text-orange-700 dark:text-orange-500 uppercase leading-none">
            Kinetic Admin
          </h1>
          <p className="font-['Inter'] uppercase tracking-widest text-[10px] text-zinc-400 mt-1">
            Precision Velocity
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-3 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-bold border-r-4 border-orange-700 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dashboard
            </span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Dashboard
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              User Management
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">rule</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Listing Moderation
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Transactions
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">engineering</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Inspectors
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Reports
            </span>
          </a>
        </nav>
        <div className="mt-auto space-y-1">
          <button className="w-full mb-6 bg-primary text-on-primary font-bold uppercase py-3 rounded-lg text-[10px] tracking-widest hover:opacity-90 transition-opacity">
            Export Global Data
          </button>
          <a
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            href="#"
          >
            <span className="material-symbols-outlined">contact_support</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Support
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            href="#"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Sign Out
            </span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-24 px-8 pb-12 min-h-screen">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="label-md uppercase font-bold text-on-surface-variant tracking-widest mb-2 block">
              System Pulse
            </span>
            <h2 className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tighter leading-tight">
              Admin<br />Overview.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Server Status
                </p>
                <p className="font-headline font-bold text-lg">99.98% Uptime</p>
              </div>
            </div>
            <div className="bg-secondary p-6 rounded-xl text-on-secondary flex items-center gap-4">
              <span className="material-symbols-outlined">speed</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  API Latency
                </p>
                <p className="font-headline font-bold text-lg">42ms</p>
              </div>
            </div>
          </div>
        </header>

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Revenue */}
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">payments</span>
            </div>
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Total Revenue
            </p>
            <h3 className="text-4xl font-headline font-bold text-primary mb-2 tracking-tighter">
              $428,950
            </h3>
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+12.4% vs LY</span>
            </div>
          </div>
          {/* Active Users */}
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">group</span>
            </div>
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Active Users
            </p>
            <h3 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tighter">
              14,202
            </h3>
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+5.2% Today</span>
            </div>
          </div>
          {/* Pending Moderation */}
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">inventory_2</span>
            </div>
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Pending Approval
            </p>
            <h3 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tighter">
              87
            </h3>
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-sm">priority_high</span>
              <span className="text-xs font-bold">12 Critical</span>
            </div>
          </div>
          {/* Active Disputes */}
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group border-2 border-primary/5">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">warning</span>
            </div>
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Active Disputes
            </p>
            <h3 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tighter">
              04
            </h3>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="text-xs font-bold">Avg. Resolution: 4h</span>
            </div>
          </div>
        </div>

        {/* System Health & Activity Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-headline font-bold text-2xl tracking-tighter uppercase">
                Recent Stream
              </h4>
              <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">
                View All Logs
              </button>
            </div>
            <div className="space-y-4">
              {/* Activity Item 1 */}
              <div className="bg-surface-container-low p-6 rounded-xl flex gap-6 items-center hover:bg-surface-container-high transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-on-surface">
                      New Transaction: Pinarello Dogma F12
                    </p>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                      2m ago
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    User <span className="text-on-surface font-medium">@velovelo</span>{' '}
                    purchased from{' '}
                    <span className="text-on-surface font-medium">@thecyclinghub</span>.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold text-primary">$8,450</p>
                </div>
              </div>
              {/* Activity Item 2 */}
              <div className="bg-surface-container-low p-6 rounded-xl flex gap-6 items-center hover:bg-surface-container-high transition-colors">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-on-surface">
                      Pro-Inspector Verified
                    </p>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                      14m ago
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Marco Rossi has been approved as an authorized Veloce Inspector.
                  </p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-tertiary text-on-tertiary text-[10px] font-bold rounded-full uppercase">
                    Verified
                  </span>
                </div>
              </div>
              {/* Activity Item 3 */}
              <div className="bg-surface-container-low p-6 rounded-xl flex gap-6 items-center hover:bg-surface-container-high transition-colors">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">flag</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-on-surface">
                      Listing Flagged for Review
                    </p>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                      38m ago
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Incomplete serial number detected on Specialized Tarmac SL7.
                  </p>
                </div>
                <button className="px-4 py-2 bg-on-surface text-surface text-[10px] font-bold rounded uppercase tracking-widest hover:opacity-90">
                  Review
                </button>
              </div>
              {/* Activity Item 4 */}
              <div className="bg-surface-container-low p-6 rounded-xl flex gap-6 items-center hover:bg-surface-container-high transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-on-surface">
                      Payout Batch Completed
                    </p>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                      1h ago
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    124 pending seller payouts successfully processed.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold text-primary">$124k</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Card: Listing Performance */}
          <div className="space-y-6">
            <div className="px-2">
              <h4 className="font-headline font-bold text-2xl tracking-tighter uppercase">
                Inventory Stats
              </h4>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Aero Road
                    </span>
                    <span className="text-xs font-bold">42%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-high overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-[42%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Mountain / MTB
                    </span>
                    <span className="text-xs font-bold">28%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-high overflow-hidden rounded-full">
                    <div className="bg-secondary h-full w-[28%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Gravel / CX
                    </span>
                    <span className="text-xs font-bold">18%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-high overflow-hidden rounded-full">
                    <div className="bg-tertiary h-full w-[18%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      E-Bikes
                    </span>
                    <span className="text-xs font-bold">12%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-high overflow-hidden rounded-full">
                    <div className="bg-orange-400 h-full w-[12%]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-outline-variant/10">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    alt="Hot Bike"
                    className="w-20 h-14 object-cover rounded-lg"
                    data-alt="Modern professional carbon fiber racing bicycle standing against a clean white wall with studio lighting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnyyjMbTtYrGw5iATsq7UNWRBCBtG_dcu1lG9TP_A3alT3-AdGYxzbgT6f3ego092s9a-fnLAjLGLtLQ4KdPn03uKlWKC8nKHbjDbG9l_W-NGIAs0W14ay51jeCW6MxkUWQ7UR8Nu86nb9OeSZmNUyemwX3hrUw7dNROvmRUCZLAulRcsO6LgbZvbhgdh53CDA830qx_RNf71B0UhPRsImQ-08OUAv4bQcn87mjv6_V3o0APFQ2vVi7H83WhU6BrYouEfveCsMJUuB"
                  />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Top Performer
                    </p>
                    <p className="text-sm font-bold leading-tight">
                      Cervélo S5 Ultegra Di2
                    </p>
                    <p className="text-xs text-on-surface-variant">12 bids this week</p>
                  </div>
                </div>
                <button className="w-full py-3 border border-outline-variant/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary-container transition-colors">
                  Generate Inventory Report
                </button>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Command Center
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-lg hover:translate-y-[-2px] transition-transform duration-200">
                  <span className="material-symbols-outlined text-primary mb-2">
                    add_task
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center">
                    New Notice
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-lg hover:translate-y-[-2px] transition-transform duration-200">
                  <span className="material-symbols-outlined text-secondary mb-2">
                    mail
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center">
                    Blast Email
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-lg hover:translate-y-[-2px] transition-transform duration-200">
                  <span className="material-symbols-outlined text-tertiary mb-2">
                    lock_reset
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center">
                    Security Hub
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-lg hover:translate-y-[-2px] transition-transform duration-200">
                  <span className="material-symbols-outlined text-on-surface-variant mb-2">
                    settings_backup_restore
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center">
                    Snapshots
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB for Global Action */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_20px_40px_rgba(78,33,32,0.2)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          search
        </span>
      </button>
    </div>
  );
};

export default Dashboard;
