import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';

const API_BASE = '/api/v1';

export default function AdminReviews() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0
  });

  // Gọi API lấy danh sách đánh giá
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchReviews = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/admin/orders/reviews`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setReviews([]);
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('[AdminReviews] API Response:', data);
        
        // API có thể trả về mảng trực tiếp hoặc object chứa mảng
        const reviewList = Array.isArray(data) ? data : (data.reviews || []);
        setReviews(reviewList);

        // Tính toán thống kê
        if (reviewList.length > 0) {
          const totalRating = reviewList.reduce((sum, r) => sum + (r.rating || 0), 0);
          const avgRating = (totalRating / reviewList.length).toFixed(1);
          
          setStats({
            total: reviewList.length,
            averageRating: avgRating,
            fiveStars: reviewList.filter(r => r.rating === 5).length,
            fourStars: reviewList.filter(r => r.rating === 4).length,
            threeStars: reviewList.filter(r => r.rating === 3).length,
            twoStars: reviewList.filter(r => r.rating === 2).length,
            oneStar: reviewList.filter(r => r.rating === 1).length
          });
        }
      } catch (err) {
        console.error('[AdminReviews] Fetch error:', err);
        setError(err.message || 'Không thể tải danh sách đánh giá');
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Vui lòng đăng nhập để xem đánh giá.</p>
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
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-4xl text-primary">rate_review</span>
            <div>
              <h2 className="font-body text-xs uppercase tracking-widest text-zinc-400 font-medium">ADMIN PANEL</h2>
              <h1 className="font-headline text-4xl font-black italic text-zinc-900">Quản lý Đánh giá</h1>
            </div>
          </div>
          <p className="text-sm text-zinc-600 mt-2">
            Theo dõi và quản lý tất cả đánh giá trên toàn hệ thống
          </p>
        </div>

        {/* STATISTICS */}
        {!isLoading && !error && reviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-zinc-200/50 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Total</p>
              <p className="font-headline text-3xl font-bold text-zinc-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200/50 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-orange-600 font-bold">Average</p>
              <p className="font-headline text-3xl font-bold text-orange-600 mt-2">{stats.averageRating} ⭐</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-zinc-200/50 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">5 Stars</p>
              <p className="font-headline text-3xl font-bold text-yellow-500 mt-2">{stats.fiveStars}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-zinc-200/50 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">4 Stars</p>
              <p className="font-headline text-3xl font-bold text-green-500 mt-2">{stats.fourStars}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-zinc-200/50 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">3 Stars</p>
              <p className="font-headline text-3xl font-bold text-blue-500 mt-2">{stats.threeStars}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-zinc-200/50 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">2 Stars</p>
              <p className="font-headline text-3xl font-bold text-orange-500 mt-2">{stats.twoStars}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-zinc-200/50 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">1 Star</p>
              <p className="font-headline text-3xl font-bold text-red-500 mt-2">{stats.oneStar}</p>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
            <p className="text-zinc-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          /* ERROR STATE */
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-red-600">error</span>
              </div>
            </div>
            <p className="text-red-600 font-bold text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:opacity-90"
            >
              Thử lại
            </button>
          </div>
        ) : reviews.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-zinc-400">rate_review</span>
              </div>
            </div>
            <p className="text-zinc-600 text-lg font-medium">Chưa có đánh giá nào trên hệ thống.</p>
            <p className="text-zinc-400 text-sm mt-2">Các đánh giá từ người dùng sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          /* REVIEWS LIST */
          <div className="space-y-4">
            {reviews.map((review) => {
              const reviewId = review.reviewItemId || review.id;
              const rating = review.rating || 0;

              return (
                <div 
                  key={reviewId} 
                  className="bg-white border border-zinc-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex gap-6">
                    {/* NỘI DUNG ĐÁNH GIÁ */}
                    <div className="flex-1 min-w-0">
                      {/* HEADER - Tên sản phẩm */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-xl">directions_bike</span>
                            <h3 className="font-bold text-lg text-zinc-900">
                              {review.listingTitle || 'Sản phẩm'}
                            </h3>
                          </div>
                          
                          {/* THÔNG TIN GIAO DỊCH - QUAN TRỌNG */}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                              <span className="material-symbols-outlined text-blue-600 text-sm">person</span>
                              <span className="text-xs font-medium text-blue-700">
                                Người mua: <span className="font-bold">{review.buyerName || 'N/A'}</span>
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-zinc-300 text-sm">arrow_forward</span>
                            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                              <span className="material-symbols-outlined text-green-600 text-sm">store</span>
                              <span className="text-xs font-medium text-green-700">
                                Người bán: <span className="font-bold">{review.sellerName || 'N/A'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RATING - Hiển thị sao */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star}
                              className={`material-symbols-outlined text-2xl ${
                                star <= rating ? 'text-yellow-500' : 'text-zinc-300'
                              }`}
                              style={{ fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0' }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-lg font-bold text-zinc-900">{rating}/5</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                          rating >= 4 ? 'bg-green-100 text-green-700' :
                          rating >= 3 ? 'bg-blue-100 text-blue-700' :
                          rating >= 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {rating >= 4 ? 'Tích cực' : rating >= 3 ? 'Trung bình' : 'Tiêu cực'}
                        </span>
                      </div>

                      {/* COMMENT - Nội dung đánh giá */}
                      <div className="bg-zinc-50 rounded-lg p-4 border-l-4 border-primary mb-4">
                        <p className="text-sm text-zinc-700 leading-relaxed italic">
                          "{review.comment || 'Không có nội dung đánh giá.'}"
                        </p>
                      </div>

                      {/* FOOTER - Thông tin bổ sung */}
                      <div className="flex items-center gap-4 pt-3 border-t border-zinc-200/50 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                        {review.orderId && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">receipt</span>
                            <span>Order #{review.orderId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* HÌNH ẢNH XE ĐẠP - BÊN PHẢI */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                        {review.listingImageUrl ? (
                          <img 
                            src={review.listingImageUrl} 
                            alt={review.listingTitle || 'Bike'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-zinc-300">directions_bike</span>
                          </div>
                        )}
                      </div>
                    </div>
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
