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

  const initials = (currentUser?.userName || currentUser?.email || 'A')[0].toUpperCase();
  const displayName = currentUser?.userName || 'Admin';

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg,#1a0a08 0%,#2d1210 40%,#1a0a08 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Ambient glow blobs ─────────────────────────── */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(155,58,56,0.25),transparent)', filter: 'blur(40px)', transform: 'translate(-30%,-30%)' }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(78,33,32,0.3),transparent)', filter: 'blur(32px)', transform: 'translate(30%,30%)' }} />
      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="relative z-10 px-5 pt-7 pb-6">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#c0392b,#e74c3c)',
              boxShadow: '0 0 20px rgba(231,76,60,0.6), 0 4px 12px rgba(0,0,0,0.4)',
            }}>
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>directions_bike</span>
            {/* shine */}
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 60%)' }} />
          </div>
          <div>
            <h1 className="font-headline text-lg font-black italic uppercase leading-none tracking-tight"
              style={{ color: '#fff', textShadow: '0 0 20px rgba(231,76,60,0.5)' }}>
              Kinetic Admin
            </h1>
            <p className="uppercase tracking-[0.25em] text-[8px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Precision Velocity
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg,rgba(231,76,60,0.4),rgba(255,255,255,0.05),transparent)' }} />
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
                  background: 'linear-gradient(135deg,rgba(192,57,43,0.9),rgba(231,76,60,0.7))',
                  boxShadow: '0 4px 20px rgba(231,76,60,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                }
              : {}}
          >
            {({ isActive }) => (
              <>
                {/* Active shimmer */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', animation: 'shimmer 2s infinite' }} />
                )}
                {/* Left accent bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(180deg,#fff,rgba(255,255,255,0.4))', boxShadow: '0 0 8px rgba(255,255,255,0.8)' }} />
                )}

                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}
                  style={isActive
                    ? { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }
                    : { background: 'rgba(255,255,255,0.05)' }}>
                  <span
                    className="material-symbols-outlined text-[18px] transition-all duration-300"
                    style={{
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(255,255,255,0.6))' : 'none',
                    }}>
                    {item.icon}
                  </span>
                </div>

                {/* Label */}
                <span
                  className="font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex-1"
                  style={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                    textShadow: isActive ? '0 0 12px rgba(255,255,255,0.4)' : 'none',
                  }}>
                  {item.label}
                </span>

                {/* Arrow */}
                {isActive && (
                  <span className="material-symbols-outlined text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>chevron_right</span>
                )}

                {/* Hover glow */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom section ───────────────────────────────── */}
      <div className="relative z-10 px-3 pb-6 pt-4">
        {/* Separator */}
        <div className="mb-4 h-px" style={{ background: 'linear-gradient(90deg,rgba(231,76,60,0.3),rgba(255,255,255,0.04),transparent)' }} />

        {/* User card */}
        {currentUser && (
          <div className="mb-3 p-3 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}>
            {/* card glow */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(231,76,60,0.2),transparent)', filter: 'blur(12px)' }} />
            <div className="flex items-center gap-3 relative z-10">
              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg,#c0392b,#e74c3c)',
                  boxShadow: '0 0 14px rgba(231,76,60,0.5)',
                }}>
                {initials}
                {/* online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: '#22c55e', borderColor: '#1a0a08', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-black text-white truncate leading-none">{displayName}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] mt-0.5 truncate font-bold"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
          style={{ border: '1px solid rgba(239,68,68,0.2)' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(239,68,68,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Icon box */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <span className="material-symbols-outlined text-[18px] transition-all duration-300"
              style={{ color: '#ef4444', fontVariationSettings: '"FILL" 1', filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.6))' }}>
              logout
            </span>
          </div>

          <span className="font-black uppercase tracking-widest text-[10px] transition-all duration-300"
            style={{ color: 'rgba(239,68,68,0.8)', textShadow: '0 0 8px rgba(239,68,68,0.3)' }}>
            Sign Out
          </span>

          <span className="ml-auto material-symbols-outlined text-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
            style={{ color: 'rgba(239,68,68,0.6)' }}>
            arrow_forward
          </span>
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </aside>
  );
}
