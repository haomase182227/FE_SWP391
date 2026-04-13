import React from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';

export default function AccountSellerManagement() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBh9Q9_fY-ouIys8629M86NNrQJIg92nQPcsJBqsXJZe9JpIhS_4O1BTYPv6fkdx04128V339iWFKnNo_2Qr2SCEeG3KOprb0-a1xryQOoKlWYaroBr_3zxSEq93pDeHfCo5AyQ-ftWamMd7IcvofnitwdqZXx-RAD5G6KMyqeXfLaziiaP1Ig4EEH5mU7CSa1EepNIY7zxxpqShMFh8jA23nv3-zh7sqZpkw48OONfi7nkBORuEiHz0GY2ULX-k-NroVgz4NXuCD3H"
        merchantName="Verified Merchant"
        merchantSub="Profile Settings"
        bottomButton="Create Listing"
        onBottomButtonClick={() => navigate('/seller/listings')}
      />

      <main className="ml-64 min-h-screen p-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Seller Portal</p>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Account</h1>
            <p className="text-on-surface-variant mt-2">Manage your seller profile and preferences.</p>
          </div>

          {/* Profile Card */}
          <div className="bg-surface-container-low rounded-xl p-8 flex items-center gap-8">
            <img
              className="w-20 h-20 rounded-full object-cover"
              alt="Seller Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh9Q9_fY-ouIys8629M86NNrQJIg92nQPcsJBqsXJZe9JpIhS_4O1BTYPv6fkdx04128V339iWFKnNo_2Qr2SCEeG3KOprb0-a1xryQOoKlWYaroBr_3zxSEq93pDeHfCo5AyQ-ftWamMd7IcvofnitwdqZXx-RAD5G6KMyqeXfLaziiaP1Ig4EEH5mU7CSa1EepNIY7zxxpqShMFh8jA23nv3-zh7sqZpkw48OONfi7nkBORuEiHz0GY2ULX-k-NroVgz4NXuCD3H"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold font-headline">Verified Merchant</h2>
              <p className="text-on-surface-variant text-sm mt-1">Elite Seller · Member since 2021</p>
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Sales</p>
                  <p className="text-xl font-bold font-headline text-primary">124</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Rating</p>
                  <p className="text-xl font-bold font-headline text-tertiary">4.9 ★</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Listings</p>
                  <p className="text-xl font-bold font-headline">12</p>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/5 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'directions_bike', label: 'My Listings', to: '/seller/listings' },
              { icon: 'shopping_cart', label: 'Orders', to: '/seller/orders' },
              { icon: 'account_balance_wallet', label: 'Wallet', to: '/seller/wallet' },
              { icon: 'verified', label: 'Inspections', to: '/seller/inspections' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                className="bg-surface-container-lowest rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-primary-container/5 transition-colors group"
              >
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
