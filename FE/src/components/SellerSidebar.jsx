import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Context/AuthContext';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Account', to: '/seller/account' },
  { icon: 'directions_bike', label: 'Listings', to: '/seller/listings' },
  { icon: 'shopping_cart', label: 'Orders', to: '/seller/orders' },
  { icon: 'account_balance_wallet', label: 'Wallet', to: '/seller/wallet' },
  { icon: 'verified', label: 'Inspections', to: '/seller/inspections' },
];

export default function SellerSidebar({ brandName = 'Veloce Kinetic', avatarSrc, avatarAlt = 'Seller Avatar', merchantName = 'Verified Merchant', merchantSub = 'Seller Dashboard', bottomButton, onBottomButtonClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-6 w-64 border-r border-outline-variant/20 bg-surface-container-low z-50">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold tracking-tighter text-primary font-headline">{brandName}</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium mt-1">Verified Merchant</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/seller/listings'}
            className={({ isActive }) => {
              // "Listings" nav item should also be active on /seller/new-listing
              const extraActive = item.to === '/seller/listings' && window.location.pathname === '/seller/new-listing';
              return `flex items-center gap-3 px-6 py-3 transition-all duration-200 text-xs uppercase tracking-tight font-semibold ${
                isActive || extraActive
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-low'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`;
            }}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        {avatarSrc && (
          <div className="p-4 rounded-xl bg-surface-container-high flex items-center gap-3 mb-6">
            <img className="w-10 h-10 rounded-full object-cover" src={avatarSrc} alt={avatarAlt} />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{merchantName}</p>
              <p className="text-[10px] text-on-surface-variant">{merchantSub}</p>
            </div>
          </div>
        )}
        {bottomButton && (
          <button
            onClick={onBottomButtonClick}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary text-xs font-bold uppercase tracking-widest rounded-lg scale-95 active:scale-90 transition-transform"
          >
            {bottomButton}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full mt-3 py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-error hover:bg-error-container/10 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
