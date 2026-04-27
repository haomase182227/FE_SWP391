import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/10 bg-stone-50">
      <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 w-full max-w-screen-2xl mx-auto font-['Inter'] text-xs uppercase tracking-tighter">
        <div className="flex flex-col gap-2 mb-6 md:mb-0">
          <span className="font-['Space_Grotesk'] text-xl font-black text-orange-700">The Kinetic</span>
          <p className="text-stone-500 normal-case tracking-normal">© 2024 The Kinetic. Precision Velocity Engineering.</p>
        </div>
        <div className="flex gap-12 text-stone-500">
          <span className="cursor-default">Terms</span>
          <span className="cursor-default">Privacy</span>
          <span className="cursor-default">Tech Specs</span>
          <span className="cursor-default">Global Logistics</span>
        </div>
      </div>
    </footer>
  );
}
