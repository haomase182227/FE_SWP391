import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import TopNavBar from '../../components/TopNavBar';

const API_BASE = '/api/v1';

export default function Order() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    receivedOrders: 0,
    totalValue: 0,
  });

  const [confirmDialog, setConfirmDialog] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/buyer/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      console.log('[Order] API Response:', data);

      const ordersList = data.orders ?? [];
      setOrders(ordersList);

      setStats({
        totalOrders: data.totalOrders ?? ordersList.length,
        pendingOrders: data.pendingOrders ?? 0,
        cancelledOrders: data.cancelledOrders ?? 0,
        receivedOrders: data.receivedOrders ?? 0,
        totalValue: data.totalValue ?? 0,
      });
    } catch (err) {
      console.error('[Order] Fetch error:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [token, fetchOrders]);

  const handleCompleteOrder = (orderId) => {
    setConfirmDialog({ type: 'complete', orderId });
  };

  const confirmCompleteOrder = async (orderId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (!res.ok) throw new Error('Failed to complete order');

      await fetchOrders();
      setConfirmDialog(null);
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    setConfirmDialog({ type: 'cancel', orderId });
  };

  const confirmCancelOrder = async (orderId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      if (!res.ok) throw new Error('Failed to cancel order');

      await fetchOrders();
      setConfirmDialog(null);
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = activeStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status?.toLowerCase() === activeStatus.toLowerCase());

  if (!token) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Vui lòng đăng nhập để xem đơn hàng.</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700"
          >
            Đăng nhập
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <TopNavBar />
      
      <div className="pt-20">
        <section className="bg-white py-8">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="mb-8">
              <h2 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">ORDERS</h2>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">My Orders</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-error font-bold">{error}</p>
                <button onClick={fetchOrders} className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold">
                  Thử lại
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-surface-container-low rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Orders</p>
                  <p className="font-headline text-3xl font-bold text-on-surface mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Pending</p>
                  <p className="font-headline text-3xl font-bold text-secondary mt-2">{stats.pendingOrders}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Cancelled</p>
                  <p className="font-headline text-3xl font-bold text-error mt-2">{stats.cancelledOrders}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Received</p>
                  <p className="font-headline text-3xl font-bold text-tertiary mt-2">{stats.receivedOrders}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-4 md:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Value</p>
                  <p className="font-headline text-2xl font-bold text-primary mt-2">
                    {stats.totalValue.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {!loading && !error && (
          <div className="max-w-screen-2xl mx-auto px-8 py-8">
            <div className="flex flex-wrap items-center gap-2 mb-8 pb-0 border-b border-outline-variant/20">
              <button
                onClick={() => setActiveStatus('all')}
                className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                  activeStatus === 'all' ? 'text-primary border-b-primary' : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveStatus('pending')}
                className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                  activeStatus === 'pending' ? 'text-secondary border-b-secondary' : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveStatus('completed')}
                className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                  activeStatus === 'completed' ? 'text-tertiary border-b-tertiary' : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveStatus('cancelled')}
                className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                  activeStatus === 'cancelled' ? 'text-error border-b-error' : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                Cancelled
              </button>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderId = order.orderId ?? order.id;
                  const status = order.status?.toLowerCase() ?? '';
                  const canTakeAction = status === 'pending' || status === 'paid';

                  return (
                    <div key={orderId} className="bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-4">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                          {order.imageUrl ? (
                            <img src={order.imageUrl} alt={order.listingTitle} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-2xl text-on-surface-variant/20">directions_bike</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{order.brandName ?? 'BRAND'}</p>
                              <p className="font-bold text-sm text-on-surface line-clamp-2 mt-1">{order.listingTitle ?? 'Product'}</p>
                              <p className="text-xs text-on-surface-variant mt-1">Order #{order.orderCode ?? orderId}</p>
                            </div>
                            <p className="font-headline font-bold text-lg text-primary shrink-0">
                              {(order.price ?? 0).toLocaleString('vi-VN')}₫
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-2">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '—'}</span>
                            {order.dueDate && (
                              <>
                                <span className="mx-1">•</span>
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <span>Due: {new Date(order.dueDate).toLocaleDateString('vi-VN')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                        <div className="flex gap-2 flex-wrap">
                          {status === 'pending' && (
                            <span className="bg-secondary text-on-secondary text-[10px] font-bold uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              Pending
                            </span>
                          )}
                          {status === 'paid' && (
                            <span className="bg-secondary text-on-secondary text-[10px] font-bold uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">payments</span>
                              Paid
                            </span>
                          )}
                          {status === 'completed' && (
                            <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Completed
                            </span>
                          )}
                          {status === 'cancelled' && (
                            <span className="bg-error text-on-error text-[10px] font-bold uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">cancel</span>
                              Cancelled
                            </span>
                          )}
                          
                          {canTakeAction && (
                            <>
                              <button
                                onClick={() => handleCompleteOrder(orderId)}
                                className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase px-3 py-1.5 rounded-full hover:opacity-90 inline-flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Complete
                              </button>
                              <button
                                onClick={() => handleCancelOrder(orderId)}
                                className="bg-error text-on-error text-[10px] font-bold uppercase px-3 py-1.5 rounded-full hover:opacity-90 inline-flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                        
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-on-surface hover:text-primary rounded-lg transition-colors">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-on-surface-variant">No orders found</p>
                <button onClick={() => navigate('/')} className="mt-4 px-6 py-3 bg-primary text-on-primary rounded-lg font-bold">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmDialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4">
            {confirmDialog.type === 'complete' && (
              <>
                <h3 className="font-headline text-lg font-bold">Xác nhận nhận hàng</h3>
                <p className="text-sm text-on-surface-variant">Bạn có chắc chắn đã nhận được hàng chưa?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDialog(null)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2.5 bg-error text-on-error font-bold uppercase text-xs rounded-lg"
                  >
                    Tôi chưa nhận được
                  </button>
                  <button
                    onClick={() => confirmCompleteOrder(confirmDialog.orderId)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2.5 bg-tertiary text-on-tertiary font-bold uppercase text-xs rounded-lg"
                  >
                    {actionLoading ? 'Đang xử lý...' : 'Tôi chắc chắn'}
                  </button>
                </div>
              </>
            )}
            {confirmDialog.type === 'cancel' && (
              <>
                <h3 className="font-headline text-lg font-bold">Xác nhận hoàn hàng</h3>
                <p className="text-sm text-on-surface-variant">Bạn có chắc chắn muốn hoàn hàng không?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDialog(null)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2.5 bg-error text-on-error font-bold uppercase text-xs rounded-lg"
                  >
                    Tôi không hoàn hàng
                  </button>
                  <button
                    onClick={() => confirmCancelOrder(confirmDialog.orderId)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2.5 bg-tertiary text-on-tertiary font-bold uppercase text-xs rounded-lg"
                  >
                    {actionLoading ? 'Đang xử lý...' : 'Tôi chắc chắn'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Order Details</p>
                <h2 className="font-headline text-2xl font-bold mt-1">Order #{selectedOrder.orderId ?? selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</p>
                  <p className="text-base font-bold mt-2 capitalize">{selectedOrder.status ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Price</p>
                  <p className="text-2xl font-bold text-primary mt-2">
                    {(selectedOrder.totalPrice ?? 0).toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Order Date</p>
                  <p className="text-base font-bold mt-2">
                    {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Items</p>
                  <p className="text-base font-bold mt-2">{selectedOrder.items?.length ?? 0} item(s)</p>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Shipping Address</p>
                  <p className="text-sm mt-2">{selectedOrder.shippingAddress}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full px-4 py-2.5 bg-surface-container-high font-bold uppercase rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
