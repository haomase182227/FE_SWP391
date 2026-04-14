import React from 'react';
import TopNavBar from '../../components/TopNavBar';

const Cart = () => {
  return (
    <div className="bg-background text-on-background min-h-screen font-body antialiased">
      {/* TopNavBar */}
      <TopNavBar />

      <main className="pt-20 pb-24 px-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items Section */}
          <div className="lg:col-span-8 space-y-12">
            <header>
              <span className="label-md uppercase font-bold text-primary tracking-widest block mb-2">
                Performance Selection
              </span>
              <h1 className="text-5xl font-bold tracking-tight font-headline">
                Shopping Cart
              </h1>
            </header>
            <div className="space-y-4">
              {/* Cart Item 1 */}
              <div className="group relative bg-surface-container-lowest p-6 rounded-xl transition-all duration-300 hover:bg-primary-container/5">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-48 h-48 bg-surface-container rounded-lg overflow-hidden shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      data-alt="Close-up of a high-end matte black carbon fiber road bike frame with orange technical accents and professional aero wheels"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEoCBMkLlx0Rh-j9KXgXI3MYfs6EOsa8DUQXs7BkcDutZH8C4aRmkH1iWIJYrP4AHPRLautJQeD4Zsmj9Y9GzcQys2bb6pcVkHKJSTkwcnhyCrNkpo8LFkS1FoYTYKtd6ZS3SD6lGinVd91_O9mdivKcCY07xY4W_NyJpsbrSNenZ9J3ekPMs4LcnwMxNRB7HuWC4kmvjnE1sekgJZa1kOZrxg4l4ZsO5Zzfk1nS_g-LZPFFMdngLz9Tu1jnH6velKBitzCnG4F-pO"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold font-headline tracking-tight">
                          S-Works Tarmac SL8
                        </h3>
                        <span className="text-xl font-bold font-headline text-primary">
                          $12,500.00
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase font-bold text-on-surface-variant/60 tracking-wider">
                            Frame Size
                          </span>
                          <span className="font-semibold">56cm (Large)</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs uppercase font-bold text-on-surface-variant/60 tracking-wider">
                            Colorway
                          </span>
                          <span className="font-semibold">Satin Carbon / Jet Black</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 bg-surface-container px-3 py-2 rounded-full">
                        <button className="material-symbols-outlined text-sm hover:text-primary">
                          remove
                        </button>
                        <span className="font-bold text-sm">01</span>
                        <button className="material-symbols-outlined text-sm hover:text-primary">
                          add
                        </button>
                      </div>
                      <button className="text-error font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>{' '}
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Item 2 */}
              <div className="group relative bg-surface-container-lowest p-6 rounded-xl transition-all duration-300 hover:bg-primary-container/5">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-48 h-48 bg-surface-container rounded-lg overflow-hidden shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      data-alt="Minimalist studio shot of premium carbon fiber aerodynamic bicycle wheels with white racing typography on the rims"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKj1bMrEkBXQO1vR36lExEfFcrXsTaqretCFHgSlncYJdEZEaFdou-SMsoomGSy9haEhL_iMhTQqhax286P8RDFeQKzMSdPbrU7QbPqJHGZTpt412vLWq0NCmu5-dqn1pKa6e46EbR64W8tf-G6Me6WCM2R0SboKmDEOI9ObPhrHk03sr8264sj4lhDrEM5z4_PYPETGNBX1ETCJmopfn731PbNvEdIDzGiwsv1H2BJLxaRGcM-wkBuZcRahQn7I4cAxTQyKXaK0ym"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold font-headline tracking-tight">
                          Reserve 52/63 Wheelset
                        </h3>
                        <span className="text-xl font-bold font-headline text-primary">
                          $2,400.00
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase font-bold text-on-surface-variant/60 tracking-wider">
                            Hubset
                          </span>
                          <span className="font-semibold">DT Swiss 180 SINC</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs uppercase font-bold text-on-surface-variant/60 tracking-wider">
                            Freehub
                          </span>
                          <span className="font-semibold">XDR Driver Body</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 bg-surface-container px-3 py-2 rounded-full">
                        <button className="material-symbols-outlined text-sm hover:text-primary">
                          remove
                        </button>
                        <span className="font-bold text-sm">01</span>
                        <button className="material-symbols-outlined text-sm hover:text-primary">
                          add
                        </button>
                      </div>
                      <button className="text-error font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>{' '}
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Section (Using Trust Badge logic) */}
            <div className="bg-surface-container-low p-8 rounded-xl flex items-center gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary text-on-tertiary">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Escrow Protection Active</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Your funds are held securely in the Kinetic Escrow Vault. Payments are only released to the seller once you've confirmed receipt and condition of your performance gear.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)] border border-outline-variant/10">
                <h2 className="text-2xl font-bold font-headline mb-8 uppercase tracking-tight">
                  Order Summary
                </h2>

                {/* Spec-Grid Style Breakdown */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">
                      Subtotal
                    </span>
                    <span className="font-headline font-bold">$14,900.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">
                      Shipping (Express)
                    </span>
                    <span className="font-headline font-bold">$145.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">
                      Escrow Fee (0.5%)
                    </span>
                    <span className="font-headline font-bold">$74.50</span>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="text-lg font-bold font-headline">Total</span>
                    <span className="text-3xl font-bold font-headline text-primary">
                      $15,119.50
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-lg font-bold text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  Proceed to Checkout{' '}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <span className="inline-flex items-center px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    <span
                      className="material-symbols-outlined text-[12px] mr-1"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>{' '}
                    Inspected
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    <span
                      className="material-symbols-outlined text-[12px] mr-1"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      shield
                    </span>{' '}
                    Protected
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="p-6 bg-surface-container rounded-xl">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary">
                    local_shipping
                  </span>
                  <div>
                    <span className="block font-bold text-sm uppercase tracking-wider mb-1">
                      Secure Delivery
                    </span>
                    <p className="text-xs text-on-surface-variant leading-normal">
                      White-glove delivery for all elite bike models. Fully insured and tracked in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Space */}
      <footer className="bg-surface-container-high py-12 px-8 mt-12">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
          <div className="text-xl font-bold tracking-tighter font-headline uppercase">
            KINETIC
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Guarantee</a>
          </div>
          <div className="text-xs">
            © 2024 KINETIC PERFORMANCE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
