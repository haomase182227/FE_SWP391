import AdminSidebar from '../../components/AdminSidebar';

const ReportManagement = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      {/* Main Content Canvas */}
      <main className="ml-64 pt-8 px-8 pb-12 min-h-screen">
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
