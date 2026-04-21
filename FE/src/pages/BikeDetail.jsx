import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

const API_BASE = '/api/v1';

export default function BikeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartDone, setCartDone] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistDone, setWishlistDone] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/listings/${id}`);
        if (!response.ok) throw new Error('Failed to fetch listing');
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  async function addToCart(listingId) {
    if (!token) { navigate('/auth'); return false; }
    setCartLoading(true);
    try {
      await fetch(`${API_BASE}/buyer/cart/${listingId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch {
      return false;
    } finally {
      setCartLoading(false);
    }
  }

  async function handleBuyNow() {
    const ok = await addToCart(id);
    if (ok) navigate('/cart');
  }

  async function handleAddToCart() {
    const ok = await addToCart(id);
    if (ok) setCartDone(true);
  }

  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError]     = useState('');

  async function handleChat() {
    if (!token) { navigate('/auth'); return; }
    // Guard: sellerId phải có
    if (!listing?.sellerId) {
      setChatError('Không tìm thấy thông tin Seller. Vui lòng thử lại.');
      console.error('[handleChat] sellerId is missing. listing:', listing);
      return;
    }
    setChatLoading(true);
    setChatError('');
    try {
      const payload = {
        sellerId: listing.sellerId,
        listingId: Number(id),
        initialMessage: `Tôi quan tâm đến chiếc xe này.`,
      };
      console.log('[handleChat] payload:', payload);

      // Dùng URL trực tiếp để tránh proxy timeout
      const res = await fetch(
        'https://swp391-bike-marketplace-backend-1.onrender.com/api/v1/messaging/conversations',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      console.log('[handleChat] status:', res.status);

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const parsed = await res.json();
          console.error('[handleChat] error body:', parsed);
          msg = parsed?.message ?? parsed?.title ?? parsed?.errors ?? parsed?.error ?? JSON.stringify(parsed);
        } catch { /* ignore parse error */ }
        throw new Error(msg);
      }

      const data = await res.json();
      console.log('[handleChat] response data:', data);

      const convId = data?.conversation?.id
        ?? data?.id
        ?? data?.conversationId
        ?? data?.data?.id
        ?? data?.data?.conversationId;

      if (!convId) throw new Error(`Server trả về: ${JSON.stringify(data)}`);
      navigate(`/chat?conversationId=${convId}`);
    } catch (err) {
      console.error('[handleChat] error:', err.message);
      if (err.message.includes('ERR_CONNECTION') || err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        setChatError('Server đang khởi động, vui lòng thử lại sau 30 giây.');
      } else {
        setChatError(err.message || 'Không thể tạo cuộc trò chuyện. Vui lòng thử lại.');
      }
    } finally {
      setChatLoading(false);
    }
  }
  async function handleAddToWishlist() {
    if (!token) { navigate('/auth'); return; }
    setWishlistLoading(true);
    try {
      await fetch(`${API_BASE}/buyer/Wishlist/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistDone(true);
      navigate('/wishlist');
    } catch {
      // ignore
    } finally {
      setWishlistLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
        <div className="text-center">Listing not found</div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
      {/* Breadcrumb & Title Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Marketplace</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>{listing.technicalSpecs?.Category || 'Category'}</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary">{listing.title}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl font-headline font-bold tracking-tighter text-on-surface">{listing.title}</h1>
          </div>
          <div className="text-right">
            <div className="text-5xl font-headline font-bold text-primary tracking-tight">{(listing.price ?? 0).toLocaleString('vi-VN')}₫</div>
            <div className="flex gap-2 justify-end mt-2">
              {listing.isVerified && (
                <span className="px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span> Verified
                </span>
              )}
              <span className="px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>speed</span> {listing.status || 'Available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Asymmetric Editorial Gallery */}
      <section className="mb-24 space-y-6">
        {/* Main image row */}
        <div className="flex gap-6">
          <div className={`${listing.additionalImages && listing.additionalImages.length > 0 ? 'flex-[2]' : 'w-full'} aspect-[16/9] bg-surface-container-low rounded-xl overflow-hidden relative group cursor-zoom-in`}>
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt={listing.title} 
              src={listing.imageUrl}
            />
            <div className="absolute bottom-6 left-6 flex gap-2">
              <span className="bg-white/90 backdrop-blur-md p-2 rounded-lg editorial-shadow material-symbols-outlined">fullscreen</span>
            </div>
          </div>
          {listing.additionalImages && listing.additionalImages.length > 0 && (
            <div className="flex-1 flex flex-col gap-6">
              {listing.additionalImages.slice(0, 2).map((img, index) => (
                <div key={index} className="flex-1 bg-surface-container-low rounded-xl overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    alt={`Additional image ${index + 1}`} 
                    src={img}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Thumbnail strip — only when there are extra images */}
        {listing.additionalImages && listing.additionalImages.length > 0 && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {listing.additionalImages.map((img, index) => (
              <div key={index} className="flex-none w-40 aspect-square bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  alt={`Thumbnail ${index + 1}`} 
                  src={img}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Details Grid */}
      <div className="grid grid-cols-12 gap-16">
        {/* Left Column: Specs & Inspection */}
        <div className="col-span-12 lg:col-span-8 space-y-24">
          
          {/* Spec Grid Component */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Technical Specifications</h2>
              <div className="h-px bg-outline-variant/20 flex-grow"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
              {listing.technicalSpecs && Object.entries(listing.technicalSpecs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                  <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{key}</span>
                  <span className="text-lg font-headline font-bold text-on-surface">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Description Section */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Description</h2>
              <div className="h-px bg-outline-variant/20 flex-grow"></div>
            </div>
            <p className="text-on-surface leading-relaxed">{listing.description || 'No description available.'}</p>
          </section>

          {/* Inspection Report Section */}
          {listing.inspectionResult && (
          <section className="bg-surface-container-low rounded-xl p-10 editorial-shadow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs font-label text-secondary font-bold uppercase tracking-[0.2em] mb-1">Authentic Performance</div>
                <h2 className="text-3xl font-headline font-bold tracking-tight">Inspection Report</h2>
              </div>
              <div className="text-right">
                {listing.inspectionResult ? (
                  listing.inspectionResult.isPassed ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary text-on-tertiary text-xs font-bold uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>
                      Passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-error text-on-error text-xs font-bold uppercase tracking-widest">
                      Failed
                    </span>
                  )
                ) : (
                  <>
                    <div className="text-3xl font-headline font-bold text-tertiary">N/A</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Pending Inspection</div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-lg p-6 mb-8 border border-secondary/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-none">
                  <img
                    className="w-full h-full object-cover"
                    alt="Inspector placeholder"
                    src="https://via.placeholder.com/48"
                  />
                </div>
                <div>
                  <div className="font-bold text-on-surface">Inspector</div>
                  <div className="text-xs text-on-surface-variant mb-4">Certified Mechanic</div>
                  <p className="text-on-surface leading-relaxed italic">
                    "{listing.inspectionResult?.notes || 'Inspection report will be available soon.'}"
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Frame Checked', value: listing.inspectionResult?.frameChecked },
                { label: 'Brake Checked', value: listing.inspectionResult?.brakeChecked },
                { label: 'Drivetrain Checked', value: listing.inspectionResult?.drivetrainChecked },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/50 p-4 rounded text-center">
                  <span
                    className={`material-symbols-outlined mb-2 ${value ? 'text-tertiary' : 'text-on-surface-variant/40'}`}
                    style={{fontVariationSettings: "'FILL' 1"}}
                  >
                    {value ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</div>
                </div>
              ))}
            </div>
          </section>
          )}
        </div>

        {/* Right Column: Transactions & Seller */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Action Card */}
          <div className="sticky top-28 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 editorial-shadow">
            <div className="space-y-3 mb-8">
              <button
                onClick={handleBuyNow}
                disabled={cartLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-fixed text-on-primary py-5 rounded-lg font-headline font-bold text-xl uppercase tracking-widest scale-[0.98] hover:scale-100 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-60"
              >
                {cartLoading ? 'Đang xử lý...' : 'Mua ngay'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || cartDone}
                  className={`py-4 rounded-lg font-label font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer
                    ${cartDone ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-low text-on-background hover:bg-surface-container-high'}`}
                >
                  <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  {cartDone ? 'Đã thêm' : 'Add to cart'}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading || wishlistDone}
                  className={`py-4 rounded-lg font-label font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer
                    ${wishlistDone ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-low text-on-background hover:bg-surface-container-high'}`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: wishlistDone ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  {wishlistDone ? 'Đã thêm' : 'Wishlist'}
                </button>
              </div>
              <button
                onClick={handleChat}
                disabled={chatLoading}
                className="w-full bg-surface-container-low text-on-background py-4 rounded-lg font-label font-bold text-sm uppercase tracking-wider hover:bg-secondary-container/30 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                {chatLoading
                  ? <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  : <span className="material-symbols-outlined text-lg">chat_bubble</span>
                }
                {chatLoading ? 'Đang kết nối...' : 'Chat với người bán'}
              </button>
              {chatError && (
                <p className="text-xs text-red-500 text-center mt-1 px-2 break-words">{chatError}</p>
              )}
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
                <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">Seller Information</h3>
                <span className="text-[10px] px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full font-bold">SELLER</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">person</span>
                </div>
                <div>
                  <div className="font-headline font-bold text-lg">{listing.sellerName}</div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="text-xs font-bold ml-1 text-on-surface">Rating</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Email:</span>
                  <span className="text-sm font-bold text-on-surface">{listing.sellerEmail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Phone:</span>
                  <span className="text-sm font-bold text-on-surface">{listing.sellerPhone}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
