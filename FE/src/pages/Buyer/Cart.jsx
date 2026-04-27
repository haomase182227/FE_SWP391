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
    <div className="bg-[#fafaf9] text-gray-900 min-h-screen font-body antialiased">
      <TopNavBar />

      <main className="pt-24 pb-32 px-6 md:px-10 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">

          {/* ── LEFT: Cart Items ── */}
          <div className="lg:col-span-8 space-y-10">

            {/* Page Header */}
            <header className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-orange-600">
                Performance Selection
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-orange-600 leading-none">
                Shopping Cart
              </h1>
              {!loading && items.length > 0 && (
                <p className="text-sm text-gray-500 pt-1">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              )}
            </header>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-orange-500">
                  progress_activity
                </span>
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="py-24 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-5xl text-orange-500">
                    shopping_cart
                  </span>
                </div>
                <p className="font-extrabold text-lg text-gray-900 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-400 mb-8">
                  Discover premium bikes waiting for a new rider.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3.5 bg-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl
                             hover:bg-orange-600 active:scale-95 transition-all duration-300 shadow-lg"
                >
                  Explore Marketplace
                </button>
              </div>
            )}

            {/* Item List */}
            {!loading && items.length > 0 && (
              <div className="space-y-4">
                {items.map((item) => {
                  const id        = item.listingId ?? item.id;
                  const title     = item.title ?? item.listingTitle ?? '—';
                  const price     = item.price ?? 0;
                  const imgSrc    = item.imageUrl ?? item.primaryImage ?? item.primaryImageUrl ?? null;
                  const frameSize = item.frameSize ?? '';
                  const condition = item.condition ?? '';

                  return (
                    <div
                      key={id}
                      className="group relative bg-white rounded-2xl border border-gray-100
                                 shadow-[0_4px_20px_rgb(0,0,0,0.04)]
                                 hover:shadow-[0_8px_30px_rgb(0,0,0,0.09)]
                                 hover:-translate-y-0.5
                                 transition-all duration-300 ease-in-out overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="w-full sm:w-52 h-52 bg-white shrink-0 overflow-hidden flex items-center justify-center p-4">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-5xl text-gray-200">
                                directions_bike
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
                          <div className="space-y-4">
                            {/* Title + Price */}
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 leading-snug">
                                {title}
                              </h3>
                              <span className="text-xl md:text-2xl font-extrabold font-headline text-orange-600 shrink-0">
                                {price.toLocaleString('vi-VN')}₫
                              </span>
                            </div>

                            {/* Specs */}
                            {(frameSize || condition) && (
                              <div className="flex flex-wrap gap-2">
                                {frameSize && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-orange-700 uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[13px]">straighten</span>
                                    {frameSize}
                                  </span>
                                )}
                                {condition && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-orange-700 uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[13px]">grade</span>
                                    {condition}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <div className="mt-6 flex items-center justify-end">
                            <button
                              onClick={() => handleRemove(id)}
                              disabled={removing[id]}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                                         text-xs font-bold uppercase tracking-widest text-red-500
                                         border border-red-100 bg-red-50
                                         hover:bg-red-500 hover:text-white hover:border-red-500
                                         active:scale-95 transition-all duration-200
                                         disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {removing[id] ? (
                                <span className="material-symbols-outlined text-sm animate-spin">
                                  progress_activity
                                </span>
                              ) : (
                                <span className="material-symbols-outlined text-sm">delete</span>
                              )}
                              {removing[id] ? 'Removing...' : 'Remove'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Escrow Trust Badge */}
            {!loading && items.length > 0 && (
              <div className="flex items-start gap-5 p-6 bg-orange-50 rounded-2xl border border-orange-200
                              shadow-[0_4px_20px_rgba(249,115,22,0.1)]">
                <div className="w-11 h-11 shrink-0 rounded-full bg-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]"
                        style={{ fontVariationSettings: '"FILL" 1' }}>
                    verified_user
                  </span>
                </div>
                <div>
                  <p className="font-extrabold text-sm text-orange-900 mb-1">Escrow Protection Active</p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Your funds are held securely in the Kinetic Escrow Vault. Payments are only
                    released to the seller once you've confirmed receipt and condition of your
                    performance gear.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200
                              shadow-[0_8px_30px_rgba(249,115,22,0.15)] p-8 space-y-8">

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-orange-500 mb-1">
                    Your Order
                  </p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-orange-900">
                    Order Summary
                  </h2>
                </div>

                {/* Line items */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700 font-medium">
                      Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-bold text-orange-900">
                      {subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700 font-medium">Shipping</span>
                    <span className="text-sm font-bold text-orange-600">Free</span>
                  </div>

                  {/* Divider + Total */}
                  <div className="pt-4 border-t border-orange-200 flex justify-between items-center">
                    <span className="font-extrabold text-orange-900">Total</span>
                    <span className="text-3xl font-extrabold font-headline text-orange-600">
                      {subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  disabled={items.length === 0}
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm
                             uppercase tracking-widest flex items-center justify-center gap-2
                             hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/30
                             transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {/* Trust badges */}
                <div className="flex justify-center gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white
                                   rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[12px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Inspected
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white
                                   rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[12px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                    Protected
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="flex items-start gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-200
                              shadow-[0_4px_20px_rgba(249,115,22,0.1)]">
                <span className="material-symbols-outlined text-orange-600 text-[22px] shrink-0 mt-0.5">
                  local_shipping
                </span>
                <div>
                  <p className="font-bold text-sm text-orange-900 mb-1 uppercase tracking-wide">
                    Secure Delivery
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    White-glove delivery for all elite bike models. Fully insured and tracked in real-time.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
