import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

const NAV_ITEMS = [
  { icon: 'dashboard',              label: 'Dashboard',          to: '/admin/dashboard'    },
  { icon: 'group',                  label: 'User Management',    to: '/admin/users'        },
  { icon: 'rule',                   label: 'Listing Moderation', to: '/admin/listings'     },
  { icon: 'payments',               label: 'Transactions',       to: '/admin/transactions' },
  { icon: 'account_balance_wallet', label: 'Wallet Management',  to: '/admin/wallets'      },
  { icon: 'rate_review',            label: 'Reviews',            to: '/admin/reviews'      },
  { icon: 'engineering',            label: 'Inspectors',         to: '/admin/inspections'  },
  { icon: 'analytics',              label: 'Reports',            to: '/admin/reports'      },
];

export default function AdminSidebar() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  const initials    = (currentUser?.userName || currentUser?.email || 'A')[0].toUpperCase();
  const displayName = currentUser?.userName || 'Admin';

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg,#fff4f3 0%,#fff0ee 60%,#ffecea 100%)',
        borderRight: '1px solid rgba(78,33,32,0.1)',
        boxShadow: '4px 0 32px rgba(78,33,32,0.08)',
      }}
    >
      {/* ── Ambient glow blobs ─────────────────────────── */}
      <div className="absolute top-0 left-0 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(155,58,56,0.1),transparent)', filter: 'blur(40px)', transform: 'translate(-30%,-30%)' }} />
      <div className="absolute bottom-0 right-0 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(231,76,60,0.08),transparent)', filter: 'blur(32px)', transform: 'translate(30%,30%)' }} />
      {/* subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage: 'radial-gradient(circle,rgba(78,33,32,1) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="relative z-10 px-5 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#4e2120,#c0392b)',
              boxShadow: '0 4px 16px rgba(78,33,32,0.45), 0 1px 0 rgba(255,255,255,0.2) inset',
            }}>
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>directions_bike</span>
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 60%)' }} />
          </div>
          <div>
            <h1 className="font-headline text-lg font-black italic uppercase leading-none tracking-tight text-primary"
              style={{ textShadow: '0 1px 8px rgba(78,33,32,0.15)' }}>
              Kinetic Admin
            </h1>
            <p className="uppercase tracking-[0.25em] text-[8px] font-bold mt-0.5 text-on-surface-variant">
              Precision Velocity
            </p>
          </div>
        </div>
        <div className="mt-5 h-px"
          style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.2),rgba(78,33,32,0.05),transparent)' }} />
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="relative z-10 flex-1 px-3 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
            style={({ isActive }) => isActive
              ? {
                  background: 'linear-gradient(135deg,#4e2120,#9b3a38)',
                  boxShadow: '0 4px 18px rgba(78,33,32,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                }
              : {}}
          >
            {({ isActive }) => (
              <>
                {/* shimmer on active */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.07) 50%,transparent 100%)',
                      animation: 'sidebarShimmer 2.5s infinite',
                    }} />
                  </div>
                )}

                {/* left accent */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.7)', boxShadow: '0 0 8px rgba(255,255,255,0.9)' }} />
                )}

                {/* icon box */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${!isActive ? 'group-hover:scale-110' : ''}`}
                  style={isActive
                    ? { background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }
                    : { background: 'rgba(78,33,32,0.06)' }}>
                  <span className="material-symbols-outlined text-[18px] transition-all duration-300"
                    style={{
                      color: isActive ? '#fff' : 'rgba(78,33,32,0.45)',
                      fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
                      filter: isActive ? 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' : 'none',
                    }}>
                    {item.icon}
                  </span>
                </div>

                {/* label */}
                <span className="font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex-1"
                  style={{
                    color: isActive ? '#fff' : 'rgba(78,33,32,0.5)',
                    textShadow: isActive ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                  }}>
                  {item.label}
                </span>

                {isActive && (
                  <span className="material-symbols-outlined text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>chevron_right</span>
                )}

                {/* hover overlay */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'rgba(78,33,32,0.05)', border: '1px solid rgba(78,33,32,0.08)' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom ───────────────────────────────────────── */}
      <div className="relative z-10 px-3 pb-6 pt-4">
        <div className="mb-4 h-px"
          style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.15),rgba(78,33,32,0.04),transparent)' }} />

        {/* User card */}
        {currentUser && (
          <div className="mb-3 p-3 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg,rgba(78,33,32,0.06),rgba(78,33,32,0.03))',
              border: '1px solid rgba(78,33,32,0.1)',
            }}>
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(78,33,32,0.08),transparent)', filter: 'blur(10px)' }} />
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg,#4e2120,#9b3a38)',
                  boxShadow: '0 3px 12px rgba(78,33,32,0.4)',
                }}>
                {initials}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                  style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-black text-on-surface truncate leading-none">{displayName}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] mt-0.5 truncate font-bold text-on-surface-variant">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
          style={{ border: '1px solid rgba(220,38,38,0.15)' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.07)';
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.15)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <span className="material-symbols-outlined text-[18px]"
              style={{ color: '#dc2626', fontVariationSettings: '"FILL" 1', filter: 'drop-shadow(0 0 3px rgba(220,38,38,0.4))' }}>
              logout
            </span>
          </div>
          <span className="font-black uppercase tracking-widest text-[10px]" style={{ color: 'rgba(220,38,38,0.75)' }}>
            Sign Out
          </span>
          <span className="ml-auto material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
            style={{ color: 'rgba(220,38,38,0.5)' }}>
            arrow_forward
          </span>
        </button>
      </div>

      <style>{`
        @keyframes sidebarShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </aside>
  );
}
