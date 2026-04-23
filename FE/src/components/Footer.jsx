import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/10 bg-stone-50">
      <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 w-full max-w-screen-2xl mx-auto font-['Inter'] text-xs uppercase tracking-tighter">
        <div className="flex flex-col gap-2 mb-8 md:mb-0">
          <span className="font-['Space_Grotesk'] text-xl font-black text-orange-700">The Kinetic</span>
          <p className="text-stone-500 normal-case tracking-normal">© 2024 The Kinetic. Precision Velocity Engineering.</p>
        </div>
        <div className="flex gap-12 text-stone-500">
          <Link to="/terms" className="hover:text-orange-600 underline-offset-4 hover:underline transition-opacity">Terms</Link>
          <Link to="/privacy" className="hover:text-orange-600 underline-offset-4 hover:underline transition-opacity">Privacy</Link>
          <Link to="/specs" className="hover:text-orange-600 underline-offset-4 hover:underline transition-opacity">Tech Specs</Link>
          <Link to="/logistics" className="hover:text-orange-600 underline-offset-4 hover:underline transition-opacity">Global Logistics</Link>
        </div>
        <div className="mt-8 md:mt-0 flex gap-4">
          <button className="p-2 bg-stone-200/50 rounded-full hover:bg-orange-100 transition-colors">
            <span className="material-symbols-outlined text-sm">language</span>
          </button>
          <button className="p-2 bg-stone-200/50 rounded-full hover:bg-orange-100 transition-colors">
            <span className="material-symbols-outlined text-sm">currency_exchange</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
