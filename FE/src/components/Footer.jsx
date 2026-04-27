import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    // TODO: Integrate with newsletter API
    console.log('Newsletter subscription:', email);
    setSubscribed(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="w-full bg-gray-950 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-screen-2xl mx-auto pt-20 pb-10 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* ═══════════════════════════════════════════════════════════════
              CỘT 1: BRAND IDENTITY & NEWSLETTER (Chiếm 2 cột trên Desktop)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo/Brand Name */}
            <div>
              <h2 className="text-orange-500 text-3xl font-extrabold tracking-tighter mb-3 font-headline">
                The Kinetic
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm max-w-md">
                Nền tảng thương mại điện tử hàng đầu dành cho những cỗ máy tốc độ. 
                Chúng tôi kết nối đam mê và độ chính xác trong từng vòng đạp.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                Đăng ký nhận tin
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Đăng ký để nhận tin tức mới nhất và ưu đãi đặc quyền.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="flex-1 bg-gray-900 border border-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-l-lg py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-r-lg transition-all font-semibold text-sm active:scale-95 whitespace-nowrap"
                >
                  Đăng ký
                </button>
              </form>

              {/* Success Message */}
              {subscribed && (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium animate-fade-in">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>
                    check_circle
                  </span>
                  Đăng ký thành công! Cảm ơn bạn.
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-orange-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-orange-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-orange-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-orange-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CỘT 2: SẢN PHẨM (MARKETPLACE)
              ═══════════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
              Sản phẩm
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Xe đạp đua (Road)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Xe đạp địa hình (MTB)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Xe đạp đường phố (Touring)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Phụ tùng & Linh kiện
                </a>
              </li>
            </ul>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CỘT 3: HỖ TRỢ KHÁCH HÀNG (SUPPORT)
              ═══════════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
              Hỗ trợ
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                  Tra cứu bảo hành
                </a>
              </li>
            </ul>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CỘT 4: HỆ SINH THÁI (THE KINETIC ECOSYSTEM)
              ═══════════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
              Hệ sinh thái
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[16px] text-gray-600 group-hover:text-orange-500 transition-colors">
                    engineering
                  </span>
                  Tech Specs Library
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[16px] text-gray-600 group-hover:text-orange-500 transition-colors">
                    public
                  </span>
                  Global Logistics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[16px] text-gray-600 group-hover:text-orange-500 transition-colors">
                    smart_toy
                  </span>
                  Chương trình kiểm định AI
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm inline-flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[16px] text-gray-600 group-hover:text-orange-500 transition-colors" style={{ fontVariationSettings: '"FILL" 1' }}>
                    workspace_premium
                  </span>
                  Câu lạc bộ Kinetic Elite
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ĐƯỜNG PHÂN CÁCH (DIVIDER)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          
          {/* ═══════════════════════════════════════════════════════════════
              BOTTOM BAR (LEGAL & COPYRIGHT)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* PHẦN TRÁI: Bản quyền & Legal Links */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              {/* Copyright */}
              <p className="text-sm text-gray-500">
                © 2026 The Kinetic. All rights reserved.
              </p>
              
              {/* Legal Links */}
              <div className="flex items-center gap-1">
                <span className="hidden md:inline text-gray-700">•</span>
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-gray-700">•</span>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                  <span className="text-gray-700">•</span>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>

            {/* PHẦN PHẢI: Payment Methods & Trust Badges */}
            <div className="flex items-center gap-6">
              {/* Payment Methods */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">
                  Thanh toán
                </span>
                <div className="flex items-center gap-2">
                  {/* Visa */}
                  <div className="w-10 h-7 bg-gray-900 rounded border border-gray-800 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                      <path d="M20.5 11h-3.2l-2 10h2l2-10zm7.3 6.5l1.1-3 .6 3h-1.7zm2.4 3.5h1.8l-1.6-10h-1.6c-.4 0-.7.2-.8.5l-2.8 9.5h2.1l.4-1.2h2.5v1.2zm-6.5-3.3c0-2.6-3.6-2.7-3.6-3.9 0-.4.4-.8 1.2-.9.4 0 1.5-.1 2.7.5l.5-2.3c-.7-.2-1.5-.5-2.6-.5-2.8 0-4.7 1.5-4.7 3.6 0 1.6 1.4 2.4 2.5 3 1.1.5 1.5.9 1.5 1.4 0 .7-.9 1-1.7 1-1.4 0-2.2-.4-2.8-.7l-.5 2.4c.6.3 1.8.5 3 .5 2.9 0 4.8-1.4 4.8-3.6l.2-.5z" fill="white"/>
                    </svg>
                  </div>
                  {/* Mastercard */}
                  <div className="w-10 h-7 bg-gray-900 rounded border border-gray-800 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#000000"/>
                      <circle cx="18" cy="16" r="7" fill="#EB001B"/>
                      <circle cx="30" cy="16" r="7" fill="#F79E1B"/>
                      <path d="M24 11.5c-1.3 1.2-2 2.9-2 4.5s.7 3.3 2 4.5c1.3-1.2 2-2.9 2-4.5s-.7-3.3-2-4.5z" fill="#FF5F00"/>
                    </svg>
                  </div>
                  {/* PayPal */}
                  <div className="w-10 h-7 bg-gray-900 rounded border border-gray-800 flex items-center justify-center">
                    <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                      <path d="M18.5 8h-5c-.3 0-.6.3-.7.6l-2 13c0 .3.2.5.4.5h2.5c.3 0 .6-.3.7-.6l.5-3.4c.1-.4.4-.6.7-.6h1.7c3.5 0 5.5-1.7 6-5 .2-1.4 0-2.6-.7-3.4-.8-.9-2.2-1.3-4.1-1.3zm.6 5c-.3 1.8-1.6 1.8-2.9 1.8h-.7l.5-3.2c0-.2.2-.4.4-.4h.4c1 0 1.9 0 2.4.6.3.3.4.8.3 1.4zm13.4 0h-2.5c-.2 0-.4.2-.4.4l-.1.6-.2-.3c-.5-.8-1.7-1-2.9-1-2.7 0-5 2-5.4 4.9-.2 1.4.1 2.8 1 3.7.8.8 1.9 1.2 3.2 1.2 2.3 0 3.5-1.5 3.5-1.5l-.1.6c0 .3.2.5.4.5h2.3c.3 0 .6-.3.7-.6l1.2-7.9c.1-.3-.1-.6-.4-.6zm-3.5 5c-.2 1.4-1.3 2.3-2.7 2.3-.7 0-1.2-.2-1.6-.6-.4-.4-.5-1-.4-1.6.2-1.3 1.3-2.3 2.7-2.3.7 0 1.2.2 1.6.6.4.4.6 1 .4 1.6z" fill="#139AD6"/>
                      <path d="M38.5 8h-2.5c-.2 0-.4.2-.4.4l-.1.6-.2-.3c-.5-.8-1.7-1-2.9-1-2.7 0-5 2-5.4 4.9-.2 1.4.1 2.8 1 3.7.8.8 1.9 1.2 3.2 1.2 2.3 0 3.5-1.5 3.5-1.5l-.1.6c0 .3.2.5.4.5h2.3c.3 0 .6-.3.7-.6l1.2-7.9c.1-.3-.1-.6-.4-.6zm-3.5 5c-.2 1.4-1.3 2.3-2.7 2.3-.7 0-1.2-.2-1.6-.6-.4-.4-.5-1-.4-1.6.2-1.3 1.3-2.3 2.7-2.3.7 0 1.2.2 1.6.6.4.4.6 1 .4 1.6z" fill="#263B80"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-800">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  verified_user
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  Secured
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
}
