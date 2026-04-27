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
    <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-6 md:px-8">
      {/* Breadcrumb & Title Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-orange-600 transition-colors">Marketplace</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>{listing.technicalSpecs?.Category || 'Category'}</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-orange-600">{listing.title}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-orange-600 leading-tight">{listing.title}</h1>
          </div>
          <div className="text-left md:text-right">
            <div className="text-2xl md:text-3xl font-extrabold text-orange-600 tracking-tight">{(listing.price ?? 0).toLocaleString('vi-VN')}₫</div>
            <div className="flex gap-2 md:justify-end mt-2">
              {listing.isVerified && (
                <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span> Verified
                </span>
              )}
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>speed</span> {listing.status || 'Available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="mb-12 lg:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Main Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative group">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={listing.title} 
                src={listing.imageUrl}
              />
            </div>
            {/* Thumbnail strip */}
            {listing.additionalImages && listing.additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {listing.additionalImages.slice(0, 4).map((img, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-transparent hover:border-orange-500 transition-colors cursor-pointer">
                    <img 
                      className="w-full h-full object-cover" 
                      alt={`Thumbnail ${index + 1}`} 
                      src={img}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Sticky Action Box */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 md:p-8 border border-orange-200 shadow-xl shadow-orange-500/10">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-orange-200">
                <p className="text-[10px] uppercase tracking-widest font-bold text-orange-600 mb-2">Giá bán</p>
                <div className="text-3xl font-extrabold text-orange-600 tracking-tight">
                  {(listing.price ?? 0).toLocaleString('vi-VN')}₫
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  disabled={cartLoading}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-base uppercase tracking-widest
                             hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/30
                             disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cartLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">shopping_bag</span>
                      Mua ngay
                    </>
                  )}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || cartDone}
                    className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
                      ${cartDone 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50'
                      } disabled:opacity-60`}
                  >
                    <span className="material-symbols-outlined text-lg">shopping_cart</span>
                    {cartDone ? 'Đã thêm' : 'Thêm vào giỏ'}
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading || wishlistDone}
                    className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
                      ${wishlistDone 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50'
                      } disabled:opacity-60`}
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: wishlistDone ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    {wishlistDone ? 'Đã lưu' : 'Yêu thích'}
                  </button>
                </div>

                <button
                  onClick={handleChat}
                  disabled={chatLoading}
                  className="w-full bg-white text-orange-600 border-2 border-orange-200 py-4 rounded-xl font-bold text-sm uppercase tracking-wider
                             hover:bg-orange-50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {chatLoading ? (
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-lg">chat_bubble</span>
                  )}
                  {chatLoading ? 'Đang kết nối...' : 'Chat với người bán'}
                </button>
                {chatError && (
                  <p className="text-xs text-red-600 text-center mt-1 px-2">{chatError}</p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="space-y-4 pt-6 border-t border-orange-200">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-orange-900">Escrow Protection</p>
                    <p className="text-xs text-orange-700 leading-relaxed">Tiền được bảo vệ đến khi bạn nhận hàng</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[18px]">local_shipping</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-orange-900">Giao hàng miễn phí</p>
                    <p className="text-xs text-orange-700 leading-relaxed">Vận chuyển an toàn, bảo hiểm toàn bộ</p>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="mt-6 pt-6 border-t border-orange-200">
                <p className="text-[10px] uppercase tracking-widest font-bold text-orange-600 mb-3">Người bán</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-700 text-xl">person</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{listing.sellerName}</p>
                    <div className="flex items-center gap-1 text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 gap-12">
        {/* Full Width: Specs & Inspection */}
        <div className="space-y-16">
          
          {/* Spec Grid Component */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-orange-600">Thông số kỹ thuật</h2>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listing.technicalSpecs && Object.entries(listing.technicalSpecs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{key}</span>
                  <span className="text-sm font-bold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Description Section */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-orange-600">Mô tả chi tiết</h2>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>
            <p className="text-gray-700 leading-relaxed">{listing.description || 'Chưa có mô tả.'}</p>
          </section>

          {/* Inspection Report Section */}
          {listing.inspectionResult && (
          <section className="bg-orange-50 rounded-2xl p-6 md:p-8 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-orange-600 mb-1">Kiểm định chất lượng</p>
                <h2 className="text-2xl font-bold tracking-tight text-orange-600">Báo cáo kiểm tra</h2>
              </div>
              <div className="text-right">
                {listing.inspectionResult ? (
                  listing.inspectionResult.isPassed ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>
                      Đạt chuẩn
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider">
                      Không đạt
                    </span>
                  )
                ) : (
                  <span className="text-xs font-bold text-gray-500 uppercase">Đang kiểm tra</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 mb-6 border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-none bg-orange-200">
                  <img
                    className="w-full h-full object-cover"
                    alt="Inspector"
                    src="https://via.placeholder.com/48"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Chuyên gia kiểm định</p>
                  <p className="text-xs text-gray-500 mb-3">Certified Mechanic</p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{listing.inspectionResult?.notes || 'Báo cáo kiểm định sẽ sớm được cập nhật.'}"
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Khung xe', value: listing.inspectionResult?.frameChecked },
                { label: 'Phanh', value: listing.inspectionResult?.brakeChecked },
                { label: 'Truyền động', value: listing.inspectionResult?.drivetrainChecked },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white p-4 rounded-xl text-center border border-orange-100">
                  <span
                    className={`material-symbols-outlined mb-2 text-2xl ${value ? 'text-orange-600' : 'text-gray-300'}`}
                    style={{fontVariationSettings: "'FILL' 1"}}
                  >
                    {value ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">{label}</p>
                </div>
              ))}
            </div>
          </section>
          )}
        </div>
      </div>
    </main>
  );
}
