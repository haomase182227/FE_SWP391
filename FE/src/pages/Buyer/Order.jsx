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

  // STATE CHO LỊCH SỬ ĐÁNH GIÁ
  const [reviewHistory, setReviewHistory] = useState([]);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // STATE CHO TÍNH NĂNG TỐ CÁO (REPORT)
  const [reportHistory, setReportHistory] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reportTypeId: '', title: '', content: '' });
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Hàm helper để hiển thị lỗi
  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // PHẦN 1: STATE CHO TÍNH NĂNG ĐÁNH GIÁ (REFACTORED)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isHistoryWarningModal, setIsHistoryWarningModal] = useState(false);
  const [isReReviewModal, setIsReReviewModal] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewListingId, setReviewListingId] = useState(null);
  const [reviewListingTitle, setReviewListingTitle] = useState('');
  const [reviewItemId, setReviewItemId] = useState(null);
  const [oldReviewData, setOldReviewData] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // STATE CHO ERROR MODAL
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  // HÀM LẤY DỮ LIỆU TỐ CÁO (REPORT TYPES + REPORT HISTORY)
  const fetchReportData = useCallback(async () => {
    if (!token) return;
    try {
      const [typesRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/reports/types`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/reports/my`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (typesRes.ok) {
        const typesData = await typesRes.json();
        const typesList = Array.isArray(typesData) ? typesData : (typesData.reportTypes || typesData.data || []);
        setReportTypes(typesList);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        const historyList = Array.isArray(historyData) ? historyData : (historyData.reports || historyData.data || []);
        setReportHistory(historyList);
      } else if (historyRes.status === 404) {
        setReportHistory([]);
      }
    } catch (err) {
      console.error('[ReportData] Fetch error:', err);
    }
  }, [token]);

  // HÀM LẤY LỊCH SỬ ĐÁNH GIÁ
  const fetchReviewHistory = useCallback(async () => {
    if (!token) return;
    setIsReviewLoading(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/orders/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setReviewHistory([]);
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('[ReviewHistory] API Response:', data);
      
      // API có thể trả về mảng trực tiếp hoặc object chứa mảng
      const reviewList = Array.isArray(data) ? data : (data.reviews || []);
      setReviewHistory(reviewList);
    } catch (err) {
      console.error('[ReviewHistory] Fetch error:', err);
      setReviewHistory([]);
    } finally {
      setIsReviewLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchOrders();
    // Gọi luôn fetchReviewHistory khi load trang để có dữ liệu đếm
    fetchReviewHistory();
    // Gọi fetchReportData để có dữ liệu đối chiếu nút REPORT
    fetchReportData();
  }, [token, fetchOrders, fetchReviewHistory, fetchReportData]);

  // Gọi API lấy lịch sử đánh giá khi chuyển sang tab REVIEWS
  useEffect(() => {
    if (activeStatus === 'reviews' && token) {
      fetchReviewHistory();
    }
    if (activeStatus === 'reports' && token) {
      fetchReportData();
    }
  }, [activeStatus, token, fetchReviewHistory, fetchReportData]);

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
        // BẮT BUỘC truyền Object JSON với field "newStatus":
        body: JSON.stringify({ newStatus: 'Completed' }),
      });

      if (!res.ok) {
        // Lấy lỗi chi tiết từ Server thay vì báo lỗi chung chung
        const errorData = await res.json().catch(() => ({}));
        console.error('Lỗi từ Server:', errorData);
        console.error('Response status:', res.status);
        console.error('Full error:', errorData);
        alert(`Lỗi cập nhật: ${errorData.message || JSON.stringify(errorData.errors) || 'Vui lòng thử lại'}`);
        return;
      }

      // Thành công: Đóng Modal và gọi API lấy lại danh sách đơn hàng
      setConfirmDialog(null);
      await fetchOrders();
    } catch (err) {
      console.error('Lỗi mạng:', err);
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
        // BẮT BUỘC truyền Object JSON với field "newStatus":
        body: JSON.stringify({ newStatus: 'Cancelled' }),
      });

      if (!res.ok) {
        // Lấy lỗi chi tiết từ Server thay vì báo lỗi chung chung
        const errorData = await res.json().catch(() => ({}));
        console.error('Lỗi từ Server:', errorData);
        console.error('Response status:', res.status);
        console.error('Full error:', errorData);
        alert(`Lỗi cập nhật: ${errorData.message || JSON.stringify(errorData.errors) || 'Vui lòng thử lại'}`);
        return;
      }

      // Thành công: Đóng Modal và gọi API lấy lại danh sách đơn hàng
      setConfirmDialog(null);
      await fetchOrders();
    } catch (err) {
      console.error('Lỗi mạng:', err);
      alert(err.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  // PHẦN 3: HÀM XỬ LÝ ĐÁNH GIÁ - REFACTORED CHO TỪNG ITEM
  
  // Xử lý submit đánh giá lần 1 (POST)
  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      setIsReviewModalOpen(false);
      showError("Vui lòng chọn số sao và nhập nội dung đánh giá!");
      return;
    }

    if (!reviewListingId) {
      setIsReviewModalOpen(false);
      showError("Không tìm thấy thông tin sản phẩm");
      return;
    }

    try {
      const requestBody = {
        Items: [{
          ListingId: Number(reviewListingId),
          Rating: Number(rating),
          Comment: comment.trim()
        }]
      };
      
      console.log('[Review] Sending review for orderId:', reviewOrderId, 'listingId:', reviewListingId);
      console.log('[Review] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_BASE}/buyer/orders/${reviewOrderId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Lỗi gửi đánh giá:", errorData);
        setIsReviewModalOpen(false);
        showError(errorData.message || "Không thể gửi đánh giá");
        return;
      }

      // Thành công
      setIsReviewModalOpen(false);
      setRating(5);
      setComment('');
      setReviewListingId(null);
      setReviewListingTitle('');
      
      setSuccessMessage('Đánh giá thành công, cảm ơn bạn!');
      setShowSuccessModal(true);
      
      await fetchReviewHistory();
      fetchOrders();
    } catch (error) {
      console.error("Lỗi mạng:", error);
      setIsReviewModalOpen(false);
      showError('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  // Xử lý submit đánh giá lại (lần 2) - PATCH
  const handleSubmitReReview = async () => {
    if (!rating || !comment.trim()) {
      setIsReReviewModal(false);
      showError("Vui lòng chọn số sao và nhập nội dung đánh giá!");
      return;
    }

    if (!reviewItemId) {
      setIsReReviewModal(false);
      showError("Không tìm thấy ID đánh giá");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/buyer/orders/reviews/${reviewItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Lỗi gửi đánh giá lại:", errorData);
        setIsReReviewModal(false);
        showError(errorData.message || JSON.stringify(errorData.errors) || "Không thể gửi đánh giá lại");
        return;
      }

      // Thành công
      setIsReReviewModal(false);
      setRating(5);
      setComment('');
      setReviewListingId(null);
      setReviewListingTitle('');
      setReviewItemId(null);
      
      setSuccessMessage('Đánh giá thành công, cảm ơn bạn.');
      setShowSuccessModal(true);
      
      await fetchReviewHistory();
      fetchOrders();
    } catch (error) {
      console.error("Lỗi mạng:", error);
      setIsReReviewModal(false);
      showError('Có lỗi xảy ra khi gửi đánh giá lại');
    }
  };

  // Xử lý khi bấm "Tôi chắc chắn" trong HistoryWarningModal
  const handleConfirmReRate = () => {
    setIsHistoryWarningModal(false);
    setRating(5);
    setComment('');
    setIsReReviewModal(true);
  };

  // HÀM SUBMIT TỐ CÁO (POST /api/v1/reports)
  const handleSubmitReport = async () => {
    if (!reportForm.reportTypeId) {
      showError('Vui lòng chọn loại tố cáo!');
      return;
    }
    if (!reportForm.title.trim()) {
      showError('Vui lòng nhập tiêu đề tố cáo!');
      return;
    }
    if (!reportForm.content.trim()) {
      showError('Vui lòng nhập nội dung tố cáo!');
      return;
    }

    setIsReportLoading(true);
    try {
      const payload = {
        reportedUserId: selectedReportOrder.sellerId,
        reportTypeId: Number(reportForm.reportTypeId),
        title: reportForm.title.trim(),
        content: reportForm.content.trim(),
        orderId: selectedReportOrder.orderId,
      };

      console.log('[Report] Submitting report:', payload);

      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('[Report] Submit error:', errorData);
        setIsReportModalOpen(false);
        showError(errorData.message || 'Không thể gửi tố cáo. Vui lòng thử lại!');
        return;
      }

      // Thành công
      setIsReportModalOpen(false);
      setReportForm({ reportTypeId: '', title: '', content: '' });
      setSelectedReportOrder(null);
      setSuccessMessage('Báo cáo thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.');
      setShowSuccessModal(true);
      await fetchReportData();
    } catch (err) {
      console.error('[Report] Network error:', err);
      setIsReportModalOpen(false);
      showError('Có lỗi xảy ra khi gửi tố cáo. Vui lòng thử lại!');
    } finally {
      setIsReportLoading(false);
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
              <button
                onClick={() => setActiveStatus('reviews')}
                className={`ml-auto px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                  activeStatus === 'reviews' ? 'text-purple-600 border-b-purple-600' : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">rate_review</span>
                  Reviews
                </span>
              </button>
              <button
                onClick={() => setActiveStatus('reports')}
                className={`px-4 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 ${
                  activeStatus === 'reports' ? 'text-red-600 border-b-red-600' : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  Reports
                </span>
              </button>
            </div>

            {activeStatus === 'reports' ? (
              // HIỂN THỊ LỊCH SỬ TỐ CÁO
              reportHistory.length > 0 ? (
                <div className="space-y-4">
                  {reportHistory.map((report) => {
                    const reportId = report.reportId || report.id;
                    const createdDate = report.createdAt ? new Date(report.createdAt).toLocaleDateString('vi-VN') : '—';
                    const statusMap = {
                      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                      underreview: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                      resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                      dismissed: { label: 'Dismissed', color: 'bg-red-100 text-red-700 border-red-200' },
                    };
                    const statusKey = (report.status || 'pending').toLowerCase().replace(/\s/g, '');
                    const statusInfo = statusMap[statusKey] || { label: report.status || 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };

                    return (
                      <div key={reportId} className="bg-white border border-outline-variant/20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-on-surface mb-1">{report.title || 'Báo cáo'}</h3>
                            <p className="text-sm text-on-surface-variant">
                              Loại tố cáo: <span className="font-medium">{report.reportTypeName || report.reportType || 'N/A'}</span>
                            </p>
                            <p className="text-sm text-on-surface-variant mt-1">
                              Người bị tố cáo: <span className="font-medium">{report.reportedUserName || report.reportedUser || 'N/A'}</span>
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                            <p className="text-xs text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              {createdDate}
                            </p>
                          </div>
                        </div>

                        {report.content && (
                          <div className="bg-surface-container-lowest rounded-lg p-4 border-l-4 border-red-400 mt-3">
                            <p className="text-sm text-on-surface leading-relaxed">{report.content}</p>
                          </div>
                        )}

                        {report.orderId && (
                          <div className="mt-3 pt-3 border-t border-outline-variant/10">
                            <p className="text-xs text-on-surface-variant">
                              Đơn hàng: <span className="font-mono font-medium">#{report.orderId}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-red-500">flag</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-lg font-medium">Bạn chưa có báo cáo nào.</p>
                  <p className="text-on-surface-variant text-sm mt-2">Các tố cáo người bán sẽ xuất hiện ở đây.</p>
                </div>
              )
            ) : activeStatus === 'reviews' ? (
              // HIỂN THỊ LỊCH SỬ ĐÁNH GIÁ
              isReviewLoading ? (
                <div className="flex justify-center py-12">
                  <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                </div>
              ) : reviewHistory.length > 0 ? (
                <div className="space-y-4">
                  {reviewHistory.map((review) => {
                    const reviewId = review.reviewItemId || review.id;
                    const createdDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : '—';
                    
                    return (
                      <div key={reviewId} className="bg-white border border-outline-variant/20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-on-surface mb-1">{review.listingTitle || 'Sản phẩm'}</h3>
                            <p className="text-sm text-on-surface-variant">
                              Người bán: <span className="font-medium">{review.sellerName || 'N/A'}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              {createdDate}
                            </p>
                          </div>
                        </div>

                        {/* Hiển thị Rating (Sao) */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star}
                                className={`material-symbols-outlined text-2xl ${
                                  star <= (review.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                                style={{ fontVariationSettings: star <= (review.rating || 0) ? '"FILL" 1' : '"FILL" 0' }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-lg font-bold text-on-surface">{review.rating || 0}/5</span>
                        </div>

                        {/* Hiển thị Comment */}
                        <div className="bg-surface-container-lowest rounded-lg p-4 border-l-4 border-purple-500">
                          <p className="text-sm text-on-surface leading-relaxed">
                            {review.comment || 'Không có nội dung đánh giá.'}
                          </p>
                        </div>

                        {/* Thông tin bổ sung nếu có */}
                        {review.orderId && (
                          <div className="mt-3 pt-3 border-t border-outline-variant/10">
                            <p className="text-xs text-on-surface-variant">
                              Đơn hàng: <span className="font-mono font-medium">#{review.orderId}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-purple-600">rate_review</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-lg font-medium">Bạn chưa có đánh giá nào.</p>
                  <p className="text-on-surface-variant text-sm mt-2">Hãy hoàn thành đơn hàng và đánh giá sản phẩm!</p>
                </div>
              )
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const orderId = order.orderId ?? order.id;
                  const status = order.status?.toLowerCase() ?? '';
                  const canTakeAction = status === 'pending' || status === 'paid';
                  const isCompleted = status === 'completed';
                  
                  // Lấy danh sách items từ order (API mới trả về mảng items)
                  const orderItems = order.items || [];

                  return (
                    <div key={orderId} className="bg-white border border-outline-variant/20 rounded-xl p-6 shadow-sm">
                      {/* HEADER ĐƠN HÀNG */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/10">
                        <div>
                          <p className="text-xs text-on-surface-variant">Order #{order.orderCode ?? orderId}</p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            <span className="material-symbols-outlined text-[14px] align-middle">calendar_today</span>
                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '—'}
                          </p>
                        </div>
                        
                        {/* Trạng thái đơn hàng */}
                        <div className="flex items-center gap-2">
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
                        </div>
                      </div>

                      {/* VÒNG LẶP ITEMS - HIỂN THỊ TỪNG SẢN PHẨM TRONG ĐƠN HÀNG */}
                      <div className="space-y-4">
                        {orderItems.length > 0 ? orderItems.map((item, itemIndex) => {
                          const itemListingId = item.listingId;
                          
                          // LOGIC KIỂM TRA TRẠNG THÁI ĐÁNH GIÁ CHO TỪNG ITEM
                          const currentItemReviews = reviewHistory.filter(
                            r => r.orderId === orderId && r.listingId === itemListingId
                          );
                          const reviewCount = currentItemReviews.length;

                          return (
                            <div key={`${orderId}-${itemListingId}-${itemIndex}`} className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg">
                              {/* Hình ảnh sản phẩm */}
                              <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.listingTitle} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-on-surface-variant/20">directions_bike</span>
                                  </div>
                                )}
                              </div>

                              {/* Thông tin sản phẩm */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                                      {item.brandName ?? 'BRAND'}
                                    </p>
                                    <p className="font-bold text-base text-on-surface line-clamp-2 mt-1">
                                      {item.listingTitle ?? 'Product'}
                                    </p>
                                  </div>
                                  <p className="font-headline font-bold text-xl text-primary shrink-0">
                                    {(item.price ?? 0).toLocaleString('vi-VN')}₫
                                  </p>
                                </div>

                                {/* NÚT ĐÁNH GIÁ CHO TỪNG ITEM - CHỈ HIỂN THỊ KHI COMPLETED */}
                                {isCompleted && (
                                  <div className="flex items-center flex-wrap gap-2 mt-3">
                                    {reviewCount === 0 ? (
                                      // CHƯA ĐÁNH GIÁ - Hiển thị nút RATE
                                      <button
                                        onClick={() => {
                                          console.log('🔵 RATE Button Clicked!', { orderId, itemListingId });
                                          setReviewOrderId(orderId);
                                          setReviewListingId(itemListingId);
                                          setReviewListingTitle(item.listingTitle);
                                          setRating(5);
                                          setComment('');
                                          setIsReviewModalOpen(true);
                                        }}
                                        className="bg-orange-500 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full hover:opacity-90 inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">star</span>
                                        Rate
                                      </button>
                                    ) : reviewCount === 1 ? (
                                      // ĐÃ ĐÁNH GIÁ 1 LẦN - Hiển thị RATED + RATE AGAIN
                                      <>
                                        <button
                                          disabled
                                          className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-4 py-1.5 rounded-full inline-flex items-center gap-1 cursor-not-allowed"
                                        >
                                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                                          Rated
                                        </button>
                                        <button
                                          onClick={() => {
                                            console.log('🟡 RATE AGAIN Button Clicked!', { orderId, itemListingId });
                                            const existingReview = currentItemReviews[0];
                                            setReviewOrderId(orderId);
                                            setReviewListingId(itemListingId);
                                            setReviewListingTitle(item.listingTitle);
                                            setReviewItemId(existingReview.reviewItemId || existingReview.id);
                                            setOldReviewData({
                                              rating: existingReview.rating || 5,
                                              comment: existingReview.comment || ''
                                            });
                                            setIsHistoryWarningModal(true);
                                          }}
                                          className="bg-yellow-500 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full hover:opacity-90 inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-[14px]">refresh</span>
                                          Rate Again
                                        </button>
                                      </>
                                    ) : (
                                      // ĐÃ ĐÁNH GIÁ >= 2 LẦN - CHỈ hiển thị RATED (khóa vĩnh viễn)
                                      <button
                                        disabled
                                        className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-4 py-1.5 rounded-full inline-flex items-center gap-1 cursor-not-allowed"
                                      >
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                                        Rated
                                      </button>
                                    )}

                                    {/* NÚT REPORT - CHỈ HIỂN THỊ KHI ĐÃ ĐÁNH GIÁ (reviewCount > 0) */}
                                    {reviewCount > 0 && (() => {
                                      const alreadyReported = reportHistory.some(
                                        r => (r.orderId === orderId || r.orderId === String(orderId))
                                      );
                                      return alreadyReported ? (
                                        <button
                                          disabled
                                          className="bg-red-100 text-red-400 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1 cursor-not-allowed border border-red-200"
                                        >
                                          <span className="material-symbols-outlined text-[14px]">flag</span>
                                          Reported
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setSelectedReportOrder({
                                              orderId: orderId,
                                              orderCode: order.orderCode,
                                              sellerId: order.sellerId,
                                              sellerName: order.sellerName || 'Người bán',
                                              listingTitle: item.listingTitle,
                                            });
                                            setReportForm({ reportTypeId: '', title: '', content: '' });
                                            setIsReportModalOpen(true);
                                          }}
                                          className="bg-red-500 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full hover:opacity-90 inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-[14px]">flag</span>
                                          Report
                                        </button>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }) : (
                          <div className="text-center py-4 text-on-surface-variant text-sm">
                            Không có sản phẩm trong đơn hàng này
                          </div>
                        )}
                      </div>

                      {/* FOOTER ĐƠN HÀNG - NÚT COMPLETE/CANCEL */}
                      {canTakeAction && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-outline-variant/10">
                          <button
                            onClick={() => handleCompleteOrder(orderId)}
                            className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase px-4 py-2 rounded-full hover:opacity-90 inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Complete Order
                          </button>
                          <button
                            onClick={() => handleCancelOrder(orderId)}
                            className="bg-error text-on-error text-[10px] font-bold uppercase px-4 py-2 rounded-full hover:opacity-90 inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">cancel</span>
                            Cancel Order
                          </button>
                          <button 
                            onClick={() => setSelectedOrder(order)} 
                            className="ml-auto p-2 text-on-surface hover:text-primary rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        </div>
                      )}
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

      {/* MODAL THÀNH CÔNG (SUCCESS MODAL) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-tertiary">check_circle</span>
              </div>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface">{successMessage || 'Thành công!'}</h3>
            <p className="text-sm text-on-surface-variant">Đánh giá của bạn sẽ giúp người mua khác có thêm thông tin hữu ích.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-3 bg-tertiary text-on-tertiary font-bold uppercase text-sm rounded-lg hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ERROR MODAL - Hiển thị lỗi */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-error">error</span>
              </div>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface">Có lỗi xảy ra</h3>
            <p className="text-sm text-on-surface-variant">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* PHẦN 1: MODAL ĐÁNH GIÁ (REVIEW MODAL) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Đánh giá sản phẩm</p>
                <h2 className="font-headline text-2xl font-bold mt-1">Chia sẻ trải nghiệm</h2>
                {reviewListingTitle && (
                  <p className="text-sm text-on-surface-variant mt-2 italic">"{reviewListingTitle}"</p>
                )}
              </div>
              <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Chọn số sao */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-on-surface">Đánh giá của bạn</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-110"
                  >
                    <span 
                      className={`material-symbols-outlined text-4xl ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      style={{ fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      star
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-lg font-bold text-on-surface">{rating}/5</span>
              </div>
            </div>

            {/* Nhập nội dung đánh giá */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-on-surface">Nội dung đánh giá</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={5}
              />
            </div>

            {/* Nút hành động */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 px-4 py-3 bg-tertiary text-on-tertiary font-bold uppercase text-sm rounded-lg hover:opacity-90"
              >
                Hoàn tất đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY WARNING MODAL - Cảnh báo trước khi đánh giá lại */}
      {isHistoryWarningModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Cảnh báo</p>
                <h2 className="font-headline text-2xl font-bold mt-1 text-orange-600">Đánh giá lại</h2>
              </div>
              <button onClick={() => setIsHistoryWarningModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Hiển thị đánh giá cũ nếu có */}
            {oldReviewData && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">Đánh giá trước đó của bạn:</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star}
                      className={`material-symbols-outlined text-xl ${
                        star <= oldReviewData.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      style={{ fontVariationSettings: star <= oldReviewData.rating ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      star
                    </span>
                  ))}
                  <span className="ml-1 text-sm font-bold">{oldReviewData.rating}/5</span>
                </div>
                <p className="text-sm text-gray-700 italic">"{oldReviewData.comment}"</p>
              </div>
            )}

            {/* Cảnh báo */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-orange-600 text-2xl">warning</span>
                <div>
                  <p className="font-bold text-orange-900 text-sm">Lưu ý quan trọng</p>
                  <p className="text-sm text-orange-800 mt-1">
                    Bạn có chắc chắn muốn đánh giá lại không? Bạn chỉ có thể đánh giá lại <strong>1 lần duy nhất</strong> và không thể thay đổi sau đó.
                  </p>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsHistoryWarningModal(false)}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmReRate}
                className="flex-1 px-4 py-3 bg-tertiary text-on-tertiary font-bold uppercase text-sm rounded-lg hover:opacity-90"
              >
                Tôi chắc chắn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RE-REVIEW MODAL - Form đánh giá lại (lần 2) */}
      {isReReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Đánh giá lại sản phẩm</p>
                <h2 className="font-headline text-2xl font-bold mt-1">Cập nhật đánh giá</h2>
                {reviewListingTitle && (
                  <p className="text-sm text-on-surface-variant mt-2 italic">"{reviewListingTitle}"</p>
                )}
              </div>
              <button onClick={() => setIsReReviewModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Chọn số sao */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-on-surface">Đánh giá mới của bạn</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-110"
                  >
                    <span 
                      className={`material-symbols-outlined text-4xl ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      style={{ fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      star
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-lg font-bold text-on-surface">{rating}/5</span>
              </div>
            </div>

            {/* Nhập nội dung đánh giá */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-on-surface">Nội dung đánh giá mới</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ đánh giá mới của bạn về sản phẩm này..."
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={5}
              />
            </div>

            {/* Nút hành động */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsReReviewModal(false)}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmitReReview}
                className="flex-1 px-4 py-3 bg-tertiary text-on-tertiary font-bold uppercase text-sm rounded-lg hover:opacity-90"
              >
                Hoàn tất đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL - Tố cáo người bán */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tố cáo</p>
                <h2 className="font-headline text-2xl font-bold mt-1 text-red-600">Tố cáo người bán</h2>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Thông tin seller & đơn hàng */}
            {selectedReportOrder && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-[18px]">store</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Người bán</p>
                    <p className="font-bold text-sm text-on-surface">{selectedReportOrder.sellerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-[18px]">receipt</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Đơn hàng</p>
                    <p className="font-mono text-sm text-on-surface font-medium">
                      #{selectedReportOrder.orderCode || selectedReportOrder.orderId}
                    </p>
                  </div>
                </div>
                {selectedReportOrder.listingTitle && (
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-500 text-[18px]">directions_bike</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Sản phẩm</p>
                      <p className="text-sm text-on-surface line-clamp-1">{selectedReportOrder.listingTitle}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chọn loại tố cáo */}
            <div className="space-y-2">
              <p className="text-sm font-bold text-on-surface">Loại tố cáo <span className="text-red-500">*</span></p>
              <select
                value={reportForm.reportTypeId}
                onChange={(e) => setReportForm(prev => ({ ...prev, reportTypeId: e.target.value }))}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm bg-white"
              >
                <option value="">-- Chọn loại tố cáo --</option>
                {reportTypes.map((type) => {
                  const typeId = type.reportTypeId || type.id;
                  return (
                    <option key={typeId} value={typeId}>
                      {type.typeName || type.name || `Loại ${typeId}`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Tiêu đề */}
            <div className="space-y-2">
              <p className="text-sm font-bold text-on-surface">Tiêu đề <span className="text-red-500">*</span></p>
              <input
                type="text"
                value={reportForm.title}
                onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tiêu đề tố cáo..."
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              />
            </div>

            {/* Nội dung */}
            <div className="space-y-2">
              <p className="text-sm font-bold text-on-surface">Nội dung <span className="text-red-500">*</span></p>
              <textarea
                value={reportForm.content}
                onChange={(e) => setReportForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải với người bán này..."
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none text-sm"
                rows={4}
              />
            </div>

            {/* Nút hành động */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportForm({ reportTypeId: '', title: '', content: '' });
                  setSelectedReportOrder(null);
                }}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={isReportLoading}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold uppercase text-sm rounded-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isReportLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                    Báo cáo
                  </>
                )}
              </button>
            </div>
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
