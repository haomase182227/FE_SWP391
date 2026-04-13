import React from 'react';
import { Link } from 'react-router-dom';

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(168,49,0,0.04)]">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto font-['Space_Grotesk'] tracking-tight">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold italic tracking-tighter text-orange-700">
            The Kinetic Editorial
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-orange-700 font-bold border-b-2 border-orange-700 transition-colors duration-300">
              Marketplace
            </Link>
            <Link to="/compare" className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-300">
              Compare
            </Link>
            <Link to="/feed" className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-300">
              Feed
            </Link>
            <Link to="/support" className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-300">
              Support
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {/* Wallet Balance Integration */}
          <div className="hidden md:flex flex-col items-end px-4 border-r border-outline-variant/20">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Wallet Balance</span>
            <span className="font-headline font-bold text-secondary">$12,450.00</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="flex items-center gap-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>favorite</span>
              <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Wishlist</span>
            </Link>
            <button className="flex items-center gap-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>receipt_long</span>
              <span className="hidden xl:inline text-xs font-bold uppercase tracking-tighter">Orders</span>
            </button>
            <Link to="/cart" className="p-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>shopping_cart</span>
            </Link>
            <button className="p-2 text-stone-600 hover:text-orange-600 scale-95 active:scale-90 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>notifications</span>
            </button>
            <div className="h-10 w-10 rounded-full bg-surface-container-high border-2 border-primary/10 overflow-hidden">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5MBi-FnDVnn8Cn6I2Vv4fbe7bIcqc1SUlWAi13OL58uUjhMWHO1YmOGjJLCtYgz4LIfQ_pVBuhPfPz9UhMZHuhYjNkEJg9IoUg3aGKzkN6Sldk_304Xovk8-HCdy-4PpA-dOBGIXUJ-o0NWRYnNVf2LI3MsnL_X71pYWdwSzNfrC_pfEfTIX83VJOJg_ZretoolpJH7MofTvfggz3Em1P9uzcDH60WXLdOIPkl4M3DfDDXgelqw8BxHCz9GN7EddpmpqdkgC_RpW"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
