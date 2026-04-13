import React from 'react';

const ReportManagement = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      {/* TopNavBar Shell */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)] flex justify-between items-center px-8 h-16 w-full">
        <div className="flex items-center gap-8 pl-[18rem]">
          <h1 className="text-xl font-headline font-bold tracking-tighter text-orange-700 dark:text-orange-500 uppercase">
            Global Analytics & Reports
          </h1>
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
            data-alt="admin face"
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
            className="flex items-center gap-3 px-3 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
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
            className="flex items-center gap-3 px-3 py-3 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-bold border-r-4 border-orange-700 hover:translate-x-1 transition-transform duration-300"
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              analytics
            </span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">
              Reports
            </span>
          </a>
        </nav>
        <div className="mt-auto space-y-1">
          <button className="w-full mb-6 bg-primary text-on-primary font-bold uppercase py-3 rounded-lg text-[10px] tracking-widest hover:opacity-90 transition-opacity">
            Generate Quarterly
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
              Business Intelligence
            </span>
            <h2 className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tighter leading-tight">
              Reports<br />Overview.
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-surface-container-low px-6 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              This Quarter
            </button>
            <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-lg">download</span>
              Export PDF
            </button>
          </div>
        </header>

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group border-t-4 border-primary">
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Platform GMV
            </p>
            <h3 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tighter">
              $1.24M
            </h3>
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+18.4% WoW</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group border-t-4 border-secondary">
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Platform Revenue
            </p>
            <h3 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tighter">
              $112,400
            </h3>
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+12.2% WoW</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group border-t-4 border-tertiary">
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Conversion Rate
            </p>
            <h3 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tighter">
              3.8%
            </h3>
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+0.4% WoW</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)] group border-t-4 border-error">
            <p className="label-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">
              Dispute Rate
            </p>
            <h3 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tighter">
              1.2%
            </h3>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">remove</span>
              <span className="text-xs font-bold">Stable</span>
            </div>
          </div>
        </div>

        {/* Charts & Graphs Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Chart Placeholder */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline font-bold text-xl uppercase tracking-tighter">
                Revenue Growth Overview
              </h4>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high">
                  1M
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
                  3M
                </button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high">
                  1Y
                </button>
              </div>
            </div>
            <div className="h-64 flex items-end gap-4">
              {/* Fake Bar Chart */}
              <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[30%] hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[45%] hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[35%] hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/40 rounded-t-lg relative group h-[60%] hover:bg-primary/60 transition-colors"></div>
              <div className="flex-1 bg-primary rounded-t-lg relative group h-[85%] shadow-lg shadow-primary/20"></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[50%] hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[70%] hover:bg-primary/40 transition-colors"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase mt-4 border-t border-outline-variant/20 pt-4">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span className="text-primary">Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Category Performance */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
              <h4 className="font-headline font-bold text-xl uppercase tracking-tighter mb-6">
                Category Sales GMV
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Road Bikes</span>
                    <span className="text-xs font-bold">$540k</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-[60%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mountain Bikes</span>
                    <span className="text-xs font-bold">$380k</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high overflow-hidden rounded-full">
                    <div className="bg-secondary h-full w-[40%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Gravel & CX</span>
                    <span className="text-xs font-bold">$210k</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high overflow-hidden rounded-full">
                    <div className="bg-tertiary h-full w-[25%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Export Cards */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-primary/10 hover:bg-primary/20 transition-colors p-6 rounded-xl flex flex-col items-center justify-center gap-3 border border-primary/20">
                <span className="material-symbols-outlined text-3xl text-primary">description</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary text-center">Export Full Ledger</span>
              </button>
              <button className="bg-secondary/10 hover:bg-secondary/20 transition-colors p-6 rounded-xl flex flex-col items-center justify-center gap-3 border border-secondary/20">
                <span className="material-symbols-outlined text-3xl text-secondary">group</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary text-center">Export User Data</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportManagement;
