import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/TopNavBar';

export default function Order() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      productName: 'S-Works Tarmac SL8',
      brand: 'Specialized',
      price: 12400,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRkQsMPGOc6gqi3HjMeFMCeAJDh-sz0JfKU80UpWOF9ELAPUWz0-8hTUGPvpKbwvpPLf1jJNQ45tixiDP8FrzzV8RVBUKBdJiYzqEc0i--NKPo2R_cGVelBR_rcIkyF53lR_Z9EMh3kt7w0YRdq50syMPXcVtSN-hGnnRZrqeNIpWDlWQ56kyiA21tiBh0FuSl67dgASYjXcRvLDVw7OjDieOkjiH3l5_--uQ3AR_OyFv89R0how7V7zLx2P8P66VjEWdNVxUNmnu5',
      status: 'accept',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      specifications: {
        frame: 'Fact 12r Carbon',
        groupset: 'Dura-Ace Di2'
      }
    },
    {
      id: 2,
      productName: 'Dogma F Red Etap',
      brand: 'Pinarello',
      price: 14500,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw_lBeAYF9Rl_Bv1bjYgbrsLKNuEo76Yvve-XWw4MLhn1-mBSqXRq_GhUZarPRNT0AcnLGN293DqOLQ9g68Cikba5bAtYFZCdpTO1EI9yc8UyrXVKChoRoaMhqntjcy_TJZbhXXAhDhI6f6G5MBvlkHkhqNd8oYI2FvT2kOjTQoHFx_g0CNNz97HB1emhD3vHIdyhYl8Zw3m7Y4b5utzQ-6YqGaYtjUU2lx779qZ4r-dovDYiRa6Uon9Mzicsy06IarRkNKCz3ho0k',
      status: 'pending',
      orderDate: '2024-01-10',
      deliveryDate: '2024-01-22',
      specifications: {
        weight: '6.8kg (Size 54)',
        wheelset: 'Fulcrum Racing'
      }
    },
    {
      id: 3,
      productName: 'Canyon Aeroad CF SLX',
      brand: 'Canyon',
      price: 9800,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRkQsMPGOc6gqi3HjMeFMCeAJDh-sz0JfKU80UpWOF9ELAPUWz0-8hTUGPvpKbwvpPLf1jJNQ45tixiDP8FrzzV8RVBUKBdJiYzqEc0i--NKPo2R_cGVelBR_rcIkyF53lR_Z9EMh3kt7w0YRdq50syMPXcVtSN-hGnnRZrqeNIpWDlWQ56kyiA21tiBh0FuSl67dgASYjXcRvLDVw7OjDieOkjiH3l5_--uQ3AR_OyFv89R0how7V7zLx2P8P66VjEWdNVxUNmnu5',
      status: 'cancel',
      orderDate: '2024-01-08',
      deliveryDate: null,
      cancelReason: 'Customer request',
      specifications: {
        frame: 'CF SLX Carbon',
        drivetrain: 'SRAM Force AXS'
      }
    },
    {
      id: 4,
      productName: 'Colnago V3RS',
      brand: 'Colnago',
      price: 11200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw_lBeAYF9Rl_Bv1bjYgbrsLKNuEo76Yvve-XWw4MLhn1-mBSqXRq_GhUZarPRNT0AcnLGN293DqOLQ9g68Cikba5bAtYFZCdpTO1EI9yc8UyrXVKChoRoaMhqntjcy_TJZbhXXAhDhI6f6G5MBvlkHkhqNd8oYI2FvT2kOjTQoHFx_g0CNNz97HB1emhD3vHIdyhYl8Zw3m7Y4b5utzQ-6YqGaYtjUU2lx779qZ4r-dovDYiRa6Uon9Mzicsy06IarRkNKCz3ho0k',
      status: 'accept',
      orderDate: '2024-01-12',
      deliveryDate: '2024-01-18',
      specifications: {
        frame: 'Carbon Monocoque',
        wheelset: 'Campagnolo Bora Ultra'
      }
    },
    {
      id: 5,
      productName: 'Trek Madone SLR',
      brand: 'Trek',
      price: 10500,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRkQsMPGOc6gqi3HjMeFMCeAJDh-sz0JfKU80UpWOF9ELAPUWz0-8hTUGPvpKbwvpPLf1jJNQ45tixiDP8FrzzV8RVBUKBdJiYzqEc0i--NKPo2R_cGVelBR_rcIkyF53lR_Z9EMh3kt7w0YRdq50syMPXcVtSN-hGnnRZrqeNIpWDlWQ56kyiA21tiBh0FuSl67dgASYjXcRvLDVw7OjDieOkjiH3l5_--uQ3AR_OyFv89R0how7V7zLx2P8P66VjEWdNVxUNmnu5',
      status: 'pending',
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-24',
      specifications: {
        frame: 'OCLV Carbon',
        groupset: 'Shimano Ultegra Di2'
      }
    },
    {
      id: 6,
      productName: 'Giant TCR Advanced Pro',
      brand: 'Giant',
      price: 8900,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw_lBeAYF9Rl_Bv1bjYgbrsLKNuEo76Yvve-XWw4MLhn1-mBSqXRq_GhUZarPRNT0AcnLGN293DqOLQ9g68Cikba5bAtYFZCdpTO1EI9yc8UyrXVKChoRoaMhqntjcy_TJZbhXXAhDhI6f6G5MBvlkHkhqNd8oYI2FvT2kOjTQoHFx_g0CNNz97HB1emhD3vHIdyhYl8Zw3m7Y4b5utzQ-6YqGaYtjUU2lx779qZ4r-dovDYiRa6Uon9Mzicsy06IarRkNKCz3ho0k',
      status: 'accept',
      orderDate: '2024-01-09',
      deliveryDate: '2024-01-17',
      specifications: {
        frame: 'Advanced-Grade Composite',
        wheelset: 'Project 1'
      }
    }
  ]);

  const [confirmDialog, setConfirmDialog] = useState(null); // { type: 'receive' | 'delete', orderId: number }

  // Handle receive order
  const handleReceiveOrder = (orderId) => {
    setConfirmDialog({ type: 'receive', orderId });
  };

  const confirmReceiveOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'received' } : order
    ));
    setConfirmDialog(null);
  };

  // Handle delete order
  const handleDeleteOrder = (orderId) => {
    setConfirmDialog({ type: 'cancel', orderId });
  };

  const confirmCancelOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'canceled' } : order
    ));
    setConfirmDialog(null);
  };

  const cancelDialog = () => {
    setConfirmDialog(null);
  };

  // Filter orders based on status
  const filteredOrders = activeStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeStatus);

  return (
    <main className="min-h-screen bg-surface">
      <TopNavBar />
      
      <div className="pt-20">
        {/* Header Section */}
        <section className="bg-white py-8">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="mb-8">
              <h2 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">ORDERS</h2>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">My Orders</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Orders</p>
                <p className="font-headline text-3xl font-bold text-on-surface mt-2">{orders.length}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">pending</p>
                <p className="font-headline text-3xl font-bold text-secondary mt-2">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">cancel</p>
                <p className="font-headline text-3xl font-bold text-error mt-2">{orders.filter(o => o.status === 'cancel').length}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">canceled</p>
                <p className="font-headline text-3xl font-bold text-error mt-2">{orders.filter(o => o.status === 'canceled').length}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">received</p>
                <p className="font-headline text-3xl font-bold text-tertiary mt-2">{orders.filter(o => o.status === 'received').length}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Value</p>
                <p className="font-headline text-2xl font-bold text-primary mt-2">
                  ${filteredOrders.reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-0 border-b border-outline-variant/20">
            <button
              onClick={() => setActiveStatus('all')}
              className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                activeStatus === 'all'
                  ? 'text-primary border-b-primary'
                  : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveStatus('pending')}
              className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                activeStatus === 'pending'
                  ? 'text-secondary border-b-secondary'
                  : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
              }`}
            >
              pending
            </button>
            <button
              onClick={() => setActiveStatus('accept')}
              className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                activeStatus === 'accept'
                  ? 'text-tertiary border-b-tertiary'
                  : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
              }`}
            >
              accept
            </button>
            <button
              onClick={() => setActiveStatus('cancel')}
              className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                activeStatus === 'cancel'
                  ? 'text-error border-b-error'
                  : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
              }`}
            >
              cancel
            </button>
            <button
              onClick={() => setActiveStatus('canceled')}
              className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                activeStatus === 'canceled'
                  ? 'text-error border-b-error'
                  : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
              }`}
            >
              canceled
            </button>
            <button
              onClick={() => setActiveStatus('received')}
              className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                activeStatus === 'received'
                  ? 'text-tertiary border-b-tertiary'
                  : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
              }`}
            >
              received
            </button>
          </div>

          {/* Orders Table */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 bg-surface-container-low rounded-lg">
                <div className="col-span-3">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Order Details</p>
                </div>
                <div className="col-span-1">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Price</p>
                </div>
                <div className="col-span-1">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Order Date</p>
                </div>
                <div className="col-span-1 text-right">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Actions</p>
                </div>
              </div>

              {/* Table Rows */}
              {filteredOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className={`hidden md:grid grid-cols-6 gap-4 items-center px-4 py-4 bg-surface-container-lowest border border-outline-variant/10 rounded-lg hover:shadow-md transition-all ${
                      order.status === 'canceled' ? 'opacity-40' : ''
                    }`}
                  >
                    {/* Product Details */}
                    <div className="col-span-3 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                        <img
                          alt={order.productName}
                          className="w-full h-full object-cover"
                          src={order.image}
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{order.brand}</p>
                        <p className="font-bold text-sm text-on-surface truncate">{order.productName}</p>
                        <p className="text-xs text-on-surface-variant">Order #{order.id}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-1">
                      <p className="font-headline font-bold text-lg text-primary">${order.price.toLocaleString()}</p>
                    </div>

                    {/* Order Date */}
                    <div className="col-span-1">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-on-surface">
                          {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </p>
                        {order.deliveryDate && (
                          <p className="text-xs text-on-surface-variant">
                            Due: {new Date(order.deliveryDate).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions - with status buttons */}
                    <div className="col-span-1 flex items-center justify-end gap-2">
                      {order.status === 'pending' && (
                        <span className="bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          pending
                        </span>
                      )}
                      {order.status === 'received' && (
                        <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          received
                        </span>
                      )}
                      {order.status === 'canceled' && (
                        <span className="bg-error text-on-error text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          canceled
                        </span>
                      )}
                      {(order.status === 'cancel' || order.status === 'accept') && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReceiveOrder(order.id)}
                            className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:opacity-90 transition-all active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            accept
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-error text-on-error text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:opacity-90 transition-all active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[14px]">cancel</span>
                            cancel
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                        className="p-2 text-on-surface hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className={`bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-4 space-y-4 transition-all ${
                        order.status === 'canceled' ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                          <img
                            alt={order.productName}
                            className="w-full h-full object-cover"
                            src={order.image}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{order.brand}</p>
                          <p className="font-bold text-sm text-on-surface line-clamp-2">{order.productName}</p>
                          <p className="text-xs text-on-surface-variant mt-1">Order #{order.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <span className="bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              pending
                            </span>
                          )}
                          {order.status === 'received' && (
                            <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              received
                            </span>
                          )}
                          {order.status === 'canceled' && (
                            <span className="bg-error text-on-error text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">cancel</span>
                              canceled
                            </span>
                          )}
                          {(order.status === 'cancel' || order.status === 'accept') && (
                            <>
                              <button
                                onClick={() => handleReceiveOrder(order.id)}
                                className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:opacity-90 transition-all active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                accept
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="bg-error text-on-error text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:opacity-90 transition-all active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                cancel
                              </button>
                            </>
                          )}
                        </div>
                        <p className="font-headline font-bold text-primary">${order.price.toLocaleString()}</p>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/10">
                        <p className="text-xs text-on-surface-variant mb-2">
                          Ordered: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedOrder(order)} className="p-2 text-on-surface hover:text-primary rounded-lg">
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-outline-variant/10">
                <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-bold">1</button>
                {filteredOrders.length > 3 && (
                  <>
                    <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-high font-bold">2</button>
                    <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-high font-bold">3</button>
                  </>
                )}
                <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mt-4 space-y-2">
                <h3 className="font-headline text-2xl font-bold text-on-surface">No Orders Found</h3>
                <p className="text-on-surface-variant">You don't have any orders with this status</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="mt-8 inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-headline font-bold uppercase tracking-tight hover:opacity-95 transition-all"
              >
                Continue Shopping
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 space-y-4 animate-in">
            {confirmDialog.type === 'receive' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-[24px]">check_circle</span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-on-surface">Confirm Receipt</h3>
                </div>

                <p className="text-on-surface-variant text-sm">
                  Are you sure you want to confirm that you have received this order? This action cannot be undone.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelDialog}
                    className="flex-1 px-4 py-2.5 bg-surface-container-high text-on-surface font-bold uppercase tracking-tight rounded-lg hover:bg-surface-container-high/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmReceiveOrder(confirmDialog.orderId)}
                    className="flex-1 px-4 py-2.5 bg-tertiary text-on-tertiary font-bold uppercase tracking-tight rounded-lg hover:opacity-90 transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
            {confirmDialog.type === 'cancel' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-[24px]">cancel</span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-on-surface">Cancel Order</h3>
                </div>

                <p className="text-on-surface-variant text-sm">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelDialog}
                    className="flex-1 px-4 py-2.5 bg-surface-container-high text-on-surface font-bold uppercase tracking-tight rounded-lg hover:bg-surface-container-high/80 transition-all"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={() => confirmCancelOrder(confirmDialog.orderId)}
                    className="flex-1 px-4 py-2.5 bg-error text-on-error font-bold uppercase tracking-tight rounded-lg hover:opacity-90 transition-all"
                  >
                    Cancel Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Order Details</p>
                <h2 className="font-headline text-2xl font-bold text-on-surface mt-1">Order #{selectedOrder.id}</h2>
              </div>
            </div>

            {/* Product Image and Basic Info */}
            <div className="flex gap-6">
              <div className="w-40 h-40 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                <img
                  alt={selectedOrder.productName}
                  className="w-full h-full object-cover"
                  src={selectedOrder.image}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Brand</p>
                  <p className="text-lg font-bold text-on-surface">{selectedOrder.brand}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Product Name</p>
                  <p className="text-lg font-bold text-on-surface">{selectedOrder.productName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Price</p>
                  <p className="text-2xl font-bold text-primary">${selectedOrder.price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant/20"></div>

            {/* Order Status and Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</p>
                <div className="mt-2">
                  {selectedOrder.status === 'pending' && (
                    <span className="bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      pending
                    </span>
                  )}
                  {selectedOrder.status === 'received' && (
                    <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      received
                    </span>
                  )}
                  {selectedOrder.status === 'canceled' && (
                    <span className="bg-error text-on-error text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">cancel</span>
                      canceled
                    </span>
                  )}
                  {(selectedOrder.status === 'cancel' || selectedOrder.status === 'accept') && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          confirmReceiveOrder(selectedOrder.id);
                          setSelectedOrder(null);
                        }}
                        className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:opacity-90 transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        accept
                      </button>
                      <button
                        onClick={() => {
                          confirmCancelOrder(selectedOrder.id);
                          setSelectedOrder(null);
                        }}
                        className="bg-error text-on-error text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:opacity-90 transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[14px]">cancel</span>
                        cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Order Date</p>
                <p className="text-base font-bold text-on-surface mt-2">{new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}</p>
              </div>
              {selectedOrder.deliveryDate && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Delivery Date</p>
                  <p className="text-base font-bold text-on-surface mt-2">{new Date(selectedOrder.deliveryDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}
              {selectedOrder.cancelReason && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Cancel Reason</p>
                  <p className="text-base font-bold text-error mt-2">{selectedOrder.cancelReason}</p>
                </div>
              )}
            </div>

            <div className="border-t border-outline-variant/20"></div>

            {/* Specifications */}
            {selectedOrder.specifications && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Specifications</p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedOrder.specifications).map(([key, value]) => (
                    <div key={key} className="bg-surface-container-low rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{key}</p>
                      <p className="text-sm font-bold text-on-surface mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-4 py-2.5 bg-surface-container-high text-on-surface font-bold uppercase tracking-tight rounded-lg hover:bg-surface-container-high/80 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
