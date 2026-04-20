import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/TopNavBar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

export default function Wishlist() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const token = currentUser?.token;

  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState({}); // { [listingId]: bool }

  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/Wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { logout(); navigate('/auth'); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : (data.items ?? data.wishlist ?? data.data ?? []);
      setItems(list);
    } catch (err) {
      console.error('[Wishlist] fetch error:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }
    fetchWishlist();
  }, [fetchWishlist]); // fetchWishlist đã depend on token, không cần thêm token ở đây

  async function handleRemove(listingId) {
    setRemoving(prev => ({ ...prev, [listingId]: true }));
    try {
      const res = await fetch(`${API_BASE}/buyer/Wishlist/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { logout(); navigate('/auth'); return; }
      setItems(prev => prev.filter(i => (i.listingId ?? i.id) !== listingId));
    } catch {
      fetchWishlist();
    } finally {
      setRemoving(prev => ({ ...prev, [listingId]: false }));
    }
  }

  const [addingToCart, setAddingToCart] = useState({}); // { [listingId]: bool }

  async function handleAddToCart(listingId) {
    if (!token) { navigate('/auth'); return; }
    setAddingToCart(prev => ({ ...prev, [listingId]: true }));
    try {
      const res = await fetch(`${API_BASE}/buyer/cart/${listingId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { logout(); navigate('/auth'); return; }
      navigate('/cart');
    } catch {
      navigate('/cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [listingId]: false }));
    }
  }
  function isAvailable(item) {
    const status = (item.status ?? item.listingStatus ?? '').toLowerCase();
    // Available if status is approved, active, or not set
    return status === 'approved' || status === 'active' || status === '' || status === 'available';
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body antialiased">
      <TopNavBar />
      <main className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto">

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant/20">
          <div>
            <span className="label-md uppercase font-bold text-primary tracking-widest block mb-2">
              Curated Selection
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter font-headline text-on-surface flex items-center gap-4">
              Your Wishlist
              <span className="bg-surface-container-high text-primary text-2xl px-4 py-1 rounded-full font-bold">
                {items.length}
              </span>
            </h1>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <span className="material-symbols-outlined animate-spin text-4xl text-on-surface-variant/40">progress_activity</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">favorite_border</span>
            </div>
            <h2 className="text-3xl font-bold font-headline tracking-tight mb-4">Your wishlist is empty</h2>
            <p className="text-on-surface-variant max-w-md mb-8">Save your favorite bikes here to keep track of them or buy them later.</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:opacity-90 transition-opacity"
            >
              Explore Marketplace
            </button>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => {
              const id        = item.listingId ?? item.id;
              const title     = item.title ?? item.listingTitle ?? '—';
              const price     = item.price ?? 0;
              const imgSrc    = item.imageUrl ?? item.primaryImage ?? item.primaryImageUrl ?? null;
              const condition = item.condition ?? '';
              const frameSize = item.frameSize ?? '';
              const available = isAvailable(item);

              return (
                <div
                  key={id}
                  className="group relative bg-surface-container-lowest p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(78,33,32,0.06)] border border-outline-variant/10 flex flex-col"
                >
                  {/* Image */}
                  <div className={`relative aspect-square bg-surface-container rounded-xl overflow-hidden mb-6 shrink-0 ${!available ? 'grayscale opacity-70' : ''}`}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={title}
                        className={`w-full h-full object-cover ${available ? 'group-hover:scale-105 transition-transform duration-700' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                        <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">directions_bike</span>
                      </div>
                    )}

                    {/* Wishlist heart */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-95 transition-transform">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                    </button>

                    {/* Condition badge */}
                    {condition && available && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-surface-container-lowest/90 backdrop-blur rounded-full text-[10px] font-bold text-on-surface uppercase tracking-widest">
                          {condition}
                        </span>
                      </div>
                    )}

                    {/* Sold overlay */}
                    {!available && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="px-6 py-2 bg-white text-black font-headline font-black uppercase tracking-widest text-sm -rotate-12 shadow-2xl">
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow flex flex-col justify-between space-y-4">
                    <div className={!available ? 'opacity-70' : ''}>
                      <h3 className="text-xl font-bold font-headline tracking-tight text-on-surface mb-1">{title}</h3>
                      <span className={`text-lg font-black font-headline tracking-tighter block mb-2 ${available ? 'text-primary' : 'text-on-surface-variant line-through'}`}>
                        {price.toLocaleString('vi-VN')}₫
                      </span>
                      {(frameSize || condition) && available && (
                        <div className="flex gap-3 text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest flex-wrap">
                          {frameSize && <span>Size: {frameSize}</span>}
                          {frameSize && condition && <span>•</span>}
                          {condition && <span>{condition}</span>}
                        </div>
                      )}
                      {!available && (
                        <p className="text-xs font-bold text-error uppercase tracking-widest mt-1">Not Available</p>
                      )}
                    </div>

                    {/* Action button */}
                    {available ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAddToCart(id)}
                          disabled={addingToCart[id]}
                          className="w-full py-4 bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-on-primary disabled:opacity-60"
                        >
                          {addingToCart[id]
                            ? <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                            : <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                          }
                          {addingToCart[id] ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => handleRemove(id)}
                          disabled={removing[id]}
                          className="w-full py-3 text-error hover:bg-error-container/20 transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 border border-error/20 disabled:opacity-50"
                        >
                          {removing[id]
                            ? <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                            : <span className="material-symbols-outlined text-[16px]">delete</span>
                          }
                          {removing[id] ? 'Removing...' : 'Remove from List'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRemove(id)}
                        disabled={removing[id]}
                        className="w-full py-4 text-error hover:bg-error-container/20 transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 border border-error/20 disabled:opacity-50"
                      >
                        {removing[id]
                          ? <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                          : <span className="material-symbols-outlined text-[16px]">delete</span>
                        }
                        {removing[id] ? 'Removing...' : 'Remove from List'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
