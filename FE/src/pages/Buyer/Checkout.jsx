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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingFullName, setSavingFullName] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);

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
      setEditFullName(data.user?.fullName || data.user?.userName || data.fullName || data.userName || '');
      setEditPhone(data.user?.phone || data.phone || '');
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

  async function handleBlurFullName() {
    const trimmed = editFullName.trim();
    if (!trimmed || trimmed === userInfo.fullName) return;
    setSavingFullName(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/me/fullname`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newFullName: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại');
      setUserInfo((prev) => ({ ...prev, fullName: data.user?.fullName || trimmed }));
      setEditFullName(data.user?.fullName || trimmed);
    } catch (err) {
      console.error('[Checkout] fullName update failed:', err.message);
    } finally {
      setSavingFullName(false);
    }
  }

  async function handleBlurPhone() {
    const trimmed = editPhone.trim();
    if (!trimmed || trimmed === userInfo.phone) return;
    setSavingPhone(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/me/phone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPhone: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại');
      setUserInfo((prev) => ({ ...prev, phone: data.user?.phone || trimmed }));
      setEditPhone(data.user?.phone || trimmed);
    } catch (err) {
      console.error('[Checkout] phone update failed:', err.message);
    } finally {
      setSavingPhone(false);
    }
  }

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

      const responseData = await res.json();
      console.log('[Checkout] Order placed successfully — full response:', JSON.stringify(responseData, null, 2));
      window.dispatchEvent(new Event('walletUpdated'));

      // Lưu dữ liệu đơn hàng và mở Success Modal thay vì navigate ngay
      const orderCode =
        responseData.orderCode ??
        responseData.order?.orderCode ??
        responseData.data?.orderCode ??
        responseData.orderId ??
        responseData.order?.orderId ??
        responseData.id ??
        null;

      const totalAmount =
        responseData.totalAmount ??
        responseData.order?.totalAmount ??
        responseData.data?.totalAmount ??
        subtotal;

      const resolvedAddress =
        responseData.shippingAddress ??
        responseData.order?.shippingAddress ??
        responseData.data?.shippingAddress ??
        shippingAddress.trim();

      const itemCount =
        responseData.itemCount ??
        responseData.order?.itemCount ??
        responseData.data?.itemCount ??
        cartItems.length;

      setOrderSuccessData({ orderCode, totalAmount, shippingAddress: resolvedAddress, itemCount });
      setIsSuccessModalOpen(true);
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
    <>
    <div className="bg-[#fafaf9] text-gray-900 min-h-screen font-body antialiased">
      <main className="pt-24 pb-32 px-6 md:px-10 max-w-screen-xl mx-auto">
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-orange-600 mb-2">
            Checkout
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-orange-600">Thanh toán</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Shipping Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* User Information */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-xl font-extrabold mb-6 text-orange-600">Thông tin người nhận</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        onBlur={handleBlurFullName}
                        className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                      />
                      {savingFullName && (
                        <span className="material-symbols-outlined animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-base text-orange-600">
                          progress_activity
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
                        Số điện thoại
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          onBlur={handleBlurPhone}
                          className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                        />
                        {savingPhone && (
                          <span className="material-symbols-outlined animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-base text-orange-600">
                            progress_activity
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userInfo.email}
                        readOnly
                        className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm border border-gray-200 cursor-not-allowed opacity-75"
                      />
                    </div>
                  </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-xl font-extrabold mb-6 text-orange-600">Địa chỉ giao hàng</h2>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    setError('');
                  }}
                  placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  rows={3}
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none transition-all"
                />
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-xl font-extrabold mb-6 text-orange-600">Phương thức thanh toán</h2>
              <div className="flex items-center gap-4 p-5 bg-orange-50 border-2 border-orange-500 rounded-xl">
                <input
                  type="radio"
                  id="wallet"
                  name="payment"
                  checked
                  readOnly
                  className="w-5 h-5 text-orange-600"
                />
                <label htmlFor="wallet" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-orange-600 text-2xl">
                        account_balance_wallet
                      </span>
                      <div>
                        <p className="font-bold text-sm text-gray-900">Thanh toán bằng số dư Ví</p>
                        <p className="text-xs text-gray-600">Miễn phí giao hàng</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full">
                      Miễn phí ship
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(249,115,22,0.15)] border border-orange-200">
                <h2 className="text-xl font-extrabold mb-6 uppercase tracking-tight text-orange-900">
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
                      <div key={id} className="flex gap-4 pb-4 border-b border-orange-200">
                        <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-orange-100">
                          {imgSrc ? (
                            <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-50">
                              <span className="material-symbols-outlined text-2xl text-orange-300">
                                directions_bike
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate text-gray-900">{title}</p>
                          <p className="text-lg font-extrabold text-orange-600 mt-1">
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
                    <span className="text-sm font-bold text-orange-700 uppercase tracking-widest">
                      Tổng tiền hàng
                    </span>
                    <span className="font-bold text-orange-900">
                      {subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-orange-700 uppercase tracking-widest">
                      Phí vận chuyển
                    </span>
                    <span className="font-bold text-orange-600">Miễn phí</span>
                  </div>
                  <div className="pt-4 border-t border-orange-200 flex justify-between items-center">
                    <span className="text-lg font-extrabold text-orange-900">Tổng thanh toán</span>
                    <span className="text-3xl font-extrabold text-orange-600">
                      {subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !shippingAddress.trim()}
                  className="w-full bg-orange-600 text-white py-5 rounded-xl font-bold text-sm uppercase tracking-widest 
                             hover:bg-orange-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 
                             disabled:opacity-40 shadow-lg shadow-orange-500/30"
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
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <span className="inline-flex items-center px-3 py-1.5 bg-orange-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span
                      className="material-symbols-outlined text-[12px] mr-1"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    Inspected
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
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
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                  </div>
                  <div>
                    <p className="block font-bold text-sm uppercase tracking-wider mb-1 text-orange-900">
                      Escrow Protection
                    </p>
                    <p className="text-xs text-orange-700 leading-relaxed">
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

    {/* ===== SUCCESS MODAL — ĐẶT HÀNG THÀNH CÔNG ===== */}
    {isSuccessModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center"
          style={{ animation: 'scaleUp 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
        >
          {/* Icon check */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-5xl text-green-600"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                check_circle
              </span>
            </div>
          </div>

          {/* Tiêu đề */}
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">
            Đặt hàng thành công
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            Cảm ơn bạn đã tin tưởng<br />
            <span className="text-orange-600">The Kinetic!</span>
          </h2>

          {/* Bill Summary */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl mt-6 p-5 text-left space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-orange-600 mb-3">
              Chi tiết đơn hàng
            </p>

            {/* Số lượng sản phẩm */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Số sản phẩm</span>
              <span className="font-bold text-sm text-gray-900">
                {orderSuccessData?.itemCount ?? cartItems.length} sản phẩm
              </span>
            </div>

            {/* Phí ship */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Phí vận chuyển</span>
              <span className="font-bold text-sm text-orange-600">Miễn phí</span>
            </div>

            {/* Divider */}
            <div className="border-t border-orange-200 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Tổng thanh toán</span>
              <span className="text-xl font-extrabold text-orange-600">
                {(orderSuccessData?.totalAmount ?? subtotal).toLocaleString('vi-VN')}₫
              </span>
            </div>

            {/* Địa chỉ */}
            {orderSuccessData?.shippingAddress && (
              <div className="pt-2 border-t border-orange-200">
                <p className="text-[10px] uppercase tracking-widest font-bold text-orange-600 mb-1">
                  Giao đến
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {orderSuccessData.shippingAddress}
                </p>
              </div>
            )}
          </div>

          {/* Escrow note */}
          <div className="flex items-start gap-2 mt-4 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg text-left">
            <span className="material-symbols-outlined text-orange-600 text-[18px] shrink-0 mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
            <p className="text-xs text-gray-700 leading-relaxed">
              Tiền của bạn được bảo vệ bởi <strong className="text-gray-900">Kinetic Escrow Vault</strong> — chỉ chuyển cho người bán sau khi bạn xác nhận nhận hàng.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/');
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/order');
              }}
              className="flex-1 px-4 py-3 bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-orange-700 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              Xem đơn hàng
            </button>
          </div>
        </div>

        {/* Keyframe styles */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes scaleUp {
            from { opacity: 0; transform: scale(0.88); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    )}
    </>
  );
}
