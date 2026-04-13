import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';

const InspectionManagement = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />
      <AdminTopBar title="Inspector Directory" searchPlaceholder="Search Inspector ID or Task..." />

      {/* Main Content Canvas */}
      <main className="ml-64 pt-24 px-8 pb-12 min-h-screen">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="label-md uppercase font-bold text-on-surface-variant tracking-widest mb-2 block">
              Field Operations
            </span>
            <h2 className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tighter leading-tight">
              Inspector<br />Directory.
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-surface-container-low px-6 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">filter_alt</span>
              Filter Area
            </button>
            <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-lg">add</span>
              Onboard Inspector
            </button>
          </div>
        </header>

        {/* Top Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] flex flex-col justify-between h-32">
            <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
              Total Inspectors
            </p>
            <h3 className="font-headline text-4xl font-bold text-on-surface">128</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] flex flex-col justify-between h-32">
            <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
              Active Missions
            </p>
            <h3 className="font-headline text-4xl font-bold text-secondary">34</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] flex flex-col justify-between h-32">
            <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
              Pending Validation
            </p>
            <h3 className="font-headline text-4xl font-bold text-primary">12</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] flex flex-col justify-between h-32 relative overflow-hidden">
            <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant z-10">
              Avg Feedback Score
            </p>
            <h3 className="font-headline text-4xl font-bold text-tertiary z-10">4.9</h3>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-tertiary/10 z-0">
              star
            </span>
          </div>
        </div>

        {/* Directory List / Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                  Inspector Profile
                </th>
                <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                  Coverage Area
                </th>
                <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                  Completed
                </th>
                <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                  Current Status
                </th>
                <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {/* Row 1 */}
              <tr className="hover:bg-primary-container/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600">
                        MR
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold text-on-surface">
                        Marco Rossi
                      </p>
                      <p className="text-[10px] text-primary uppercase font-bold mt-1 tracking-widest">
                        Master Mechanic
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">
                  Milan, Italy (+50km)
                </td>
                <td className="px-8 py-6">
                  <p className="font-headline font-bold text-on-surface text-lg">240</p>
                  <div className="flex text-tertiary text-xs">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Available
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors uppercase font-bold text-[10px] rounded-lg tracking-widest">
                    Assign Task
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-primary-container/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600">
                        JS
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold text-on-surface">
                        James Smith
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1 tracking-widest">
                        Cert. Technician
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">
                  London, UK (+20km)
                </td>
                <td className="px-8 py-6">
                  <p className="font-headline font-bold text-on-surface text-lg">85</p>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-widest">Rating: 4.7</p>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-widest">
                    In Field
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-container transition-colors uppercase font-bold text-[10px] rounded-lg tracking-widest">
                    View Route
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default InspectionManagement;
