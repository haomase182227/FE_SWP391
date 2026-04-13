import React from 'react';

const Wishlist = () => {
  return (
    <div className="bg-background text-on-background min-h-screen font-body antialiased">
      {/* Giả định TopNavBar nằm ở ngoài hoặc gắn vào Layout. 
          Mình thêm padding top để nội dung không bị NavBar đè (nếu có NavBar fix) */}
      <main className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant/20">
          <div>
            <span className="label-md uppercase font-bold text-primary tracking-widest block mb-2">
              Curated Selection
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter font-headline text-on-surface flex items-center gap-4">
              Your Wishlist
              <span className="bg-surface-container-high text-primary text-2xl px-4 py-1 rounded-full font-bold">
                3
              </span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-on-surface-variant font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-on-surface-variant font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">sort</span>
              Sort by Date
            </button>
          </div>
        </header>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {/* Wishlist Item 1 */}
          <div className="group relative bg-surface-container-lowest p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(78,33,32,0.06)] border border-outline-variant/10 flex flex-col">
            <div className="relative aspect-square bg-surface-container rounded-xl overflow-hidden mb-6 shrink-0">
              <img
                alt="S-Works Tarmac SL8"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEoCBMkLlx0Rh-j9KXgXI3MYfs6EOsa8DUQXs7BkcDutZH8C4aRmkH1iWIJYrP4AHPRLautJQeD4Zsmj9Y9GzcQys2bb6pcVkHKJSTkwcnhyCrNkpo8LFkS1FoYTYKtd6ZS3SD6lGinVd91_O9mdivKcCY07xY4W_NyJpsbrSNenZ9J3ekPMs4LcnwMxNRB7HuWC4kmvjnE1sekgJZa1kOZrxg4l4ZsO5Zzfk1nS_g-LZPFFMdngLz9Tu1jnH6velKBitzCnG4F-pO"
              />
              {/* Wishlist Icon Button (Active status) */}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-orange-600 shadow-sm hover:scale-110 active:scale-95 transition-transform">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-surface-container-lowest/90 backdrop-blur rounded-full text-[10px] font-bold text-on-surface uppercase tracking-widest">
                  New Condition
                </span>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold font-headline tracking-tight text-on-surface">
                    S-Works Tarmac SL8
                  </h3>
                </div>
                <span className="text-lg font-black font-headline text-primary tracking-tighter block mb-3">
                  $12,500.00
                </span>
                <div className="flex gap-4 text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest">
                  <span>Size: 56cm</span>
                  <span>•</span>
                  <span>Satin Carbon</span>
                </div>
              </div>
              <button className="w-full py-4 bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-on-primary">
                <span className="material-symbols-outlined text-[16px]">
                  shopping_cart
                </span>
                Add to Cart
              </button>
            </div>
          </div>

          {/* Wishlist Item 2 */}
          <div className="group relative bg-surface-container-lowest p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(78,33,32,0.06)] border border-outline-variant/10 flex flex-col">
            <div className="relative aspect-square bg-surface-container rounded-xl overflow-hidden mb-6 shrink-0">
              <img
                alt="Reserve 52/63 Wheelset"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKj1bMrEkBXQO1vR36lExEfFcrXsTaqretCFHgSlncYJdEZEaFdou-SMsoomGSy9haEhL_iMhTQqhax286P8RDFeQKzMSdPbrU7QbPqJHGZTpt412vLWq0NCmu5-dqn1pKa6e46EbR64W8tf-G6Me6WCM2R0SboKmDEOI9ObPhrHk03sr8264sj4lhDrEM5z4_PYPETGNBX1ETCJmopfn731PbNvEdIDzGiwsv1H2BJLxaRGcM-wkBuZcRahQn7I4cAxTQyKXaK0ym"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-orange-600 shadow-sm hover:scale-110 active:scale-95 transition-transform">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </button>
            </div>
            <div className="flex-grow flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold font-headline tracking-tight text-on-surface">
                    Reserve 52/63 Wheelset
                  </h3>
                </div>
                <span className="text-lg font-black font-headline text-primary tracking-tighter block mb-3">
                  $2,400.00
                </span>
              </div>
              <button className="w-full py-4 bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-on-primary">
                <span className="material-symbols-outlined text-[16px]">
                  shopping_cart
                </span>
                Add to Cart
              </button>
            </div>
          </div>

          {/* Wishlist Item 3 */}
          <div className="group relative bg-surface-container-lowest p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(78,33,32,0.06)] border border-outline-variant/10 flex flex-col">
            <div className="relative aspect-square bg-surface-container rounded-xl overflow-hidden mb-6 shrink-0 opacity-70 grayscale">
              <img
                alt="Cervélo S5 Aero"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCejKHk2lZOfjidTRpC2J7pkLqXutyX0PTTt50wmu0vZNJDpQhD1z3gVBeviyiTLZMV8LGkglDdPVs14WDvfVFXFk0cN7kOkOJhtylgPW8oyAbbX_Xbd7LAuIUXIPxK6W01vdRtb2WoeToAmy2kpCl3dz5ka3Z11zSYlpATABTfAx4t4wEggll1ayfYUlM8tWEvougZ6D038InU_ToO4KRrMt0hr9UVlSYSuNeB8E2Jr7jK0RUtxYmJGkexgVgtBym96AW0cBILU1jm"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-orange-600 shadow-sm hover:scale-110 active:scale-95 transition-transform">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </button>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <span className="px-6 py-2 bg-white text-black font-headline font-black uppercase tracking-widest text-sm -rotate-12 shadow-2xl">
                  SOLD
                </span>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-between space-y-4">
              <div className="opacity-70">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold font-headline tracking-tight text-on-surface">
                    Cervélo S5 Aero
                  </h3>
                </div>
                <span className="text-lg font-black font-headline text-on-surface-variant tracking-tighter block mb-3 line-through">
                  $8,900.00
                </span>
                <p className="text-xs font-bold text-error uppercase tracking-widest">
                  Not Available
                </p>
              </div>
              <button className="w-full py-4 text-error hover:bg-error-container/20 transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 border border-error/20">
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>
                Remove from List
              </button>
            </div>
          </div>

        </div>

        {/* Empty State Template (Hidden by default, used when wishlist is 0) */}
        {/*
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">favorite_border</span>
          </div>
          <h2 className="text-3xl font-bold font-headline tracking-tight mb-4">Your wishlist is empty</h2>
          <p className="text-on-surface-variant max-w-md mb-8">Save your favorite bikes and gear here to keep track of them or buy them later.</p>
          <button className="px-8 py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:opacity-90 transition-opacity">
            Explore Marketplace
          </button>
        </div>
        */}
      </main>
    </div>
  );
};

export default Wishlist;
