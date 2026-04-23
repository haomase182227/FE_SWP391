import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

const navItems = [
  {
    label: 'Inspection',
    icon: 'search',
    to: '/inspector/management',
  },
  {
    label: 'Quản lý Tố Cáo',
    icon: 'flag',
    to: '/inspector/reports',
  },
];

export default function InspectorSidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col z-40 shadow-sm">
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b border-outline-variant/20">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Inspector</p>
        <h1 className="font-headline text-xl font-black tracking-tighter text-primary uppercase mt-0.5">
          Dashboard
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="px-4 py-4 border-t border-outline-variant/20 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-on-surface truncate">
              {currentUser?.name || currentUser?.email || 'Inspector'}
            </p>
            <p className="text-[10px] text-on-surface-variant">Inspector</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/auth'); }}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-error/10 text-error rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-error hover:text-on-error transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
