import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [userInfo, setUserInfo] = useState({ fullName: '', phone: '', email: '' });
  const [shippingAddress, setShippingAddress] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch user info
  const fetchUserInfo = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/Auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const data = await res.json();
      console.log('[Checkout] User data:', data);
      setUserInfo({
        fullName: data.user?.fullName || data.user?.userName || data.fullName || data.userName || '',
        phone: data.user?.phone || data.phone || '',
        email: data.user?.email || data.email || '',
      });
    } catch (err) {
      console.error('[Checkout] Error fetching user info:', err);
    }
  }, [token]);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : (data.items ?? data.cartItems ?? []));
    } catch (err) {
      console.error('[Checkout] Error fetching cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchUserInfo();
    fetchCart();
  }, [token, fetchUserInfo, fetchCart, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price ?? 0), 0);

  async function handlePlaceOrder() {
    if (!shippingAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/buyer/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: shippingAddress.trim(),
          paymentMethod: 'Wallet',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Đặt hàng thất bại');
      }

      console.log('[Checkout] Order placed successfully');
      // Navigate to orders page
      navigate('/order');
    } catch (err) {
      console.error('[Checkout] Error placing order:', err);
      setError(err.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-background flex flex-col items-center justify-center text-center px-8">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">
          shopping_cart
        </span>
        <p className="font-bold uppercase tracking-widest text-sm text-on-surface-variant mb-6">
          Giỏ hàng trống
        </p>
        <button
          onClick={() => navigate('/cart')}
          className="px-8 py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body antialiased">
      <main className="pt-20 pb-24 px-8 max-w-screen-2xl mx-auto">
        <header className="mb-12">
          <span className="label-md uppercase font-bold text-primary tracking-widest block mb-2">
            Checkout
          </span>
          <h1 className="text-5xl font-bold tracking-tight font-headline">Thanh toán</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Shipping Info */}
          <div className="lg:col-span-7 space-y-8">
            {/* User Information */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <h2 className="text-2xl font-bold font-headline mb-6">Thông tin người nhận</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={userInfo.fullName}
                    readOnly
                    className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-sm border border-outline-variant/20 cursor-not-allowed opacity-75"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={userInfo.phone}
                      readOnly
                      className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-sm border border-outline-variant/20 cursor-not-allowed opacity-75"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      readOnly
                      className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-sm border border-outline-variant/20 cursor-not-allowed opacity-75"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <h2 className="text-2xl font-bold font-headline mb-6">Địa chỉ giao hàng</h2>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  Địa chỉ chi tiết <span className="text-error">*</span>
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    setError('');
                  }}
                  placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
                {error && <p className="text-xs text-error mt-2">{error}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <h2 className="text-2xl font-bold font-headline mb-6">Phương thức thanh toán</h2>
              <div className="flex items-center gap-4 p-4 bg-primary-container/10 border-2 border-primary rounded-lg">
                <input
                  type="radio"
                  id="wallet"
                  name="payment"
                  checked
                  readOnly
                  className="w-5 h-5 text-primary"
                />
                <label htmlFor="wallet" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        account_balance_wallet
                      </span>
                      <div>
                        <p className="font-bold text-sm">Thanh toán bằng số dư Ví</p>
                        <p className="text-xs text-on-surface-variant">Miễn phí giao hàng</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-tertiary bg-tertiary-container px-3 py-1 rounded-full">
                      Miễn phí ship
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                <h2 className="text-2xl font-bold font-headline mb-6 uppercase tracking-tight">
                  Tóm tắt đơn hàng
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {cartItems.map((item) => {
                    const id = item.listingId ?? item.id;
                    const title = item.title ?? item.listingTitle ?? '—';
                    const price = item.price ?? 0;
                    const imgSrc = item.imageUrl ?? item.primaryImage ?? item.primaryImageUrl ?? null;

                    return (
                      <div key={id} className="flex gap-4 pb-4 border-b border-outline-variant/10">
                        <div className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden shrink-0">
                          {imgSrc ? (
                            <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                              <span className="material-symbols-outlined text-2xl text-on-surface-variant/20">
                                directions_bike
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{title}</p>
                          <p className="text-lg font-bold font-headline text-primary mt-1">
                            {price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">
                      Tổng tiền hàng
                    </span>
                    <span className="font-headline font-bold">
                      {subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">
                      Phí vận chuyển
                    </span>
                    <span className="font-headline font-bold text-tertiary">Miễn phí</span>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="text-lg font-bold font-headline">Tổng thanh toán</span>
                    <span className="text-3xl font-bold font-headline text-primary">
                      {subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !shippingAddress.trim()}
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-lg font-bold text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đặt hàng
                      <span className="material-symbols-outlined">check_circle</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <span className="inline-flex items-center px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    <span
                      className="material-symbols-outlined text-[12px] mr-1"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    Inspected
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    <span
                      className="material-symbols-outlined text-[12px] mr-1"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      shield
                    </span>
                    Protected
                  </span>
                </div>
              </div>

              {/* Escrow Info */}
              <div className="bg-surface-container-low p-6 rounded-xl">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-tertiary">verified_user</span>
                  <div>
                    <span className="block font-bold text-sm uppercase tracking-wider mb-1">
                      Escrow Protection
                    </span>
                    <p className="text-xs text-on-surface-variant leading-normal">
                      Tiền của bạn được bảo vệ trong Kinetic Escrow Vault. Thanh toán chỉ được
                      chuyển cho người bán sau khi bạn xác nhận đã nhận hàng.
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
