import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import SellerSidebar from '../../components/SellerSidebar';

const API_BASE = '/api/v1';

export default function SellerReviews() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
        const response = await fetch(`${API_BASE}/seller/orders/reviews`, {
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
        console.log('[SellerReviews] API Response:', data);
        
        // API có thể trả về mảng trực tiếp hoặc object chứa mảng
        const reviewList = Array.isArray(data) ? data : (data.reviews || []);
        setReviews(reviewList);
      } catch (err) {
        console.error('[SellerReviews] Fetch error:', err);
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
    <div className="flex min-h-screen bg-surface">
      <SellerSidebar
        brandName="Veloce Kinetic"
        merchantName={currentUser?.username || 'Seller'}
        merchantSub="Seller Dashboard"
      />

      <main className="flex-1 ml-64 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-4xl text-primary">rate_review</span>
            <div>
              <h2 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">REVIEWS</h2>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Đánh giá từ Người mua</h1>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant mt-2">
            Xem tất cả đánh giá từ khách hàng về sản phẩm của bạn
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
            <p className="text-on-surface-variant">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          /* ERROR STATE */
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-error">error</span>
              </div>
            </div>
            <p className="text-error font-bold text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90"
            >
              Thử lại
            </button>
          </div>
        ) : reviews.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">rate_review</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-lg font-medium">Chưa có đánh giá nào.</p>
            <p className="text-on-surface-variant text-sm mt-2">Các đánh giá từ khách hàng sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          /* REVIEWS LIST */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-on-surface-variant">
                Tổng cộng: <span className="font-bold text-on-surface">{reviews.length}</span> đánh giá
              </p>
            </div>

            {reviews.map((review) => {
              const reviewId = review.reviewItemId || review.id;
              const rating = review.rating || 0;

              return (
                <div 
                  key={reviewId} 
                  className="bg-white border border-outline-variant/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* HEADER - Tên sản phẩm */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-on-surface mb-1">
                        {review.listingTitle || 'Sản phẩm'}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        Đánh giá bởi: <span className="font-medium text-on-surface">{review.buyerName || 'Khách hàng'}</span>
                      </p>
                    </div>
                  </div>

                  {/* RATING - Hiển thị sao */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star}
                          className={`material-symbols-outlined text-2xl ${
                            star <= rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                          style={{ fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0' }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-bold text-on-surface">{rating}/5</span>
                  </div>

                  {/* COMMENT - Nội dung đánh giá */}
                  <div className="bg-surface-container-lowest rounded-lg p-4 border-l-4 border-primary mb-4">
                    <p className="text-sm text-on-surface leading-relaxed italic">
                      "{review.comment || 'Không có nội dung đánh giá.'}"
                    </p>
                  </div>

                  {/* FOOTER - Ngày đánh giá */}
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                    
                    {/* Thông tin bổ sung nếu có */}
                    {review.orderId && (
                      <p className="text-xs text-on-surface-variant">
                        Đơn hàng: <span className="font-mono font-medium">#{review.orderId}</span>
                      </p>
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
