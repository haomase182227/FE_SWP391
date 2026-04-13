import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('buyer@kinetic.vn');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleLoginSubmit(event) {
    event.preventDefault();
    setLoginError('');

    const result = login({
      email: loginEmail,
      password: loginPassword,
    });

    if (!result.success) {
      setLoginError(result.message);
      return;
    }

    navigate(result.redirectPath);
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
              <h1 className="font-headline text-7xl font-black italic tracking-tighter text-on-background leading-none">
                KINETIC<br />
                <span
                  className="text-primary italic"
                  style={{ textShadow: '0 0 20px rgba(168, 49, 0, 0.2)' }}
                >
                  EDITORIAL.
                </span>
              </h1>
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
              <h2 className="font-headline text-3xl font-black italic tracking-tighter text-primary">
                KINETIC
              </h2>
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
                    className="text-xs font-semibold text-secondary hover:underline transition-all"
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
              <div className="text-[11px] text-on-surface-variant bg-surface-container-low rounded-lg px-3 py-2 leading-relaxed">
                Tai khoan test: buyer@kinetic.vn, admin@kinetic.vn, inspector@kinetic.vn, seller@kinetic.vn. Mat khau: 123456.
              </div>
              {/* Submit Button */}
              <button
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest py-4 rounded-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                type="submit"
              >
                Bắt đầu hành trình
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
              <h1 className="font-headline font-black italic tracking-tighter text-6xl text-primary-fixed leading-none">
                KINETIC
              </h1>
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
            <h1 className="font-headline font-black italic tracking-tighter text-2xl text-primary">
              KINETIC
            </h1>
          </div>
          <div className="w-full max-w-md space-y-10">
            <header className="space-y-3">
              <h3 className="font-headline font-bold text-4xl tracking-tighter text-on-surface">
                Bắt đầu hành trình
              </h3>
              <p className="text-on-surface-variant font-body">
                Tham gia cộng đồng xe đạp chuyên nghiệp lớn nhất.
              </p>
            </header>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Username */}
                <div className="group">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                    Tên đăng nhập (Username)
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body"
                    placeholder="JohnDoe123"
                    type="text"
                  />
                </div>
                {/* Email */}
                <div className="group">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                    Email
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body"
                    placeholder="example@kinetic.com"
                    type="email"
                  />
                </div>
                {/* Phone */}
                <div className="group">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                    Số điện thoại (Phone)
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body"
                    placeholder="+84 000 000 000"
                    type="tel"
                  />
                </div>
                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                      Mật khẩu
                    </label>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                  <div className="group">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">
                      Nhập lại mật khẩu
                    </label>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant/50 font-body"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>
              </div>
              {/* Terms Checkbox (UX Enhancement) */}
              <div className="flex items-center space-x-3">
                <input
                  className="h-4 w-4 rounded border-outline-variant/40 text-primary focus:ring-primary/20"
                  id="terms"
                  type="checkbox"
                />
                <label className="text-xs text-on-surface-variant" htmlFor="terms">
                  Tôi đồng ý với các Điều khoản và Chính sách bảo mật.
                </label>
              </div>
              {/* CTA Primary */}
              <button
                className="w-full py-5 rounded-xl font-headline font-bold text-on-primary uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(45deg, #a83100, #ff784d)' }}
                type="submit"
              >
                ĐĂNG KÝ NGAY
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
