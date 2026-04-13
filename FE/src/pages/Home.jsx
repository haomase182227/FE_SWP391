import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[716px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Hero Bike" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFaYOxBD8H8BWUDNZUu13_LsVCvKnzk78pZFkwSoRALs1v_ZUpNmf87tzBjhYEi51FXC5heEiu3e6H6zIWT2XGL3XW8gNp4YiQq-pK995r-hSbwLSJoCzztBoLuwF9cDVzCpDq80vT1k5vUIf7AyJrNhKOAPCVjv_panzs_Vg2MkB64HPAqlxRKPNUABnSfRyZ09jtYfnT9x9nLREoLYouKRNaxBLI4zpXUbeRDOJX10qHzTsoyLYYDNKz4vttPHDYu3KXTA_OgqJC"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
          <div className="max-w-2xl space-y-8">
            <header className="space-y-2">
              <span className="font-label text-sm uppercase tracking-[0.3em] text-primary font-bold">2024 Collection Now Live</span>
              <h1 className="font-headline text-7xl font-extrabold tracking-tighter leading-none text-on-surface">
                PRECISION<br/><span className="italic text-primary">VELOCITY.</span>
              </h1>
            </header>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              The world's most curated marketplace for high-performance cycling engineering. Every machine is verified, inspected, and ready for the podium.
            </p>
            {/* Search Bar Shell */}
            <div className="flex items-center p-2 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl editorial-shadow max-w-xl group focus-within:ring-2 ring-primary/20 transition-all">
              <div className="flex-1 flex items-center px-4 gap-3">
                <span className="material-symbols-outlined text-primary">search</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body py-3 outline-none" 
                  placeholder="Search by brand, model, or discipline..." 
                  type="text"
                />
              </div>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-headline font-bold uppercase tracking-tight scale-100 hover:scale-[1.02] active:scale-95 transition-all">
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Canvas */}
      <div className="max-w-screen-2xl mx-auto px-8 py-20 flex gap-12">
        {/* Filters (Left Rail) */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-12">
          <div className="space-y-6">
            <h3 className="font-headline text-xl font-bold tracking-tight">Refine Results</h3>
            {/* Category Filter */}
            <div className="space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Discipline</span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Road Performance</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Gravel &amp; Adventure</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Mountain Tech</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Time Trial</span>
                </label>
              </div>
            </div>
            {/* Price Range */}
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Investment Range</span>
              <div className="space-y-4">
                <input className="w-full accent-primary h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer" type="range"/>
                <div className="flex justify-between text-xs font-bold font-headline">
                  <span>$1,500</span>
                  <span>$25,000+</span>
                </div>
              </div>
            </div>
            {/* Brand Filter */}
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Elite Partners</span>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">S-Works</button>
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">Pinarello</button>
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">Canyon</button>
                <button className="py-2 px-3 border border-outline-variant/20 rounded text-[10px] font-bold uppercase hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer">Colnago</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Bike Grid */}
        <div className="flex-1 space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="font-headline text-3xl font-bold tracking-tight">Available Inventory</h2>
              <p className="text-on-surface-variant text-sm">Showing 128 high-performance machines ready for delivery.</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className="text-on-surface-variant">Sort By:</span>
              <button className="flex items-center gap-1 text-primary cursor-pointer">Newest Arrivals <span className="material-symbols-outlined text-sm">expand_more</span></button>
            </div>
          </div>
          
          {/* Bento Grid for Featured/Standard items */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Bike Card 1 (Premium Focus) */}
            <div onClick={() => navigate('/bike/1')} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 editorial-shadow cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  alt="Bike 1" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRkQsMPGOc6gqi3HjMeFMCeAJDh-sz0JfKU80UpWOF9ELAPUWz0-8hTUGPvpKbwvpPLf1jJNQ45tixiDP8FrzzV8RVBUKBdJiYzqEc0i--NKPo2R_cGVelBR_rcIkyF53lR_Z9EMh3kt7w0YRdq50syMPXcVtSN-hGnnRZrqeNIpWDlWQ56kyiA21tiBh0FuSl67dgASYjXcRvLDVw7OjDieOkjiH3l5_--uQ3AR_OyFv89R0how7V7zLx2P8P66VjEWdNVxUNmnu5"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                    Đã kiểm định
                  </span>
                  <span className="bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    Inspected
                  </span>
                </div>
                <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-primary transition-all">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Specialized</span>
                    <span className="font-headline font-bold text-lg text-primary">$12,400</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold tracking-tight">S-Works Tarmac SL8</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Frame</p>
                    <p className="text-xs font-bold">Fact 12r Carbon</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Groupset</p>
                    <p className="text-xs font-bold">Dura-Ace Di2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bike Card 2 */}
            <div className="group relative bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 editorial-shadow cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  alt="Bike 2" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw_lBeAYF9Rl_Bv1bjYgbrsLKNuEo76Yvve-XWw4MLhn1-mBSqXRq_GhUZarPRNT0AcnLGN293DqOLQ9g68Cikba5bAtYFZCdpTO1EI9yc8UyrXVKChoRoaMhqntjcy_TJZbhXXAhDhI6f6G5MBvlkHkhqNd8oYI2FvT2kOjTQoHFx_g0CNNz97HB1emhD3vHIdyhYl8Zw3m7Y4b5utzQ-6YqGaYtjUU2lx779qZ4r-dovDYiRa6Uon9Mzicsy06IarRkNKCz3ho0k"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                    Đã kiểm định
                  </span>
                </div>
                <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-primary transition-all">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Pinarello</span>
                    <span className="font-headline font-bold text-lg text-primary">$14,500</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold tracking-tight">Dogma F Red Etap</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Weight</p>
                    <p className="text-xs font-bold">6.8kg (Size 54)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Wheels</p>
                    <p className="text-xs font-bold">Princeton Peak</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bike Card 3 */}
            <div className="group relative bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 editorial-shadow cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  alt="Bike 3" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJcR1Hm_kuSZEWMwrNCE7xkGc1yzORhldlHpWlzvYBKs01LSyrBA6BvAYH0pXwW18KUOWPB2Mj1wpu884uX0upNGYnXt5IwQjnlNUpfvf45IqL8ImBxVfxQ7iCe4WM_irct13LTouRZjoYt7H5Y3c1CdqcvRBLTF9PaUUT995CTv6r0Z41MURnNlM6DIKZhNMsFhwe9vsS4pOaoRTIkcsvKJP-n4rS4jTYmfkvepwIDQqaG7jXvvvdYhwz7IRGs1N2XygqwDo9lm7l"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    Inspected
                  </span>
                </div>
                <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-primary transition-all">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Canyon</span>
                    <span className="font-headline font-bold text-lg text-primary">$8,200</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold tracking-tight">Grizl CF SLX 8</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Tires</p>
                    <p className="text-xs font-bold">45mm Schwalbe</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Tech</p>
                    <p className="text-xs font-bold">Leaf Spring Seatpost</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bike Card 4 */}
            <div className="group relative bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 editorial-shadow cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  alt="Bike 4" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkPEuDlD9uSzUfxq7KbBcyvDIyGIBisVM0icblsGOYBajh51dJ2PnGKkjkTmL4dyvYwy9zDS5MyYufbTHOIuVg2sxM3FutDrtDNxcs8CPWBYYFHovKsE2xnDkik6qknduczDgPsc2mV3FwrwX9KXu4RrItMMKa_DrTBEgavwYlJrY3MiPmVCbotfJikO13cm9p_8cCQk-sVeVbrdzUYmeJ2vDixRgE_fPnkN59Hr_V9xfaumwl3Mw9B2THriz5jBYFqCISDm3BcYio"
                />
                <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-primary transition-all">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Cannondale</span>
                    <span className="font-headline font-bold text-lg text-primary">$6,800</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold tracking-tight">SuperSix EVO Hi-MOD</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Cockpit</p>
                    <p className="text-xs font-bold">Integrated HollowGram</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Condition</p>
                    <p className="text-xs font-bold text-tertiary">Mint</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination / Load More */}
          <div className="flex justify-center pt-12">
            <button className="flex items-center gap-4 px-12 py-4 border-2 border-primary text-primary font-headline font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
              Load More Machines
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
