import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/TopNavBar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

export default function Cart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState({}); // { [listingId]: bool }

  const fetchCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(Array.isArray(data) ? data : (data.items ?? data.cartItems ?? []));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }
    fetchCart();
  }, [token, fetchCart, navigate]);

  async function handleRemove(listingId) {
    setRemoving(prev => ({ ...prev, [listingId]: true }));
    try {
      await fetch(`${API_BASE}/buyer/cart/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(prev => prev.filter(i => (i.listingId ?? i.id) !== listingId));
    } catch {
      fetchCart();
    } finally {
      setRemoving(prev => ({ ...prev, [listingId]: false }));
    }
  }

  const subtotal = items.reduce((sum, i) => sum + (i.price ?? 0), 0);

  return (
    <div className="bg-background text-on-background min-h-screen font-body antialiased">
      <TopNavBar />

      <main className="pt-20 pb-24 px-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-12">
            <header>
              <span className="label-md uppercase font-bold text-primary tracking-widest block mb-2">
                Performance Selection
              </span>
              <h1 className="text-5xl font-bold tracking-tight font-headline">
                Shopping Cart
              </h1>
            </header>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-16">
                <span className="material-symbols-outlined animate-spin text-4xl text-on-surface-variant/40">progress_activity</span>
              </div>
            )}

            {/* Empty */}
            {!loading && items.length === 0 && (
              <div className="py-16 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">shopping_cart</span>
                <p className="font-bold uppercase tracking-widest text-sm text-on-surface-variant mb-6">Your cart is empty</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
                >
                  Explore Marketplace
                </button>
              </div>
            )}

            {/* Items */}
            <div className="space-y-4">
              {!loading && items.map((item) => {
                const id       = item.listingId ?? item.id;
                const title    = item.title ?? item.listingTitle ?? '—';
                const price    = item.price ?? 0;
                const imgSrc   = item.imageUrl ?? item.primaryImage ?? item.primaryImageUrl ?? null;
                const frameSize = item.frameSize ?? '';
                const condition = item.condition ?? '';

                return (
                  <div key={id} className="group relative bg-surface-container-lowest p-6 rounded-xl transition-all duration-300 hover:bg-primary-container/5">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Image */}
                      <div className="w-full md:w-48 h-48 bg-surface-container rounded-lg overflow-hidden shrink-0">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">directions_bike</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold font-headline tracking-tight">{title}</h3>
                            <span className="text-xl font-bold font-headline text-primary">
                              {price.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                          {(frameSize || condition) && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              {frameSize && (
                                <div className="flex flex-col">
                                  <span className="text-xs uppercase font-bold text-on-surface-variant/60 tracking-wider">Frame Size</span>
                                  <span className="font-semibold">{frameSize}</span>
                                </div>
                              )}
                              {condition && (
                                <div className="flex flex-col">
                                  <span className="text-xs uppercase font-bold text-on-surface-variant/60 tracking-wider">Condition</span>
                                  <span className="font-semibold">{condition}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Remove */}
                        <div className="mt-6 flex items-center justify-end">
                          <button
                            onClick={() => handleRemove(id)}
                            disabled={removing[id]}
                            className="text-error font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 disabled:opacity-50"
                          >
                            {removing[id]
                              ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                              : <span className="material-symbols-outlined text-sm">delete</span>
                            }
                            {removing[id] ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Escrow trust badge */}
            {!loading && items.length > 0 && (
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
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)] border border-outline-variant/10">
                <h2 className="text-2xl font-bold font-headline mb-8 uppercase tracking-tight">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">Subtotal</span>
                    <span className="font-headline font-bold">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="text-lg font-bold font-headline">Total</span>
                    <span className="text-3xl font-bold font-headline text-primary">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
                <button
                  disabled={items.length === 0}
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-lg font-bold text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                >
                  Proceed to Checkout
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <span className="inline-flex items-center px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[12px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Inspected
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[12px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                    Protected
                  </span>
                </div>
              </div>

              <div className="p-6 bg-surface-container rounded-xl">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary">local_shipping</span>
                  <div>
                    <span className="block font-bold text-sm uppercase tracking-wider mb-1">Secure Delivery</span>
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
    </div>
  );
}
