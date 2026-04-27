import { useNavigate } from 'react-router-dom';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6" style={{ marginTop: '80px' }}>
      <div className="text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <span className="material-symbols-outlined text-orange-500/10 absolute inset-0 blur-2xl" style={{ fontSize: '200px' }}>
              schedule
            </span>
            <span className="material-symbols-outlined text-orange-500 relative" style={{ fontSize: '120px', fontVariationSettings: '"FILL" 1' }}>
              schedule
            </span>
          </div>
        </div>

        {/* Text */}
        <h1 className="font-headline text-5xl font-black text-orange-500 tracking-tighter mb-4">
          Coming Soon
        </h1>
        
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">
          Tính năng đang được phát triển
        </h2>
        
        <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-md mx-auto">
          Chúng tôi đang nỗ lực hoàn thiện tính năng này. 
          Hãy quay lại sau để trải nghiệm những điều tuyệt vời!
        </p>

        {/* Nút quay về */}
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-3 rounded-full inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">home</span>
          Quay về trang chủ
        </button>

        {/* Gợi ý */}
        <div className="mt-12 pt-8 border-t border-outline-variant/20">
          <p className="text-sm text-on-surface-variant mb-4">Trong khi chờ đợi, bạn có thể:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/search')}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              Khám phá xe đạp
            </button>
            <span className="text-on-surface-variant">•</span>
            <button
              onClick={() => navigate('/support')}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">contact_support</span>
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
