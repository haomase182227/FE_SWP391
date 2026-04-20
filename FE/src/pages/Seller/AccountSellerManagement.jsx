// AccountSellerManagement — Edit Profile full-page view
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import { useAuth } from '../Context/AuthContext';

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
    <div className="bg-surface-container-lowest rounded-2xl border border-white shadow-[0_8px_32px_rgba(78,33,32,0.06)] p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h3 className="font-headline text-lg font-bold text-on-surface uppercase tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MsgBanner({ msg }) {
  if (!msg?.text) return null;
  return (
    <p className={`text-xs font-medium mt-2 ${msg.type === 'success' ? 'text-tertiary' : 'text-error'}`}>
      {msg.text}
    </p>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant/50 outline-none transition-all"
      />
    </div>
  );
}

export default function AccountSellerManagement() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const [fullName, setFullName]               = useState('');
  const [fullNameMsg, setFullNameMsg]         = useState({ type: '', text: '' });
  const [fullNameLoading, setFullNameLoading] = useState(false);

  const [emailForm, setEmailForm]             = useState({ currentPassword: '', newEmail: '' });
  const [emailMsg, setEmailMsg]               = useState({ type: '', text: '' });
  const [emailLoading, setEmailLoading]       = useState(false);

  const [phoneForm, setPhoneForm]             = useState({ currentPassword: '', newPhone: '' });
  const [phoneMsg, setPhoneMsg]               = useState({ type: '', text: '' });
  const [phoneLoading, setPhoneLoading]       = useState(false);

  const [pwForm, setPwForm]                   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg]                     = useState({ type: '', text: '' });
  const [pwLoading, setPwLoading]             = useState(false);

  function fetchProfile() {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/Auth/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setProfile(data.user);
        setFullName(data.user.fullName ?? '');
        setEmailForm(f => ({ ...f, newEmail: data.user.email ?? '' }));
        setPhoneForm(f => ({ ...f, newPhone: data.user.phone ?? '' }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchProfile(); }, [token]);

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

  function handleFullName(e) { e.preventDefault(); callApi('/Auth/users/me/fullname', { newFullName: fullName }, setFullNameMsg, setFullNameLoading); }
  function handleEmail(e) { e.preventDefault(); callApi('/Auth/users/me/email', emailForm, setEmailMsg, setEmailLoading); }
  function handlePhone(e) { e.preventDefault(); callApi('/Auth/users/me/phone', phoneForm, setPhoneMsg, setPhoneLoading); }
  function handlePassword(e) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg({ type: 'error', text: 'Mật khẩu mới không khớp.' }); return; }
    callApi('/Auth/users/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, setPwMsg, setPwLoading);
  }

  const initials = profile?.userName?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        merchantName={profile?.fullName || profile?.userName || 'Seller'}
        merchantSub="Profile Settings"
        bottomButton="Create Listing"
        onBottomButtonClick={() => navigate('/seller/listings')}
      />

      <main className="ml-64 min-h-screen p-10">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ── Account overview ── */}
          {!showEdit && (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Seller Portal</p>
                <h1 className="text-4xl font-bold tracking-tight font-headline">Account</h1>
                <p className="text-on-surface-variant mt-2">Manage your seller profile and preferences.</p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-8 flex items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center font-headline font-black text-2xl text-primary shrink-0">
                  {initials}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-headline">{profile?.fullName || profile?.userName || '...'}</h2>
                  <p className="text-on-surface-variant text-sm mt-1">{profile?.email} · <span className="font-bold text-primary">{profile?.role}</span></p>
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Số dư ví</p>
                      <p className="text-xl font-bold font-headline text-primary">{(profile?.wallet ?? 0).toLocaleString('vi-VN')}₫</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Số điện thoại</p>
                      <p className="text-xl font-bold font-headline">{profile?.phone || '—'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowEdit(true)}
                  className="px-6 py-3 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/5 transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: 'directions_bike', label: 'My Listings', to: '/seller/listings' },
                  { icon: 'shopping_cart', label: 'Orders', to: '/seller/orders' },
                  { icon: 'account_balance_wallet', label: 'Wallet', to: '/seller/wallet' },
                  { icon: 'verified', label: 'Inspections', to: '/seller/inspections' },
                ].map((item) => (
                  <button key={item.label} onClick={() => navigate(item.to)}
                    className="bg-surface-container-lowest rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-primary-container/5 transition-colors group">
                    <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Edit Profile (giống buyer /profile) ── */}
          {showEdit && (
            <>
              <div className="flex items-center gap-4">
                <button onClick={() => setShowEdit(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                </button>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-headline font-black text-2xl text-primary">
                  {initials}
                </div>
                <div>
                  <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface uppercase">
                    {profile?.fullName || profile?.userName || '...'}
                  </h1>
                  <p className="text-sm text-on-surface-variant">{profile?.email} · <span className="font-bold text-primary">{profile?.role}</span></p>
                </div>
              </div>

              {loading && (
                <div className="text-center py-16 text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>
                  Đang tải...
                </div>
              )}

              {!loading && profile && (
                <>
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

                  <SectionCard title="Cập nhật họ và tên" icon="badge">
                    <form onSubmit={handleFullName} className="space-y-4">
                      <InputField label="Họ và tên mới" value={fullName} onChange={setFullName} placeholder="Nguyễn Văn A" />
                      <MsgBanner msg={fullNameMsg} />
                      <button disabled={fullNameLoading} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60">
                        {fullNameLoading ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </form>
                  </SectionCard>

                  <SectionCard title="Đổi email" icon="mail">
                    <form onSubmit={handleEmail} className="space-y-4">
                      <InputField label="Mật khẩu hiện tại" type="password" value={emailForm.currentPassword} onChange={v => setEmailForm(f => ({ ...f, currentPassword: v }))} placeholder="••••••••" />
                      <InputField label="Email mới" type="email" value={emailForm.newEmail} onChange={v => setEmailForm(f => ({ ...f, newEmail: v }))} placeholder="new@email.com" />
                      <MsgBanner msg={emailMsg} />
                      <button disabled={emailLoading} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60">
                        {emailLoading ? 'Đang lưu...' : 'Cập nhật email'}
                      </button>
                    </form>
                  </SectionCard>

                  <SectionCard title="Đổi số điện thoại" icon="phone">
                    <form onSubmit={handlePhone} className="space-y-4">
                      <InputField label="Mật khẩu hiện tại" type="password" value={phoneForm.currentPassword} onChange={v => setPhoneForm(f => ({ ...f, currentPassword: v }))} placeholder="••••••••" />
                      <InputField label="Số điện thoại mới" type="tel" value={phoneForm.newPhone} onChange={v => setPhoneForm(f => ({ ...f, newPhone: v }))} placeholder="0912 345 678" />
                      <MsgBanner msg={phoneMsg} />
                      <button disabled={phoneLoading} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60">
                        {phoneLoading ? 'Đang lưu...' : 'Cập nhật số điện thoại'}
                      </button>
                    </form>
                  </SectionCard>

                  <SectionCard title="Đổi mật khẩu" icon="lock">
                    <form onSubmit={handlePassword} className="space-y-4">
                      <InputField label="Mật khẩu hiện tại" type="password" value={pwForm.currentPassword} onChange={v => setPwForm(f => ({ ...f, currentPassword: v }))} placeholder="••••••••" />
                      <InputField label="Mật khẩu mới" type="password" value={pwForm.newPassword} onChange={v => setPwForm(f => ({ ...f, newPassword: v }))} placeholder="••••••••" />
                      <InputField label="Nhập lại mật khẩu mới" type="password" value={pwForm.confirmPassword} onChange={v => setPwForm(f => ({ ...f, confirmPassword: v }))} placeholder="••••••••" />
                      <MsgBanner msg={pwMsg} />
                      <button disabled={pwLoading} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60">
                        {pwLoading ? 'Đang lưu...' : 'Đổi mật khẩu'}
                      </button>
                    </form>
                  </SectionCard>
                </>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
