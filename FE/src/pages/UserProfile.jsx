import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

const API_BASE = '/api/v1';

function Field({ label, value }) {
  return (
    <div>
      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
      <p className="text-sm font-medium text-on-surface">{value || <span className="text-outline-variant italic">Chưa cập nhật</span>}</p>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-orange-600">{icon}</span>
        <h3 className="font-headline text-lg font-bold text-orange-600 uppercase tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MsgBanner({ msg }) {
  if (!msg.text) return null;
  return (
    <p className={`text-xs font-medium mt-2 ${msg.type === 'success' ? 'text-tertiary' : 'text-error'}`}>
      {msg.text}
    </p>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="block font-label text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
      />
    </div>
  );
}

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const token = currentUser?.token;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Fullname form
  const [fullName, setFullName] = useState('');
  const [fullNameLoading, setFullNameLoading] = useState(false);
  const [fullNameMsg, setFullNameMsg] = useState({ type: '', text: '' });

  // Email form
  const [emailForm, setEmailForm] = useState({ currentPassword: '', newEmail: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ type: '', text: '' });

  // Phone form
  const [phoneForm, setPhoneForm] = useState({ currentPassword: '', newPhone: '' });
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState({ type: '', text: '' });

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  // Delete account confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }
    fetchProfile();
  }, [token]);

  async function fetchProfile() {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${API_BASE}/Auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProfile(data.user);
      setFullName(data.user.fullName ?? '');
      setEmailForm(f => ({ ...f, newEmail: data.user.email }));
      setPhoneForm(f => ({ ...f, newPhone: data.user.phone ?? '' }));
    } catch {
      setFetchError('Không thể tải thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  async function callApi(url, body, setMsg, setLoad) {
    setLoad(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      setMsg({ type: 'success', text: data.message || 'Cập nhật thành công.' });
      fetchProfile();
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setLoad(false);
    }
  }

  function handleFullName(e) {
    e.preventDefault();
    callApi('/Auth/users/me/fullname', { newFullName: fullName }, setFullNameMsg, setFullNameLoading);
  }

  function handleEmail(e) {
    e.preventDefault();
    callApi('/Auth/users/me/email', emailForm, setEmailMsg, setEmailLoading);
  }

  function handlePhone(e) {
    e.preventDefault();
    callApi('/Auth/users/me/phone', phoneForm, setPhoneMsg, setPhoneLoading);
  }

  function handlePassword(e) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Mật khẩu mới không khớp.' });
      return;
    }
    callApi('/Auth/users/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, setPwMsg, setPwLoading);
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      logout();
      navigate('/');
    } catch {
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen antialiased">
      <main className="pt-24 pb-16 px-6 max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-headline font-black text-3xl text-white shadow-lg shadow-orange-500/30">
            {profile?.userName?.slice(0, 2).toUpperCase() ?? '??'}
          </div>
          <div>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-gray-900 uppercase">
              {profile?.fullName || profile?.userName || '...'}
            </h1>
            <p className="text-sm text-gray-600">{profile?.email} · <span className="font-bold text-orange-600">{profile?.role}</span></p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>
            Đang tải...
          </div>
        )}

        {fetchError && <p className="text-error text-sm">{fetchError}</p>}

        {!loading && profile && (
          <>
            {/* Thông tin tổng quan */}
            <SectionCard title="Thông tin tài khoản" icon="person">
              <div className="grid grid-cols-2 gap-6">
                <Field label="Tên đăng nhập" value={profile.userName} />
                <Field label="Họ và tên" value={profile.fullName} />
                <Field label="Email" value={profile.email} />
                <Field label="Số điện thoại" value={profile.phone} />
                <Field label="Vai trò" value={profile.role} />
                <Field label="Số dư ví" value={`${(profile.wallet ?? 0).toLocaleString('vi-VN')}₫`} />
              </div>
            </SectionCard>

            {/* Cập nhật họ tên */}
            <SectionCard title="Cập nhật họ và tên" icon="badge">
              <form onSubmit={handleFullName} className="space-y-4">
                <InputField label="Họ và tên mới" value={fullName} onChange={setFullName} placeholder="Nguyễn Văn A" />
                <MsgBanner msg={fullNameMsg} />
                <button disabled={fullNameLoading} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-60 shadow-lg shadow-orange-500/30">
                  {fullNameLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            </SectionCard>

            {/* Đổi email */}
            <SectionCard title="Đổi email" icon="mail">
              <form onSubmit={handleEmail} className="space-y-4">
                <InputField label="Mật khẩu hiện tại" type="password" value={emailForm.currentPassword} onChange={v => setEmailForm(f => ({ ...f, currentPassword: v }))} placeholder="••••••••" />
                <InputField label="Email mới" type="email" value={emailForm.newEmail} onChange={v => setEmailForm(f => ({ ...f, newEmail: v }))} placeholder="new@email.com" />
                <MsgBanner msg={emailMsg} />
                <button disabled={emailLoading} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-60 shadow-lg shadow-orange-500/30">
                  {emailLoading ? 'Đang lưu...' : 'Cập nhật email'}
                </button>
              </form>
            </SectionCard>

            {/* Đổi số điện thoại */}
            <SectionCard title="Đổi số điện thoại" icon="phone">
              <form onSubmit={handlePhone} className="space-y-4">
                <InputField label="Mật khẩu hiện tại" type="password" value={phoneForm.currentPassword} onChange={v => setPhoneForm(f => ({ ...f, currentPassword: v }))} placeholder="••••••••" />
                <InputField label="Số điện thoại mới" type="tel" value={phoneForm.newPhone} onChange={v => setPhoneForm(f => ({ ...f, newPhone: v }))} placeholder="0912 345 678" />
                <MsgBanner msg={phoneMsg} />
                <button disabled={phoneLoading} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-60 shadow-lg shadow-orange-500/30">
                  {phoneLoading ? 'Đang lưu...' : 'Cập nhật số điện thoại'}
                </button>
              </form>
            </SectionCard>

            {/* Đổi mật khẩu */}
            <SectionCard title="Đổi mật khẩu" icon="lock">
              <form onSubmit={handlePassword} className="space-y-4">
                <InputField label="Mật khẩu hiện tại" type="password" value={pwForm.currentPassword} onChange={v => setPwForm(f => ({ ...f, currentPassword: v }))} placeholder="••••••••" />
                <InputField label="Mật khẩu mới" type="password" value={pwForm.newPassword} onChange={v => setPwForm(f => ({ ...f, newPassword: v }))} placeholder="••••••••" />
                <InputField label="Nhập lại mật khẩu mới" type="password" value={pwForm.confirmPassword} onChange={v => setPwForm(f => ({ ...f, confirmPassword: v }))} placeholder="••••••••" />
                <MsgBanner msg={pwMsg} />
                <button disabled={pwLoading} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-60 shadow-lg shadow-orange-500/30">
                  {pwLoading ? 'Đang lưu...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </SectionCard>

            {/* Xóa tài khoản */}
            <SectionCard title="Xóa tài khoản" icon="warning">
              <p className="text-sm text-on-surface-variant mb-4">Hành động này không thể hoàn tác. Tài khoản của bạn sẽ bị vô hiệu hóa.</p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-error text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Xóa tài khoản
              </button>
            </SectionCard>
          </>
        )}
      </main>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-error text-2xl">warning</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Xóa tài khoản?</h3>
            <p className="text-sm text-on-surface-variant mb-6">Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading} className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 disabled:opacity-60">
                {deleteLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
