import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
  { icon: 'group', label: 'User Management', to: '/admin/users' },
  { icon: 'rule', label: 'Listing Moderation', to: '/admin/listings' },
  { icon: 'payments', label: 'Transactions', to: '/admin/transactions' },
  { icon: 'account_balance_wallet', label: 'Wallet Management', to: '/admin/wallets' },
  { icon: 'engineering', label: 'Inspectors', to: '/admin/inspections' },
  { icon: 'analytics', label: 'Reports', to: '/admin/reports' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  return (
    <aside className="fixed left-0 h-full w-64 z-50 bg-zinc-50 flex flex-col py-8 px-4 border-r border-zinc-200/20">
      <div className="mb-10 px-2">
        <h1 className="font-headline text-2xl font-black italic text-primary uppercase leading-none">
          Kinetic Admin
        </h1>
        <p className="font-body uppercase tracking-widest text-[10px] text-zinc-400 mt-1">
          Precision Velocity
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-orange-50 text-primary font-bold border-r-4 border-primary'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-primary"
                  style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-body uppercase tracking-widest text-[10px] font-medium">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <button className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg font-body font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
          Export Global Data
        </button>
        <div className="pt-4 border-t border-zinc-200/20 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-100 transition-all rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">contact_support</span>
            <span className="font-body uppercase tracking-widest text-[10px]">Support</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-error hover:bg-error-container/10 transition-all rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-body uppercase tracking-widest text-[10px]">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
