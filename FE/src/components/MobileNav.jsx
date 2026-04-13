import React from 'react';
import { Link } from 'react-router-dom';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 flex items-center justify-around z-50">
      <Link to="/" className="flex flex-col items-center gap-1 text-primary">
        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>explore</span>
        <span className="text-[10px] font-bold">Discover</span>
      </Link>
      <Link to="/wishlist" className="flex flex-col items-center gap-1 text-stone-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">favorite</span>
        <span className="text-[10px] font-bold">Saved</span>
      </Link>
      <Link to="/cart" className="flex flex-col items-center gap-1 text-stone-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">receipt_long</span>
        <span className="text-[10px] font-bold">Orders</span>
      </Link>
      <button className="flex flex-col items-center gap-1 text-stone-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </div>
  );
}
