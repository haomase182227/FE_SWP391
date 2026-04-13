import React from 'react';
import { Link } from 'react-router-dom';

export default function BikeDetail() {
  return (
    <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
      {/* Breadcrumb & Title Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Marketplace</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>Road Performance</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary">S-Works Tarmac SL8</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl font-headline font-bold tracking-tighter text-on-surface">S-Works Tarmac SL8</h1>
            <p className="text-xl text-on-surface-variant font-light mt-2">Ready to Race · 2024 Ultimate Edition</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-headline font-bold text-primary tracking-tight">$14,500.00</div>
            <div className="flex gap-2 justify-end mt-2">
              <span className="px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span> Verified
              </span>
              <span className="px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>speed</span> Pro Spec
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Asymmetric Editorial Gallery */}
      <section className="grid grid-cols-12 gap-6 mb-24">
        <div className="col-span-12 md:col-span-8 aspect-[16/9] bg-surface-container-low rounded-xl overflow-hidden relative group cursor-zoom-in">
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt="close-up of a high-end carbon fiber road bike with matte black finish and orange accents in a minimalist studio setting" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvqnTyheBvsQyi0Z2fl_XsrHkXPU8oJ1iXSTgecmc8vB3gtAbrQiSqCRgYBmXsBu-tCNCesaGICAxPSeCq1wKI4O8vSH5ABLjgeWafDTyskk6LSKhub31Vh0duJZQa7L8VLgTIRTVcg0zTzeES76Zl8hAO9zotNI9cRENEEBW6EV24MnnmrfYFTygdu6bhnM7D2RPM5DiCoYReDJiKPBO6duNECLESqJaD8YBw-C45so_X0P7dvPSaGYoIFH3wyVbCNMHzyEUrTQW8"
          />
          <div className="absolute bottom-6 left-6 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md p-2 rounded-lg editorial-shadow material-symbols-outlined">fullscreen</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-surface-container-low rounded-xl overflow-hidden aspect-square">
            <img 
              className="w-full h-full object-cover" 
              alt="macro photograph of Shimano Dura-Ace drivetrain with polished metal surfaces and professional studio lighting" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjHKYikOgLK2ecUWGmovZYhsecidU2yUY6f8k5l8ahEHkApogWBIDWOY_02PQ18R1xtvW3hpi2I57sBo1PbIeRI7mUOs2FWyxnCdrLJyiaf1OfS_SCy2e60B9wXRFesAbiAuhikUG1wCL9mGOY6mRyoqW-1QGbcDunXFE8Wowtl3murrmSO8Vu9_j4SNWSMWzD7U-rlsQ4dHVq_fQvFuvl_h2Geg7d8H1Shg-tBIt0JEgHAPs1HNYPbolLee2mg1tsiaCZUTTkIizH"
            />
          </div>
          <div className="bg-surface-container-low rounded-xl overflow-hidden aspect-square">
            <img 
              className="w-full h-full object-cover" 
              alt="detailed view of an aerodynamic carbon handlebar cockpit on a professional road racing bike" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_y6nAk6UcB2mprzwTlt2qvWKPs464Dk04Tb4mDQ8LWQmIxL_bpS_n5ulLqjI-BH0eVE4NxJS4JddnMzsYwizrN4_ZBXEdkpfWXwW7IgKZPV7ftDxG-NuJEKftta84B2uvb8AAV8bp5ahlSjTcdjFQeztksOOB66U8SB3stzQz-AO6_bUAhFM__RRF30HoFekORZatGI8SvFFdG4rCTHSQmaZ_waLUJheMf0-_noACBFur51-II0AfKaKY60AwUUfNgtjGB2PI6tHu"
            />
          </div>
        </div>
        <div className="col-span-12 flex gap-6 overflow-x-auto no-scrollbar pb-4">
          <div className="flex-none w-48 aspect-square bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              alt="side profile of high-profile carbon racing wheels with sleek decals" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5eBbnCczk4FXUVPTsUZf__qVMS517pYFfUYUyN_l5WbsKXvOXHy7tmyYZ0kp_KYBgWkXXMMQ-Q7o8YCgoQlRpph9l8KL_CythvkWeWJtTpDcsiPD_8JVjWX4WHf-_-25C1Ydm4sHCRuBvSXTldM1gh_ElfGv6NZvsaXNbNM7gKKC7sMVd330NURvJ3cJaga5wLdTGjdfaqQ0htHCuLYVNbBq2zlndTvCzrhJVzFPTI6hQmcWVs9CbqSHlpT-uUQhXX5C5YsxTv0Yo"
            />
          </div>
          <div className="flex-none w-48 aspect-square bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              alt="close up of a professional bike saddle with sleek carbon rails" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCJ1Ing6qbktBAd7l4vFocurWtlPuuTFI7u4QTkjfz4Gxe9cNApxmF2pR2epsfMiBPLznOZAKcui8rdMUb7DH6B8ASmtbw96VnYbN5FR1C9xH7gAraMM0pxtvuuVnLj5RVLFgRxUNMibRAN7QzNZAwqfKsyVWaFHnNhSLv9hQ8X-xZWC-zmttPV5-B1FUv4lJfUs9DiU3ZSreyDYTuUBechgqN5daskVabJy_Mz5s_CsruqCqdU5BBeio3lrxkDJu813bYZU2f3ccR"
            />
          </div>
          <div className="flex-none w-48 aspect-square bg-surface-container-lowest rounded-lg border border-outline-variant/10 flex items-center justify-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-primary text-4xl">add</span>
          </div>
        </div>
      </section>

      {/* Product Details Grid */}
      <div className="grid grid-cols-12 gap-16">
        {/* Left Column: Specs & Inspection */}
        <div className="col-span-12 lg:col-span-8 space-y-24">
          
          {/* Spec Grid Component */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Technical Architecture</h2>
              <div className="h-px bg-outline-variant/20 flex-grow"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Frame Material</span>
                <span className="text-lg font-headline font-bold text-on-surface">Fact 12r Carbon</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Brake System</span>
                <span className="text-lg font-headline font-bold text-on-surface">Dura-Ace Hydraulic</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Groupset</span>
                <span className="text-lg font-headline font-bold text-on-surface">Shimano Di2 12-Speed</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Wheelset</span>
                <span className="text-lg font-headline font-bold text-on-surface">Roval Rapide CLX II</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Weight</span>
                <span className="text-lg font-headline font-bold text-on-surface">6.85kg (Size 54)</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Tires</span>
                <span className="text-lg font-headline font-bold text-on-surface">Turbo Cotton 28mm</span>
              </div>
            </div>
          </section>

          {/* Inspection Report Section */}
          <section className="bg-surface-container-low rounded-xl p-10 editorial-shadow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs font-label text-secondary font-bold uppercase tracking-[0.2em] mb-1">Authentic Performance</div>
                <h2 className="text-3xl font-headline font-bold tracking-tight">Inspection Report</h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-headline font-bold text-tertiary">98/100</div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase">Pristine Condition</div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-lg p-6 mb-8 border border-secondary/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-none">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="professional male bike mechanic with focused expression in a workshop" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfYvbxMxwVvFcEZgEebz0IVUgBMDPPHDefAdrVcl-WPj-yMehLt_edeXsHhA6TNQ7C2LvyrFZQF0l7jW837sgF-87oYnO0Gtn_Xdb2tAPByy02xysh06CenbUb5sP5r-rPSc-Qad0ZRyD0kPQraNFFwoj5SCyyDT6ibpIt35ugIciKgSp9AYl-9inGvLqZ6uWHQjTj2WMhymtowTzg1R9Rb6wWKcsP9EaYe2P2BBtX93DN5iDzxuzBypqAaHG-SrCrkNraPuzf1xPw"
                  />
                </div>
                <div>
                  <div className="font-bold text-on-surface">Marcus Chen</div>
                  <div className="text-xs text-on-surface-variant mb-4">Certified Master Mechanic</div>
                  <p className="text-on-surface leading-relaxed italic">
                      "This SL8 is in exceptional condition. Frame ultrasound shows zero anomalies. The Di2 shifting is indexed to factory precision. Brake pad wear is less than 5%. Essentially a showroom floor bike with professional tuning."
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Drivetrain</div>
              </div>
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Structural</div>
              </div>
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Electronics</div>
              </div>
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Wheel Truing</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Transactions & Seller */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Action Card */}
          <div className="sticky top-28 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 editorial-shadow">
            <div className="space-y-4 mb-8">
              <button className="w-full bg-gradient-to-r from-primary to-primary-fixed text-on-primary py-5 rounded-lg font-headline font-bold text-xl uppercase tracking-widest scale-[0.98] hover:scale-100 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer">
                  Đặt cọc / Mua ngay
              </button>
              <button className="w-full bg-surface-container-low text-on-background py-4 rounded-lg font-label font-bold text-sm uppercase tracking-wider hover:bg-secondary-container/30 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-lg">chat_bubble</span> Chat với người bán
              </button>
            </div>
            
            <div className="space-y-6 pt-8 border-t border-outline-variant/10">
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary">security</span>
                <div>
                  <div className="font-bold text-sm">Escrow Protection</div>
                  <div className="text-xs text-on-surface-variant">Funds are held safely until you confirm delivery and condition.</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <div>
                  <div className="font-bold text-sm">Premium Logistics</div>
                  <div className="text-xs text-on-surface-variant">White-glove bike delivery across major metropolitan areas.</div>
                </div>
              </div>
            </div>

            {/* Seller Profile */}
            <div className="mt-12 pt-8 border-t border-outline-variant/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">Curated Seller</h3>
                <span className="text-[10px] px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full font-bold">TOP RATED</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="professional portrait of a man in his 40s wearing cycling apparel" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqxL96s9LADMtGPF_-Tjxpvm56PPJB5st_7T6lHIbJO9iaTlf4QlolQyAPodCdyzRnFJv6wal_vySC-npu_DI9ijdTRYoihoKorcwo0u5y52yTk6Zm8zr_UklZRItJFQQ0Klu0FO3bzTKLupQGTXFXF2744A6Ag6AcSQIbATDMqrG4_2pvlKQlG0XgK3zWrmphqbIAL0pWcE_849XNC7kem6-KHGAeYC4Tp_s-lj4mx6_iku2S4_YqTKE_dbw3pK7qbT1h8JKz9Pbj"
                  />
                </div>
                <div>
                  <div className="font-headline font-bold text-lg">Velocity Vault</div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="text-xs font-bold ml-1 text-on-surface">5.0 (42 sales)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-lg text-center">
                  <div className="text-xl font-headline font-bold">100%</div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-bold">Reputation</div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg text-center">
                  <div className="text-xl font-headline font-bold">3 yrs</div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-bold">Platform age</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
