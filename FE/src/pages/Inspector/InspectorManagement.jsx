import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const mockBikes = [
  { id: 1, name: 'Trek Domane SL 6', seller: 'Nguyen Van A', location: 'Hanoi', year: 2022, price: '$1,200' },
  { id: 2, name: 'Giant Defy Advanced', seller: 'Tran Thi B', location: 'HCM City', year: 2021, price: '$980' },
  { id: 3, name: 'Specialized Roubaix', seller: 'Le Van C', location: 'Da Nang', year: 2023, price: '$1,500' },
  { id: 4, name: 'Cannondale Synapse', seller: 'Pham Thi D', location: 'Hanoi', year: 2020, price: '$850' },
  { id: 5, name: 'Scott Addict RC', seller: 'Hoang Van E', location: 'HCM City', year: 2022, price: '$2,100' },
];

const CHECKLIST = [
  { id: 'frame', label: 'Khung xe', icon: 'directions_bike', desc: 'Kiểm tra khung, không nứt, không cong vênh' },
  { id: 'brake', label: 'Phanh', icon: 'emergency_home', desc: 'Phanh hoạt động tốt, má phanh còn độ dày' },
  { id: 'drivetrain', label: 'Truyền động', icon: 'settings', desc: 'Xích, líp, đùi đĩa hoạt động trơn tru' },
];

// ── Inspect Modal ──────────────────────────────────────────────────────────────
function InspectModal({ bike, onClose, onResult }) {
  const [checked, setChecked] = useState({ frame: false, brake: false, drivetrain: false });
  const checkedCount = Object.values(checked).filter(Boolean).length;

  function handleInspect() {
    const allPassed = checked.frame && checked.brake && checked.drivetrain;
    onResult(bike.id, allPassed ? 'Inspected' : 'Declined');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-label uppercase text-[10px] tracking-widest text-on-primary/70">Inspection Checklist</p>
            <h3 className="font-headline font-black text-on-primary text-xl mt-0.5">{bike.name}</h3>
          </div>
          <button onClick={onClose} className="text-on-primary/70 hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-6 space-y-3">
          <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant mb-4">Tích vào các mục đã kiểm tra</p>
          {CHECKLIST.map(item => (
            <button key={item.id} onClick={() => setChecked(p => ({ ...p, [item.id]: !p[item.id] }))}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                checked[item.id] ? 'border-tertiary bg-tertiary/10' : 'border-surface-container-high bg-surface-container-low hover:border-outline'
              }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${checked[item.id] ? 'bg-tertiary' : 'bg-surface-container-high'}`}>
                <span className={`material-symbols-outlined text-lg ${checked[item.id] ? 'text-on-tertiary' : 'text-on-surface-variant'}`}
                  style={checked[item.id] ? { fontVariationSettings: '"FILL" 1' } : {}}>
                  {checked[item.id] ? 'check_circle' : item.icon}
                </span>
              </div>
              <div className="flex-1">
                <p className={`font-headline font-bold text-sm ${checked[item.id] ? 'text-tertiary-dim' : 'text-on-surface'}`}>{item.label}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{item.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked[item.id] ? 'bg-tertiary border-tertiary' : 'border-outline'}`}>
                {checked[item.id] && <span className="material-symbols-outlined text-on-tertiary" style={{ fontSize: '14px' }}>check</span>}
              </div>
            </button>
          ))}
        </div>
        <div className="px-6 pb-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
            <span>Tiến độ kiểm tra</span><span>{checkedCount}/3</span>
          </div>
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{ width: `${(checkedCount / 3) * 100}%` }} />
          </div>
        </div>
        <div className="px-6 py-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-outline text-on-surface-variant font-bold uppercase text-[11px] tracking-widest hover:bg-surface-container-low transition-colors">Huỷ</button>
          <button onClick={handleInspect} className="flex-1 py-3 rounded-xl font-bold uppercase text-[11px] tracking-widest bg-primary text-on-primary hover:opacity-90 transition-all">
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">fact_check</span>Inspect
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sign Out Confirm Modal ─────────────────────────────────────────────────────
function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-error text-3xl">logout</span>
          </div>
          <h3 className="font-headline font-black text-on-surface text-xl">Đăng xuất?</h3>
          <p className="text-sm text-on-surface-variant mt-2">Bạn có chắc muốn thoát khỏi Inspector Portal không?</p>
        </div>
        <div className="px-6 py-5 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border-2 border-outline text-on-surface-variant font-bold uppercase text-[11px] tracking-widest hover:bg-surface-container-low transition-colors">Huỷ</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-error text-on-error font-bold uppercase text-[11px] tracking-widest hover:opacity-90 transition-all">Đăng xuất</button>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (!status) return <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pending</span>;
  if (status === 'accepted') return <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-widest">Accepted</span>;
  if (status === 'Inspected') return (
    <span className="px-3 py-1 bg-tertiary/10 text-tertiary-dim rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit">
      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>Inspected
    </span>
  );
  if (status === 'Declined') return (
    <span className="px-3 py-1 bg-error/10 text-error rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit">
      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>cancel</span>Declined
    </span>
  );
}

