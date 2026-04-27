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
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  }

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Form */}
            <div>
              <h2 className="text-2xl font-headline font-bold tracking-tight mb-2">Gửi tin nhắn</h2>
              <p className="text-on-surface-variant text-sm mb-8">
                Đội ngũ hỗ trợ sẽ phản hồi trong vòng <span className="font-semibold text-on-surface">24 giờ</span> làm việc.
              </p>

              {sent && (
                <div className="mb-6 p-4 bg-tertiary-container/40 text-on-tertiary-container rounded-xl flex items-center gap-3 text-sm font-bold">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  Tin nhắn đã được gửi thành công!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Họ tên
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/30"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/30"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Chủ đề
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/30"
                  >
                    <option value="">Chọn chủ đề...</option>
                    <option>Hỗ trợ giao dịch</option>
                    <option>Vấn đề tài khoản</option>
                    <option>Khiếu nại / Tranh chấp</option>
                    <option>Dịch vụ kiểm định</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Nội dung
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/30 resize-none"
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 text-white font-headline font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                >
                  Gửi tin nhắn
                </button>
              </form>

              {/* Contact info */}
              <div className="mt-8 space-y-3">
                {[
                  { icon: 'mail', label: 'support@velocekinetic.vn' },
                  { icon: 'phone', label: '+84 28 3456 7890' },
                  { icon: 'schedule', label: 'Thứ 2 – Thứ 6, 8:00 – 18:00 (GMT+7)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-orange-600 text-base">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Map + Address */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-headline font-bold tracking-tight mb-2">Văn phòng</h2>
                <p className="text-on-surface-variant text-sm mb-6">
                  Ghé thăm chúng tôi tại địa chỉ bên dưới hoặc đặt lịch hẹn trước qua email.
                </p>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-outline-variant/20" style={{ height: '320px' }}>
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
              <div className="bg-surface-container-lowest rounded-xl p-6 flex gap-4 items-start" style={{ boxShadow: '0 4px 20px rgba(78,33,32,0.05)' }}>
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
