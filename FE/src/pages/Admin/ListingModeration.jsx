import React from 'react';

const ListingModeration = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 h-full w-64 z-50 flex flex-col py-8 px-4 border-r border-zinc-200/20 bg-zinc-50 dark:bg-zinc-950">
        <div className="mb-10 px-4">
          <div className="font-['Space_Grotesk'] text-2xl font-black italic text-orange-700 dark:text-orange-500 uppercase tracking-tighter">
            Kinetic Admin
          </div>
          <div className="font-['Inter'] uppercase tracking-widest text-[10px] text-zinc-500 mt-1">
            Precision Velocity
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-['Inter'] uppercase tracking-widest text-[10px] group transition-transform duration-300 hover:translate-x-1"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-['Inter'] uppercase tracking-widest text-[10px] group transition-transform duration-300 hover:translate-x-1"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">group</span>
            <span>User Management</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-bold border-r-4 border-orange-700 font-['Inter'] uppercase tracking-widest text-[10px] group"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">rule</span>
            <span>Listing Moderation</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-['Inter'] uppercase tracking-widest text-[10px] group transition-transform duration-300 hover:translate-x-1"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">payments</span>
            <span>Transactions</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-['Inter'] uppercase tracking-widest text-[10px] group transition-transform duration-300 hover:translate-x-1"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">engineering</span>
            <span>Inspectors</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-['Inter'] uppercase tracking-widest text-[10px] group transition-transform duration-300 hover:translate-x-1"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">analytics</span>
            <span>Reports</span>
          </a>
        </nav>
        <div className="mt-auto space-y-1 pt-8 border-t border-zinc-200/10">
          <a
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 font-['Inter'] uppercase tracking-widest text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-transform duration-300 hover:translate-x-1"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">contact_support</span>
            <span>Support</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 font-['Inter'] uppercase tracking-widest text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-transform duration-300 hover:translate-x-1"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 left-64 h-16 z-40 flex justify-between items-center px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-headline font-bold tracking-tighter text-orange-700 dark:text-orange-500 uppercase">
              Moderation Queue
            </h1>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                search
              </span>
              <input
                className="pl-10 pr-4 py-1.5 rounded-xl border-none bg-zinc-100 dark:bg-zinc-900 text-xs w-64 focus:ring-1 focus:ring-orange-500/30 font-body text-on-surface"
                placeholder="Search Listings..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button className="material-symbols-outlined text-zinc-500 hover:text-orange-600 transition-colors">
                notifications
              </button>
              <button className="material-symbols-outlined text-zinc-500 hover:text-orange-600 transition-colors">
                help_outline
              </button>
            </div>
            <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-200">
              <img
                alt="Admin Avatar"
                className="w-full h-full object-cover"
                data-alt="professional headshot of a mature male administrator with a confident expression in a bright studio setting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAggxWHx0yFl0dO_ksSfiRIcYoAx_OLUE_OuNm5PJnZbHHobKDz1YF_jexEMq1GxMl2Jr8xJVBH2mzbram9hxAbv3uj9d-9R_uCyPNRV-pCoeBPVFvLneVudmX-PLgu5M6XNPGMzE8oQYEO3dRSxxU0KBNoC1pjpLa3P1LDqZqpUyiE0uwloibBCgsCCza6cjSLfLaRLfZkrJneVyiCNUl7kPPrujn1Kfo0uHd2QGA47-nXEEwPb_USGI4LJNXr-WLCT1qaJxAJxKdp"
              />
            </div>
          </div>
        </header>
        <div className="pt-24 px-12 pb-12">
          {/* Filter Bar */}
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">
                Moderation Workflow
              </span>
              <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
                Pending Approval
              </h2>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-surface-container-high text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-orange-100 transition-colors">
                Urgent Only
              </button>
              <button className="px-6 py-2 bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Global Data
              </button>
            </div>
          </div>

          {/* Bento Queue Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Listing Card 1 (Large Featured Style) */}
            <div
              className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col md:flex-row group"
              style={{ boxShadow: '0 10px 30px -15px rgba(78, 33, 32, 0.1)' }}
            >
              <div className="w-full md:w-1/2 relative h-80 md:h-auto overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  data-alt="high-end carbon fiber road bike in matte black leaning against a white studio background with dramatic lighting highlights"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiB6zR0XYQuEwjrGU-YMC96hO94PeEWtSRnNVQI8ggEy1-TM2eUKULsSAcASmByLez5DL3v63UiPT3LU6KPuUnexs8q0E_J8gE3TxHUagQZhXUaOqdi7nHQAaCqPo1UTzA9wraMzzN434fbrAOK0WnDxv4p6uaUVxI9Onkc-Y2ZMpoioL-qrkd4AVl8ao7OrQ3Iv4_of2gCpzzQEQxOfhya-_eTzRndwYgCXHHi8aobz7vaLEuF9Iv7it8gvGRlCU_CULG6-K-cfCO"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-secondary text-on-secondary font-label text-[8px] uppercase tracking-widest font-bold rounded-full">
                    New Arrival
                  </span>
                  <span className="px-3 py-1 bg-tertiary text-on-tertiary font-label text-[8px] uppercase tracking-widest font-bold rounded-full flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[10px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>{' '}
                    Verified Seller
                  </span>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface uppercase italic">
                      S-Works Tarmac SL7
                    </h3>
                    <p className="text-on-surface-variant font-label text-sm">
                      Listed by: <span className="text-secondary font-bold">Julian Alaphilippe</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-2xl font-black text-primary">$12,500</span>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Fixed Price
                    </p>
                  </div>
                </div>
                {/* Spec-Grid Asymmetric Layout */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                  <div className="flex flex-col border-l border-primary/20 pl-4">
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">
                      Frame Material
                    </span>
                    <span className="font-headline text-xs font-bold text-on-surface uppercase">
                      Fact 12r Carbon
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-primary/20 pl-4">
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">
                      Weight
                    </span>
                    <span className="font-headline text-xs font-bold text-on-surface uppercase">
                      6.8kg (Pro Setup)
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-primary/20 pl-4">
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">
                      Groupset
                    </span>
                    <span className="font-headline text-xs font-bold text-on-surface uppercase">
                      SRAM Red eTap AXS
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-primary/20 pl-4">
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">
                      Condition
                    </span>
                    <span className="font-headline text-xs font-bold text-on-surface uppercase">
                      Near Mint
                    </span>
                  </div>
                </div>
                <div className="mt-auto pt-6 flex gap-3">
                  <button className="flex-1 py-3 bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest font-bold rounded-lg hover:brightness-110 transition-all">
                    Approve Listing
                  </button>
                  <button className="px-4 py-3 bg-surface-container-high text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-error-container/10 hover:text-error transition-colors">
                    Reject
                  </button>
                  <button className="px-4 py-3 bg-surface-container-high text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-secondary-container/20 hover:text-secondary transition-colors material-symbols-outlined">
                    engineering
                  </button>
                </div>
              </div>
            </div>

            {/* Listing Statistics (Bento Element) */}
            <div
              className="col-span-12 lg:col-span-4 bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between relative overflow-hidden"
              style={{ boxShadow: '0 10px 30px -15px rgba(78, 33, 32, 0.1)' }}
            >
              <div className="absolute -right-12 -bottom-12 opacity-10">
                <span
                  className="material-symbols-outlined text-[200px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  speed
                </span>
              </div>
              <div>
                <h4 className="font-headline text-3xl font-bold tracking-tighter uppercase italic leading-none mb-2">
                  Queue Velocity
                </h4>
                <p className="text-[10px] font-label uppercase tracking-[0.2em] opacity-80">
                  24h Moderation KPI
                </p>
              </div>
              <div className="space-y-4 my-8">
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span className="text-xs font-label">Pending Reviews</span>
                  <span className="font-headline text-2xl font-bold">42</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span className="text-xs font-label">Avg. Wait Time</span>
                  <span className="font-headline text-2xl font-bold">1.4h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-label">Trust Score Avg</span>
                  <span className="font-headline text-2xl font-bold">98%</span>
                </div>
              </div>
              <button className="w-full py-4 bg-white text-primary font-label text-[10px] uppercase tracking-widest font-black rounded-lg hover:bg-orange-50 transition-colors z-10 relative">
                View All Analytics
              </button>
            </div>

            {/* Listing Card 2 (Standard Grid) */}
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 group flex flex-col"
              style={{ boxShadow: '0 10px 30px -15px rgba(78, 33, 32, 0.1)' }}
            >
              <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="professional photography of a gravel bike with wide tires on a dusty trail at sunset, focus on the textured frame"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYoLrVaqQ2HLdM1K9LNm3pS_OYb3RwT6<ctrl42>_LD7PzBQRrVBB_P5ld-_9b758g51SQDcc75c1-3EzljIfLOIGXugHb7vpoFR7_749Cm7gn0blGsyt1Un8oQZn_JGRQpz_-4wV-Xf2jIRCIgJPNEVK7T_jVBvFetGTSsxfitzTJZxoX_451bhsUYXX64WngkCdY6yP_Xqh9d3n4dWciydubScDwiApBflL1j9rigw4cdyEi0oYmSrsJ676S02hPCInQj-lVhcVc62-"
                />
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-surface-container-lowest/90 backdrop-blur rounded-md">
                  <span className="text-[10px] font-headline font-black text-on-surface uppercase">
                    $4,200
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface uppercase italic">
                  Canyon Grizl CF SL
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                  Listed by: Mark Cavendish
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-label block">
                    Size
                  </span>
                  <span className="text-[11px] font-bold text-on-surface">54cm (Medium)</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-label block">
                    Mileage
                  </span>
                  <span className="text-[11px] font-bold text-on-surface">450km</span>
                </div>
              </div>
              <div className="mt-auto flex gap-2">
                <button className="flex-1 py-2 bg-primary text-on-primary font-label text-[9px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all">
                  Approve
                </button>
                <button className="px-3 py-2 bg-surface-container-high text-on-surface-variant font-label text-[9px] uppercase tracking-widest font-bold rounded hover:bg-error-container/10 hover:text-error transition-colors">
                  Reject
                </button>
              </div>
            </div>

            {/* Listing Card 3 (Standard Grid) */}
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 group flex flex-col"
              style={{ boxShadow: '0 10px 30px -15px rgba(78, 33, 32, 0.1)' }}
            >
              <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="vintage restoration of a colnago road bike with chrome accents and celeste green paint, set against a concrete wall"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmuJFIMGbRDQ38x7SlKUKercLvtFxvhZWsvKvf2zbIz1AJTuhC4ifyZAYdfGjhFEUW_80fh96Oz456KW0xo3kiJGFzVakWykHNR9c8O2bz-EgYfOk353a7853tnLZmzspE5YRRfjHNujBEK71YbensWCOBeNlITAlkt337IF__byUc8oFd7_bLH-pzvyJqbxNAGY-JF2edi6az-lchzm1WByIMHBx1p_Fo8fSt6BL61okT7p0V9K3Q0fZThEj-mIKEoDatld7H46Qa"
                />
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-surface-container-lowest/90 backdrop-blur rounded-md">
                  <span className="text-[10px] font-headline font-black text-on-surface uppercase">
                    $2,850
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface uppercase italic">
                  Colnago Master Vintage
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                  Listed by: Eddy Merckx
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-label block">
                    Frame
                  </span>
                  <span className="text-[11px] font-bold text-on-surface">Steel Lugged</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-label block">
                    Year
                  </span>
                  <span className="text-[11px] font-bold text-on-surface">1988</span>
                </div>
              </div>
              <div className="mt-auto flex gap-2">
                <button className="flex-1 py-2 bg-primary text-on-primary font-label text-[9px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all">
                  Approve
                </button>
                <button className="px-3 py-2 bg-surface-container-high text-on-surface-variant font-label text-[9px] uppercase tracking-widest font-bold rounded hover:bg-error-container/10 hover:text-error transition-colors">
                  Reject
                </button>
              </div>
            </div>

            {/* Modals Overlay (Conceptual Placement for design demo) */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="material-symbols-outlined text-error"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  report
                </span>
                <h4 className="font-headline text-sm font-bold uppercase tracking-tight">
                  Rejection Protocol
                </h4>
              </div>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Select a mandatory reason for listing rejection. This will be sent as an official notification to the seller.
              </p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                  <input
                    className="text-primary focus:ring-primary h-3 w-3 border-outline-variant"
                    name="reason"
                    type="radio"
                  />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    Image Quality
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                  <input
                    className="text-primary focus:ring-primary h-3 w-3 border-outline-variant"
                    name="reason"
                    type="radio"
                  />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    Suspicious Pricing
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                  <input
                    defaultChecked
                    className="text-primary focus:ring-primary h-3 w-3 border-outline-variant"
                    name="reason"
                    type="radio"
                  />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    Incomplete Specs
                  </span>
                </label>
              </div>
              <textarea
                className="w-full mt-4 bg-surface-container-lowest border-none rounded-lg text-xs p-4 focus:ring-1 focus:ring-primary/30 h-24"
                placeholder="Optional notes for the seller..."
              ></textarea>
              <button className="w-full mt-4 py-3 bg-error text-on-error font-label text-[10px] uppercase tracking-widest font-bold rounded-lg hover:brightness-110 transition-all">
                Confirm Rejection
              </button>
            </div>

            {/* Inspection Request Box */}
            <div className="col-span-12 lg:col-span-8 bg-secondary-container/30 rounded-xl p-8 flex items-center gap-8 border border-secondary/10">
              <div className="h-20 w-20 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  engineering
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-headline text-xl font-bold text-on-secondary-container uppercase italic">
                  Inspection Pipeline
                </h4>
                <p className="text-sm text-on-secondary-container/70 max-w-lg mt-1">
                  High-value listings over $8,000 can be flagged for physical inspection by our certified Kinetic Technicians before going live.
                </p>
              </div>
              <div className="shrink-0">
                <button className="px-8 py-4 bg-secondary text-on-secondary font-label text-[10px] uppercase tracking-widest font-black rounded-lg hover:shadow-lg transition-all">
                  Assign To Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingModeration;