// ── Action Button ──────────────────────────────────────────────────────────────
function ActionButton({ status, onAccept, onStart }) {
  if (!status) return (
    <button onClick={onAccept} className="px-5 py-2 bg-secondary text-on-secondary hover:opacity-90 transition-opacity uppercase font-bold text-[10px] rounded-lg tracking-widest">Accept</button>
  );
  if (status === 'accepted') return (
    <button onClick={onStart} className="px-5 py-2 bg-primary text-on-primary hover:opacity-90 transition-opacity uppercase font-bold text-[10px] rounded-lg tracking-widest flex items-center gap-1.5">
      <span className="material-symbols-outlined text-sm">play_arrow</span>Start
    </button>
  );
  return <button disabled className="px-5 py-2 bg-surface-container-high text-on-surface-variant uppercase font-bold text-[10px] rounded-lg tracking-widest cursor-not-allowed opacity-50">Done</button>;
}

// ── Bike Table ─────────────────────────────────────────────────────────────────
function BikeTable({ bikes, bikeStatus, onAccept, onStart }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/50">
            <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Bike</th>
            <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Seller</th>
            <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Location</th>
            <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Price</th>
            <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Status</th>
            <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-low">
          {bikes.map(bike => {
            const status = bikeStatus[bike.id];
            return (
              <tr key={bike.id} className="hover:bg-primary-container/5 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">directions_bike</span>
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold text-on-surface">{bike.name}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-widest">{bike.year}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{bike.seller}</td>
                <td className="px-8 py-5 text-sm text-on-surface-variant">{bike.location}</td>
                <td className="px-8 py-5 font-headline font-bold text-on-surface">{bike.price}</td>
                <td className="px-8 py-5"><StatusBadge status={status} /></td>
                <td className="px-8 py-5 text-right">
                  <ActionButton status={status} onAccept={() => onAccept(bike.id)} onStart={() => onStart(bike)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function InspectorManagement() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState('queue'); // 'queue' | 'history' | 'profile'
  const [bikeStatus, setBikeStatus] = useState({});
  const [inspecting, setInspecting] = useState(null);
  const [showSignOut, setShowSignOut] = useState(false);

  function handleAccept(id) { setBikeStatus(prev => ({ ...prev, [id]: 'accepted' })); }
  function handleStart(bike) { setInspecting(bike); }
  function handleResult(id, result) { setBikeStatus(prev => ({ ...prev, [id]: result })); }
  function handleSignOut() { logout(); navigate('/'); }

  const stats = {
    pending: mockBikes.filter(b => !bikeStatus[b.id]).length,
    accepted: mockBikes.filter(b => bikeStatus[b.id] === 'accepted').length,
    inspected: mockBikes.filter(b => bikeStatus[b.id] === 'Inspected').length,
    declined: mockBikes.filter(b => bikeStatus[b.id] === 'Declined').length,
  };

  const historyBikes = mockBikes.filter(b => bikeStatus[b.id] === 'Inspected' || bikeStatus[b.id] === 'Declined');
  const initials = currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'IN';

  const NAV = [
    { id: 'queue', icon: 'fact_check', label: 'Inspection Queue' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'profile', icon: 'person', label: 'My Profile' },
  ];

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 h-full w-64 z-50 bg-zinc-50 flex flex-col py-8 px-4 border-r border-zinc-200/20">
        <div className="mb-10 px-2">
          <h1 className="font-headline text-2xl font-black italic text-primary uppercase leading-none">Kinetic</h1>
          <p className="font-body uppercase tracking-widest text-[10px] text-zinc-400 mt-1">Inspector Portal</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activePage === item.id
                  ? 'bg-orange-50 text-primary font-bold border-r-4 border-primary'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}>
              <span className="material-symbols-outlined text-primary"
                style={activePage === item.id ? { fontVariationSettings: '"FILL" 1' } : {}}>
                {item.icon}
              </span>
              <span className="font-body uppercase tracking-widest text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-zinc-200/20">
          <button onClick={() => setShowSignOut(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-error hover:bg-error-container/10 transition-all rounded-lg">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-body uppercase tracking-widest text-[10px]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <div className="fixed top-0 left-64 right-0 z-40 h-16 bg-surface-container-lowest/80 backdrop-blur border-b border-surface-container-high flex items-center px-8 gap-4">
        <span className="material-symbols-outlined text-on-surface-variant">search</span>
        <input type="text" placeholder="Search bike or seller..."
          className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none" />
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">{initials}</div>
      </div>

      {/* Main Content */}
      <main className="ml-64 pt-24 px-8 pb-12 min-h-screen">

        {/* ── QUEUE PAGE ── */}
        {activePage === 'queue' && (
          <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="uppercase font-bold text-on-surface-variant tracking-widest mb-2 block text-xs">Inspector Workspace</span>
                <h2 className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tighter leading-tight">Inspection<br />Queue.</h2>
              </div>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Pending', value: stats.pending, color: 'text-on-surface' },
                { label: 'Accepted', value: stats.accepted, color: 'text-secondary' },
                { label: 'Inspected', value: stats.inspected, color: 'text-tertiary-dim' },
                { label: 'Declined', value: stats.declined, color: 'text-error' },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-lowest p-5 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
                  <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant">{s.label}</p>
                  <h3 className={`font-headline text-4xl font-bold mt-1 ${s.color}`}>{s.value}</h3>
                </div>
              ))}
            </div>
            <BikeTable bikes={mockBikes} bikeStatus={bikeStatus} onAccept={handleAccept} onStart={handleStart} />
          </>
        )}

        {/* ── HISTORY PAGE ── */}
        {activePage === 'history' && (
          <>
            <header className="mb-10">
              <span className="uppercase font-bold text-on-surface-variant tracking-widest mb-2 block text-xs">Inspector Workspace</span>
              <h2 className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tighter leading-tight">History.</h2>
            </header>
            {historyBikes.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-16 flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">history</span>
                <p className="font-headline font-bold text-on-surface-variant text-lg">Chưa có lịch sử kiểm tra</p>
                <p className="text-sm text-on-surface-variant mt-1">Các xe đã Inspected hoặc Declined sẽ hiện ở đây.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Bike</th>
                      <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Seller</th>
                      <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Location</th>
                      <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Price</th>
                      <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {historyBikes.map(bike => (
                      <tr key={bike.id} className="hover:bg-primary-container/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                              <span className="material-symbols-outlined text-on-surface-variant">directions_bike</span>
                            </div>
                            <div>
                              <p className="font-headline text-sm font-bold text-on-surface">{bike.name}</p>
                              <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-widest">{bike.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{bike.seller}</td>
                        <td className="px-8 py-5 text-sm text-on-surface-variant">{bike.location}</td>
                        <td className="px-8 py-5 font-headline font-bold text-on-surface">{bike.price}</td>
                        <td className="px-8 py-5"><StatusBadge status={bikeStatus[bike.id]} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── PROFILE PAGE ── */}
        {activePage === 'profile' && (
          <>
            <header className="mb-10">
              <span className="uppercase font-bold text-on-surface-variant tracking-widest mb-2 block text-xs">Inspector Workspace</span>
              <h2 className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tighter leading-tight">My Profile.</h2>
            </header>
            <div className="max-w-xl">
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
                {/* Avatar banner */}
                <div className="h-28 bg-gradient-to-r from-primary to-primary-fixed" />
                <div className="px-8 pb-8">
                  <div className="flex items-end gap-5 -mt-10 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary border-4 border-surface-container-lowest flex items-center justify-center text-on-primary font-headline font-black text-2xl shadow-lg">
                      {initials}
                    </div>
                    <div className="pb-1">
                      <p className="font-headline font-black text-on-surface text-xl">{currentUser?.name || '—'}</p>
                      <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-0.5">Inspector</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: 'mail', label: 'Email', value: currentUser?.email || '—' },
                      { icon: 'badge', label: 'Role', value: currentUser?.role || '—' },
                      { icon: 'fact_check', label: 'Đã kiểm tra', value: `${stats.inspected} xe` },
                      { icon: 'cancel', label: 'Đã từ chối', value: `${stats.declined} xe` },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                        <span className="material-symbols-outlined text-primary">{row.icon}</span>
                        <div>
                          <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant">{row.label}</p>
                          <p className="font-headline font-bold text-on-surface text-sm mt-0.5">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Inspect Modal */}
      {inspecting && (
        <InspectModal bike={inspecting} onClose={() => setInspecting(null)} onResult={handleResult} />
      )}

      {/* Sign Out Confirm Modal */}
      {showSignOut && (
        <SignOutModal onConfirm={handleSignOut} onCancel={() => setShowSignOut(false)} />
      )}
    </div>
  );
}
