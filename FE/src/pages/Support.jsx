import { useState } from 'react';

const TERMS = [
  {
    title: '1. Điều khoản sử dụng',
    content:
      'Bằng cách truy cập và sử dụng nền tảng Veloce Kinetic, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nền tảng chỉ dành cho người dùng từ 18 tuổi trở lên.',
  },
  {
    title: '2. Tài khoản người dùng',
    content:
      'Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình. Mọi hoạt động xảy ra dưới tài khoản của bạn đều thuộc trách nhiệm của bạn. Vui lòng thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.',
  },
  {
    title: '3. Giao dịch & Ký quỹ (Escrow)',
    content:
      'Tất cả giao dịch mua bán xe đạp trên nền tảng được bảo vệ bởi hệ thống ký quỹ Veloce Kinetic. Tiền thanh toán sẽ được giữ an toàn cho đến khi người mua xác nhận nhận hàng thành công.',
  },
  {
    title: '4. Kiểm định xe (Inspection)',
    content:
      'Veloce Kinetic cung cấp dịch vụ kiểm định 48 điểm kỹ thuật bởi các kỹ thuật viên được chứng nhận. Chứng nhận kiểm định không đảm bảo tình trạng hoàn hảo nhưng xác nhận xe đáp ứng tiêu chuẩn tối thiểu của nền tảng.',
  },
  {
    title: '5. Chính sách hoàn tiền',
    content:
      'Người mua có quyền yêu cầu hoàn tiền trong vòng 48 giờ sau khi nhận hàng nếu xe không đúng mô tả. Tranh chấp sẽ được đội ngũ hỗ trợ Veloce Kinetic xem xét và giải quyết trong vòng 5 ngày làm việc.',
  },
  {
    title: '6. Phí dịch vụ',
    content:
      'Veloce Kinetic thu phí dịch vụ 3% trên mỗi giao dịch thành công từ người bán. Phí kiểm định xe là $149 và được thanh toán trước khi tiến hành kiểm định. Không có phí ẩn nào khác.',
  },
  {
    title: '7. Quyền sở hữu trí tuệ',
    content:
      'Tất cả nội dung trên nền tảng bao gồm logo, thiết kế, và phần mềm là tài sản của Veloce Kinetic. Nghiêm cấm sao chép, phân phối hoặc sử dụng thương mại mà không có sự cho phép bằng văn bản.',
  },
  {
    title: '8. Giới hạn trách nhiệm',
    content:
      'Veloce Kinetic không chịu trách nhiệm về các thiệt hại gián tiếp phát sinh từ việc sử dụng nền tảng. Trách nhiệm tối đa của chúng tôi không vượt quá giá trị giao dịch liên quan.',
  },
];

const LAT = 10.841282126886885;
const LNG = 106.80994162985021;

export default function Support() {
  const [activeTab, setActiveTab] = useState('terms');
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body pt-20">
      {/* Hero */}
      <section className="bg-surface-container-low py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Veloce Kinetic</p>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-4">
            Hỗ trợ &amp; <span className="text-orange-600 italic">Điều khoản.</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Mọi thắc mắc, góp ý hoặc yêu cầu hỗ trợ — chúng tôi luôn sẵn sàng lắng nghe và phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-surface border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto flex">
          {[
            { key: 'terms', label: 'Điều khoản dịch vụ', icon: 'gavel' },
            { key: 'contact', label: 'Liên hệ', icon: 'contact_support' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* ── TERMS TAB ── */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div className="mb-8">
              <h2 className="text-2xl font-headline font-bold tracking-tight mb-2">Điều khoản &amp; Điều kiện</h2>
              <p className="text-on-surface-variant text-sm">
                Cập nhật lần cuối: <span className="font-semibold text-on-surface">01/01/2024</span>
              </p>
            </div>

            {TERMS.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left hover:bg-orange-50 transition-colors ${
                    openIndex === i ? 'text-orange-600' : 'text-on-surface'
                  }`}
                >
                  <span className="font-headline font-bold text-base">{item.title}</span>
                  <span
                    className={`material-symbols-outlined transition-transform duration-200 ${
                      openIndex === i ? 'rotate-180 text-orange-600' : 'text-orange-500'
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-6 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-4">
                    {item.content}
                  </div>
                )}
              </div>
            ))}

            {/* Privacy note */}
            <div className="mt-8 p-6 bg-secondary-container/20 rounded-xl border border-secondary/10 flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>
                verified_user
              </span>
              <div>
                <p className="font-bold text-sm text-on-secondary-container mb-1">Cam kết bảo mật</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Dữ liệu của bạn được mã hóa AES-256 và xử lý qua cổng thanh toán tuân thủ PCI-DSS Level 1.
                  Chúng tôi không lưu trữ thông tin thẻ ngân hàng đầy đủ trên máy chủ của mình.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT TAB ── */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-headline font-bold tracking-tight mb-2">Thông tin liên hệ</h2>
                <p className="text-on-surface-variant text-sm mb-8">
                  Đội ngũ hỗ trợ sẽ phản hồi trong vòng <span className="font-semibold text-on-surface">24 giờ</span> làm việc.
                </p>
              </div>

              {/* Contact info */}
              <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                {[
                  { icon: 'mail', label: 'Email', value: 'support@velocekinetic.vn' },
                  { icon: 'phone', label: 'Điện thoại', value: '+84 28 3456 7890' },
                  { icon: 'schedule', label: 'Giờ làm việc', value: 'Thứ 2 – Thứ 6, 8:00 – 18:00 (GMT+7)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-orange-600 text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{item.label}</p>
                      <p className="text-base font-medium text-on-surface">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div>
                <h3 className="text-xl font-headline font-bold tracking-tight mb-4">Văn phòng</h3>
                <p className="text-on-surface-variant text-sm mb-4">
                  Ghé thăm chúng tôi tại địa chỉ bên dưới hoặc liên hệ qua email/điện thoại.
                </p>
                
                <div className="rounded-xl overflow-hidden border border-outline-variant/20 mb-4" style={{ height: '320px' }}>
                  <iframe
                    title="Veloce Kinetic Office"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${LAT},${LNG}&z=16&output=embed`}
                  />
                </div>

                {/* Address card */}
                <div className="bg-surface-container-lowest rounded-xl p-6 flex gap-4 items-start shadow-md">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-orange-600 text-base">location_on</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm mb-1">The Kinetic Editorial</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Khu Công nghệ cao, Quận 9<br />
                      TP. Hồ Chí Minh, Việt Nam<br />
                      <span className="font-mono text-[10px] text-orange-600 mt-1 block">
                        {LAT.toFixed(6)}, {LNG.toFixed(6)}
                      </span>
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${LAT},${LNG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-[10px] font-bold uppercase tracking-widest text-orange-600 hover:underline"
                    >
                      Mở trong Google Maps
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* FAQ quick links */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Câu hỏi thường gặp</p>
                <div className="space-y-2">
                  {[
                    'Làm thế nào để đăng bán xe?',
                    'Quy trình kiểm định mất bao lâu?',
                    'Tiền ký quỹ được giải phóng khi nào?',
                    'Tôi có thể hủy giao dịch không?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setActiveTab('terms')}
                      className="w-full text-left flex items-center justify-between px-4 py-3 bg-surface-container-lowest rounded-lg hover:bg-orange-50 transition-colors text-xs font-medium text-on-surface group"
                    >
                      {q}
                      <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-orange-600 transition-colors">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
