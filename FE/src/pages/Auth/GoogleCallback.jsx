import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Backend redirect về: /auth/google/callback?token=xxx&role=xxx&email=xxx&userName=xxx
export default function GoogleCallback() {
  const navigate = useNavigate();
  const { saveUser, getRedirectPathByRole } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token    = params.get('token');
    const role     = params.get('role');
    const email    = params.get('email');
    const userName = params.get('userName') || params.get('username');
    const id       = params.get('id');

    if (token) {
      const user = { id, email, role: role ?? 'Buyer', name: userName ?? email, token };
      saveUser(user);
      navigate(getRedirectPathByRole(role ?? 'Buyer'), { replace: true });
    } else {
      // Không có token → về trang auth báo lỗi
      navigate('/auth?error=google_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-body">
      <div className="text-center space-y-3">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary block mx-auto">progress_activity</span>
        <p className="text-on-surface-variant text-sm">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
