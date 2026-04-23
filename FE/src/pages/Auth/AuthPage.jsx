import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const API_BASE = 'https://swp391-bike-marketplace-backend-1.onrender.com/api/v1';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [reg, setReg] = useState({ username: '', fullname: '', email: '', phone: '', password: '', confirm: '', role: '', terms: false });
  const [regErrors, setRegErrors] = useState({});

  const [loginLoading, setLoginLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regApiError, setRegApiError] = useState('');

  // Forgot password state: 'login' | 'forgot-email' | 'forgot-otp'
  const [forgotStep, setForgotStep] = useState('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [forgotEmailLoading, setForgotEmailLoading] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotResetErrors, setForgotResetErrors] = useState({});
  const [forgotResetLoading, setForgotResetLoading] = useState(false);
  const [forgotResetSuccess, setForgotResetSuccess] = useState('');

  const navigate = useNavigate();
  const { login, register } = useAuth();

  async function handleForgotEmailSubmit(e) {
    e.preventDefault();
    setForgotEmailError('');
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotEmailError('Vui lòng nhập email hợp lệ.');
      return;
    }
    setForgotEmailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (res.ok) {
        setForgotStep('forgot-otp');
      } else {
        const data = await res.json().catch(() => ({}));
        setForgotEmailError(data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch {
      setForgotEmailError('Không thể kết nối máy chủ, vui lòng thử lại.');
    }
    setForgotEmailLoading(false);
  }

  async function handleForgotResetSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!forgotOtp.trim()) errors.otp = 'Vui lòng nhập mã OTP.';
    if (!forgotNewPassword) errors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    else if (forgotNewPassword.length < 6) errors.newPassword = 'Mật khẩu tối thiểu 6 ký tự.';
    if (!forgotConfirmPassword) errors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    else if (forgotConfirmPassword !== forgotNewPassword) errors.confirmPassword = 'Mật khẩu không khớp.';
    if (Object.keys(errors).length > 0) { setForgotResetErrors(errors); return; }

    setForgotResetErrors({});
    setForgotResetLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otpCode: forgotOtp, newPassword: forgotNewPassword, confirmPassword: forgotConfirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setForgotResetSuccess(data.message || 'Đặt lại mật khẩu thành công.');
        setTimeout(() => {
          setForgotStep('login');
          setForgotEmail(''); setForgotOtp(''); setForgotNewPassword(''); setForgotConfirmPassword('');
          setForgotResetSuccess('');
        }, 2000);
      } else {
        setForgotResetErrors({ api: data.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.' });
      }
    } catch {
      setForgotResetErrors({ api: 'Không thể kết nối máy chủ, vui lòng thử lại.' });
    }
    setForgotResetLoading(false);
  }

  function setRegField(field, value) {
    setReg(prev => ({ ...prev, [field]: value }));
    setRegErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validateReg() {
    const errors = {};
    if (!reg.username.trim()) errors.username = 'Tên đăng nhập không được để trống.';
    if (!reg.fullname.trim()) errors.fullname = 'Họ và tên không được để trống.';
    if (!reg.email.trim()) errors.email = 'Email không được để trống.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)) errors.email = 'Email không đúng định dạng.';
    if (!reg.phone.trim()) errors.phone = 'Số điện thoại không được để trống.';
    else if (!/^(\+84|0)[0-9]{9,10}$/.test(reg.phone.replace(/\s/g, ''))) errors.phone = 'Số điện thoại không đúng định dạng.';
    if (!reg.password) errors.password = 'Mật khẩu không được để trống.';
    else if (reg.password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự.';
    if (!reg.confirm) errors.confirm = 'Vui lòng nhập lại mật khẩu.';
    else if (reg.confirm !== reg.password) errors.confirm = 'Mật khẩu không khớp.';
    if (!reg.role) errors.role = 'Vui lòng chọn vai trò.';
    if (!reg.terms) errors.terms = 'Bạn phải đồng ý điều khoản để tiếp tục.';
    return errors;
  }

  async function handleRegSubmit(e) {
    e.preventDefault();
    setRegApiError('');
    const errors = validateReg();
    if (Object.keys(errors).length > 0) { setRegErrors(errors); return; }

    setRegLoading(true);
    const result = await register({
      userName: reg.username,
      fullName: reg.fullname,
      email: reg.email,
      phone: reg.phone,
      password: reg.password,
      role: reg.role,
    });
    setRegLoading(false);

    if (!result.success) {
      setRegApiError(result.message);
      return;
    }

    navigate(result.redirectPath);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const result = await login({
      email: loginEmail,
      password: loginPassword,
    });

    setLoginLoading(false);

    if (!result.success) {
      setLoginError(result.message);
      return;
    }

    navigate(result.redirectPath);
  }

  // Step 1: Enter email to receive OTP
  if (forgotStep === 'forgot-email') {
    return (
      <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center relative overflow-hidden antialiased">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center grayscale opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-transparent to-primary/5"></div>
        </div>
        <main className="relative z-10 w-full max-w-md px-6">
          <div className="bg-surface-container-lowest/80 backdrop-blur-2xl p-8 md:p-12 rounded-xl shadow-[0_40px_80px_rgba(78,33,32,0.08)] border border-white/40">
            <button onClick={() => setForgotStep('login')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 text-sm font-semibold">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại đăng nhập
            </button>
            <div className="mb-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-background">Quên mật khẩu?</h2>
              <p className="text-on-surface-variant mt-2 text-sm">Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p>
            </div>
            <form className="space-y-6" onSubmit={handleForgotEmailSubmit}>
              <div className="space-y-1.5">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all font-body"
                    placeholder="ten@thekinetic.vn"
                    type="email"
                    value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setForgotEmailError(''); }}
                  />
                </div>
                {forgotEmailError && <p className="text-error text-xs mt-1 font-medium">{forgotEmailError}</p>}
              </div>
              <button
                disabled={forgotEmailLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest py-4 rounded-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
              >
                {forgotEmailLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Step 2: Enter OTP + new password
  if (forgotStep === 'forgot-otp') {
    return (
      <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center relative overflow-hidden antialiased">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center grayscale opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-transparent to-primary/5"></div>
        </div>
        <main className="relative z-10 w-full max-w-md px-6">
          <div className="bg-surface-container-lowest/80 backdrop-blur-2xl p-8 md:p-12 rounded-xl shadow-[0_40px_80px_rgba(78,33,32,0.08)] border border-white/40">
            <button onClick={() => setForgotStep('forgot-email')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 text-sm font-semibold">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại
            </button>
            <div className="mb-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-background">Đặt lại mật khẩu</h2>
              <p className="text-on-surface-variant mt-2 text-sm">Mã OTP đã được gửi đến <span className="font-semibold text-on-surface">{forgotEmail}</span>. Mã có hiệu lực trong 10 phút.</p>
            </div>
            {forgotResetSuccess ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                <p className="text-on-surface font-semibold text-center">{forgotResetSuccess}</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleForgotResetSubmit}>
                <div className="space-y-1.5">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mã OTP</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">pin</span>
                    </div>
                    <input
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all font-body tracking-[0.3em] text-center"
                      placeholder="000000"
                      type="text"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={e => { setForgotOtp(e.target.value.replace(/\D/g, '')); setForgotResetErrors(p => ({ ...p, otp: '' })); }}
                    />
                  </div>
                  {forgotResetErrors.otp && <p className="text-error text-xs mt-1 font-medium">{forgotResetErrors.otp}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mật khẩu mới</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                    </div>
                    <input
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all font-body"
                      placeholder="••••••••"
                      type="password"
                      value={forgotNewPassword}
                      onChange={e => { setForgotNewPassword(e.target.value); setForgotResetErrors(p => ({ ...p, newPassword: '' })); }}
                    />
                  </div>
                  {forgotResetErrors.newPassword && <p className="text-error text-xs mt-1 font-medium">{forgotResetErrors.newPassword}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Nhập lại mật khẩu</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">lock_reset</span>
                    </div>
                    <input
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all font-body"
                      placeholder="••••••••"
                      type="password"
                      value={forgotConfirmPassword}
                      onChange={e => { setForgotConfirmPassword(e.target.value); setForgotResetErrors(p => ({ ...p, confirmPassword: '' })); }}
                    />
                  </div>
                  {forgotResetErrors.confirmPassword && <p className="text-error text-xs mt-1 font-medium">{forgotResetErrors.confirmPassword}</p>}
                </div>
                {forgotResetErrors.api && <p className="text-error text-sm font-medium text-center">{forgotResetErrors.api}</p>}
                <button
                  disabled={forgotResetLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest py-4 rounded-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {forgotResetLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (isLogin) {
    return (
      <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center relative overflow-hidden antialiased">
        {/* Background Cinematic Element */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center grayscale opacity-10"
            data-alt="Close-up of a high-performance carbon fiber bicycle frame with dramatic lighting highlighting the technical precision and aerodynamic curves."
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-transparent to-primary/5"></div>
          {/* Abstract Speed Lines */}
          <div className="absolute top-1/4 -left-20 w-96 h-1 bg-primary/20 -rotate-45 blur-sm"></div>
          <div className="absolute top-1/3 -left-10 w-64 h-px bg-secondary/30 -rotate-45"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-1 bg-primary/10 rotate-12 blur-sm"></div>
        </div>

        {/* Main Content Shell */}
        <main className="relative z-10 w-full max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Branding & Editorial Message */}
          <div className="hidden md:flex flex-col space-y-8">
            <div className="space-y-2">
              <span className="font-headline text-sm font-bold tracking-[0.3em] text-primary uppercase">
                The Precision Velocity
              </span>
              <Link to="/" className="block font-headline text-7xl font-black italic tracking-tighter text-on-background leading-none hover:opacity-80 transition-opacity">
                THE<br />
                <span
                  className="text-primary italic"
                  style={{ textShadow: '0 0 20px rgba(168, 49, 0, 0.2)' }}
                >
                  KINETIC.
                </span>
              </Link>
            </div>
            <div className="max-w-md space-y-6">
              <p className="text-xl text-on-surface-variant font-light leading-relaxed">
                Chào mừng bạn trở lại với điểm giao thoa của kỹ thuật tinh xảo và tốc độ thuần khiết.
              </p>
              <div className="h-px w-24 bg-primary-container"></div>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      data-alt="Portrait of a professional cyclist looking determined"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFvDpkoSdkMy7IDKrv8oP_xocB9X7I6VVpouM0m6ool276XBDz9psI0Pj7bUMoSBbjrwWTeb4tSh4O6Ko-4UeXjQ1Xfy8DfhmR9emN0BNhOjrikFvUg4rhvT4As7RbKS9OZYlxASs86v-jJVE6Tg0u4Elg5bdBKglmyMXmgnS4r4C7TJGhORvB7XCsM74XSkbDOB9I9SV4UrGGLnI25GlMXoq8Cb19zyUBZpWwYhYw47HJtceM27ysbEiNtlXue3lqROZIIa2Ue-Jm"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      data-alt="Portrait of an enthusiast cyclist smiling"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXKVR7pt4Oidf8RdAo03P4OWWWidqfJh-5HemrWYWVVnQbhGrgWCCvdOlq4sNG1n88i7aP1yPpNgK_xv-pnIAM9gSkN-jfNOnbIGN3NNNNV0PRCGJj1AWessa6iDoI5VwBnIQgK-DUAPTbuL109fL9kwRb8rUvd32lnC1K_D_UVd0opWBd04udEPIl4ib4YbumOWgXXgcBcSMyNO7Y7uYX07Cw7or0KPhAg6P2y42bt-vgAqIjW1bRKiIxS3zsALOTyun9RzGtdGN8"
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold tracking-tight text-on-surface">
                  Tham gia cùng 50,000+ tay đua chuyên nghiệp
                </span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-surface-container-lowest/80 backdrop-blur-2xl p-8 md:p-12 rounded-xl shadow-[0_40px_80px_rgba(78,33,32,0.08)] border border-white/40">
            {/* Mobile Logo (Hidden on Desktop) */}
            <div className="md:hidden mb-8">
              <Link to="/" className="font-headline text-3xl font-black italic tracking-tighter text-primary hover:opacity-80 transition-opacity">
                KINETIC
              </Link>
            </div>
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-background">
                Đăng nhập
              </h2>
              <p className="text-on-surface-variant mt-2">
                Tiếp tục hành trình chinh phục những đỉnh cao mới.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">
                      mail
                    </span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all font-body"
                    id="email"
                    name="email"
                    placeholder="ten@kinetic.vn"
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                  />
                </div>
              </div>
              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label
                    className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1"
                    htmlFor="password"
                  >
                    Mật khẩu
                  </label>
                  <a
                    className="text-xs font-semibold text-secondary hover:underline transition-all cursor-pointer"
                    onClick={e => { e.preventDefault(); setForgotStep('forgot-email'); }}
                    href="#"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">
                      lock
                    </span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 transition-all font-body"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                  />
                </div>
              </div>
              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                  id="remember"
                  name="remember"
                  type="checkbox"
                />
                <label
                  className="ml-2 text-sm text-on-surface-variant font-medium"
                  htmlFor="remember"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              {loginError && (
                <p className="text-sm font-medium text-error">{loginError}</p>
              )}
              {/* Submit Button */}
              <button
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest py-4 rounded-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                type="submit"
              >
                {loginLoading ? 'Đang đăng nhập...' : 'Bắt đầu hành trình'}
              </button>
            </form>
            {/* Divider */}
            <div className="relative my-10">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20"></div>
              </div>
              <div className="relative flex justify-center text-sm font-label uppercase tracking-tighter">
                <span className="px-4 bg-surface-container-lowest text-outline-variant font-semibold">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>
            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span className="text-sm font-bold text-on-surface uppercase tracking-tight">
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors">
                <svg
                  className="w-5 h-5 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                <span className="text-sm font-bold text-on-surface uppercase tracking-tight">
                  Facebook
                </span>
              </button>
            </div>
            {/* Registration Link */}
            <div className="mt-12 text-center">
              <p className="text-on-surface-variant font-medium">Chưa có tài khoản?</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(false);
                }}
                className="inline-block mt-2 font-headline font-bold text-primary hover:text-primary-dim uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </main>
        {/* Footer Decorative */}
        <footer className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10 opacity-40 md:opacity-100">
          <div className="flex items-center space-x-8">
            <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
              © 2024 Kinetic Editorial
            </span>
            <div className="hidden md:flex items-center space-x-4">
              <a
                className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-outline hover:text-primary"
                href="#"
              >
                Quy định
              </a>
              <a
                className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-outline hover:text-primary"
                href="#"
              >
                Bảo mật
              </a>
            </div>
          </div>
          <div className="flex space-x-4">
            <span className="material-symbols-outlined text-outline text-lg">
              language
            </span>
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
              Vietnamese (VN)
            </span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary/20 min-h-screen flex flex-col antialiased">
      <main className="flex-1 flex items-stretch">
        {/* Left Side: Editorial Content / Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-inverse-surface">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
              data-alt="Close-up side view of a high-end matte carbon fiber racing bike frame with orange accents in a dimly lit studio setting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaN1lfVMYaYr3V5xoCGCfIT1RCtlVk9Pjr3bntnGtLLAR4VBVqdwbSHxxchdEkLDlpN58ALy_nx6Hkw__fJQGA43iKn_sOk2LyKld6wMNQwXfoGcLer8pWHWhsZIs2-eKONnxSZKX6Qu4gLWgTAz5giTMPDwW-HT_sDhO88OCVSo-OrwpunBucGxLt1KbMYFEUXubf2Imrwrqq0bvis1YWpKEJ6Cntm_eAIlQbp4XepH5vwEhdT1aUwEJYJsKJ-rPZ8BRwjvoeW78c"
            />
          </div>
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #e09c99 1px, transparent 0)',
              backgroundSize: '40px 40px',
              opacity: 0.1,
            }}
          ></div>
          <div className="relative z-20 flex flex-col justify-between p-16 w-full h-full">
            <div>
              <Link to="/" className="font-headline font-black italic tracking-tighter text-6xl text-primary-fixed leading-none hover:opacity-80 transition-opacity">
                KINETIC
              </Link>
              <p className="font-label uppercase tracking-widest text-on-primary/60 mt-4 text-xs">
                Precision Velocity Editorial
              </p>
            </div>
            <div className="max-w-md">
              <span className="inline-block px-4 py-1 rounded-full bg-secondary text-on-secondary font-label text-[10px] uppercase tracking-widest mb-6">
                Pro community
              </span>
              <h2 className="font-headline font-bold text-5xl text-surface leading-[0.9] tracking-tighter mb-8">
                THE MACHINE IS AN EXTENSION OF THE SPIRIT.
              </h2>
              <div className="flex gap-4">
                <div className="h-1 w-20 bg-primary"></div>
                <div className="h-1 w-4 bg-primary/30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-surface-bright relative">
          {/* Branding for Mobile only */}
          <div className="lg:hidden absolute top-8 left-8">
            <Link to="/" className="font-headline font-black italic tracking-tighter text-2xl text-primary hover:opacity-80 transition-opacity">
              KINETIC
            </Link>
          </div>
          <div className="w-full max-w-md space-y-8">
            <header className="space-y-3">
              <h3 className="font-headline font-bold text-4xl tracking-tighter text-on-surface">
                Bắt đầu hành trình
              </h3>
              <p className="text-on-surface-variant font-body">
                Tham gia cộng đồng xe đạp chuyên nghiệp lớn nhất.
              </p>
            </header>
            <form className="space-y-5" onSubmit={handleRegSubmit} noValidate>
              {/* Username */}
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                  Tên đăng nhập <span className="text-error">*</span>
                </label>
                <input
                  className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3.5 focus:ring-0 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body outline-none ${regErrors.username ? 'border-error' : 'border-transparent focus:border-primary/30'}`}
                  placeholder="JohnDoe123"
                  type="text"
                  value={reg.username}
                  onChange={e => setRegField('username', e.target.value)}
                />
                {regErrors.username && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.username}</p>}
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                  Họ và tên <span className="text-error">*</span>
                </label>
                <input
                  className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3.5 focus:ring-0 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body outline-none ${regErrors.fullname ? 'border-error' : 'border-transparent focus:border-primary/30'}`}
                  placeholder="Nguyễn Văn A"
                  type="text"
                  value={reg.fullname}
                  onChange={e => setRegField('fullname', e.target.value)}
                />
                {regErrors.fullname && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.fullname}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3.5 focus:ring-0 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body outline-none ${regErrors.email ? 'border-error' : 'border-transparent focus:border-primary/30'}`}
                  placeholder="example@kinetic.com"
                  type="email"
                  value={reg.email}
                  onChange={e => setRegField('email', e.target.value)}
                />
                {regErrors.email && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                  Số điện thoại <span className="text-error">*</span>
                </label>
                <input
                  className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3.5 focus:ring-0 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body outline-none ${regErrors.phone ? 'border-error' : 'border-transparent focus:border-primary/30'}`}
                  placeholder="0912 345 678"
                  type="tel"
                  value={reg.phone}
                  onChange={e => setRegField('phone', e.target.value)}
                />
                {regErrors.phone && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.phone}</p>}
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                    Mật khẩu <span className="text-error">*</span>
                  </label>
                  <input
                    className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3.5 focus:ring-0 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body outline-none ${regErrors.password ? 'border-error' : 'border-transparent focus:border-primary/30'}`}
                    placeholder="••••••••"
                    type="password"
                    value={reg.password}
                    onChange={e => setRegField('password', e.target.value)}
                  />
                  {regErrors.password && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.password}</p>}
                </div>
                <div>
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                    Nhập lại <span className="text-error">*</span>
                  </label>
                  <input
                    className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3.5 focus:ring-0 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body outline-none ${regErrors.confirm ? 'border-error' : 'border-transparent focus:border-primary/30'}`}
                    placeholder="••••••••"
                    type="password"
                    value={reg.confirm}
                    onChange={e => setRegField('confirm', e.target.value)}
                  />
                  {regErrors.confirm && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.confirm}</p>}
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                  Vai trò <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'Buyer', label: 'Người mua', icon: 'shopping_cart' },
                    { value: 'Seller', label: 'Người bán', icon: 'storefront' },
                  ].map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRegField('role', r.value)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                        reg.role === r.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl"
                        style={reg.role === r.value ? { fontVariationSettings: '"FILL" 1' } : {}}>
                        {r.icon}
                      </span>
                      <span className="font-label font-bold text-xs uppercase tracking-widest">{r.label}</span>
                    </button>
                  ))}
                </div>
                {regErrors.role && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.role}</p>}
              </div>

              {/* Terms */}
              <div>
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setRegField('terms', !reg.terms)}
                    className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      reg.terms ? 'bg-primary border-primary' : regErrors.terms ? 'border-error' : 'border-outline'
                    }`}
                  >
                    {reg.terms && <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '14px' }}>check</span>}
                  </button>
                  <label className="text-xs text-on-surface-variant leading-relaxed cursor-pointer" onClick={() => setRegField('terms', !reg.terms)}>
                    Tôi đồng ý với các <span className="text-primary font-semibold">Điều khoản sử dụng</span> và <span className="text-primary font-semibold">Chính sách bảo mật</span>.
                  </label>
                </div>
                {regErrors.terms && <p className="text-error text-xs mt-1.5 font-medium">{regErrors.terms}</p>}
              </div>

              {/* Submit */}
              {regApiError && (
                <p className="text-error text-sm font-medium text-center">{regApiError}</p>
              )}
              <button
                disabled={regLoading}
                className="w-full py-4 rounded-xl font-headline font-bold text-on-primary uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(45deg, #a83100, #ff784d)' }}
                type="submit"
              >
                {regLoading ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ NGAY'}
              </button>
            </form>
            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-surface-bright px-4 text-on-surface-variant">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>
            {/* Secondary Auth */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-colors font-label font-bold text-xs uppercase tracking-widest">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-colors font-label font-bold text-xs uppercase tracking-widest">
                <svg
                  className="w-4 h-4 fill-secondary"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                Facebook
              </button>
            </div>
            <footer className="text-center pt-6">
              <p className="text-on-surface-variant font-body text-sm">
                Đã có tài khoản?
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(true);
                  }}
                  className="text-primary font-bold hover:underline underline-offset-4 ml-1"
                >
                  Đăng nhập
                </button>
              </p>
            </footer>
          </div>
        </div>
      </main>

      {/* Global Footer from JSON - Styled as per System */}
      <footer className="bg-surface-container-low w-full py-12 border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto w-full gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline font-bold text-on-surface uppercase tracking-tighter text-lg">
              KINETIC
            </span>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60">
              © 2024 THE KINETIC EDITORIAL. PRECISION VELOCITY.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a
              className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Privacy
            </a>
            <a
              className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Terms
            </a>
            <a
              className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Assembly
            </a>
            <a
              className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
