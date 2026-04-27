import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const PAGE_SIZE = 10;
const ROLES = ['Buyer', 'Seller', 'Inspector', 'Admin'];

/* ── Role badge config ──────────────────────────────────────── */
const ROLE_CFG = {
  Buyer:    { cls: 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-[0_2px_8px_rgba(99,102,241,0.2)]',   icon: 'person',      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: '0 2px 8px rgba(99,102,241,0.35)'  },
  Seller:   { cls: 'bg-amber-100 text-amber-700 border border-amber-200 shadow-[0_2px_8px_rgba(245,158,11,0.2)]',     icon: 'storefront',  gradient: 'linear-gradient(135deg,#b45309,#f59e0b)', glow: '0 2px 8px rgba(245,158,11,0.35)'  },
  Inspector:{ cls: 'bg-cyan-100 text-cyan-700 border border-cyan-200 shadow-[0_2px_8px_rgba(6,182,212,0.2)]',         icon: 'manage_search',gradient: 'linear-gradient(135deg,#0891b2,#06b6d4)', glow: '0 2px 8px rgba(6,182,212,0.35)'   },
  Admin:    { cls: 'bg-rose-100 text-rose-700 border border-rose-200 shadow-[0_2px_8px_rgba(244,63,94,0.2)]',         icon: 'shield',      gradient: 'linear-gradient(135deg,#4e2120,#9b3a38)', glow: '0 2px 8px rgba(78,33,32,0.35)'    },
};

function getInitials(name = '') { return name.slice(0, 2).toUpperCase(); }

export default function UserManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [users, setUsers]           = useState([]);
  const [totalRecords, setTotal]    = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const [roleModal, setRoleModal]       = useState(null);
  const [newRole, setNewRole]           = useState('');
  const [roleLoading, setRoleLoading]   = useState(false);
  const [roleError, setRoleError]       = useState('');

  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [activateLoading, setActivateLoading] = useState(null);

  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/Auth/users?pageNumber=${p}&pageSize=${PAGE_SIZE}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.totalRecords ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch { setError('Không thể tải danh sách người dùng.'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  function openRoleModal(user) {
    setRoleModal({ userId: user.id, userName: user.userName });
    setNewRole(user.roleName);
    setRoleError('');
  }

  async function handleChangeRole() {
    if (!newRole) return;
    setRoleLoading(true); setRoleError('');
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${roleModal.userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || `HTTP ${res.status}`); }
      setRoleModal(null); fetchUsers(page);
    } catch (e) { setRoleError(e.message); }
    finally { setRoleLoading(false); }
  }

  async function handleActivate(userId) {
    setActivateLoading(userId);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${userId}/activate`,
        { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchUsers(page);
    } catch { fetchUsers(page); }
    finally { setActivateLoading(null); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${deleteTarget.userId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteTarget(null);
      const newPage = users.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage); fetchUsers(newPage);
    } catch { fetchUsers(page); }
    finally { setDeleteLoading(false); }
  }

  function getPageNumbers() {
    const pages = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      <main className="ml-64 pt-8 px-8 pb-16 space-y-8">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 6px 20px rgba(78,33,32,0.4)' }}>
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>group</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-0.5">Admin Panel</p>
              <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none">User Directory</h1>
              <p className="text-sm text-on-surface-variant mt-1">Manage permissions, moderate accounts, and review platform activity.</p>
            </div>
          </div>
          {/* Total badge */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-rose-100 shadow-[0_4px_16px_rgba(78,33,32,0.08)]">
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>people</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Tổng người dùng</p>
              <p className="font-headline text-2xl font-black text-on-surface leading-none">{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(78,33,32,0.1)] border border-rose-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.06),rgba(78,33,32,0.03))', borderBottom: '2px solid rgba(78,33,32,0.08)' }}>
                  {[
                    { label: 'Người dùng',    center: false },
                    { label: 'Họ và tên',     center: false },
                    { label: 'Email',         center: false },
                    { label: 'Số điện thoại', center: false },
                    { label: 'Role',          center: true  },
                    { label: 'Wallet',        center: true  },
                    { label: 'Trạng thái',    center: true  },
                    { label: 'Hành động',     center: true  },
                  ].map(h => (
                    <th key={h.label}
                      className={`px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ${h.center ? 'text-center' : ''}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {loading && (
                  <tr><td colSpan={8} className="px-8 py-20 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-4xl block mx-auto mb-3 text-primary">progress_activity</span>
                    <span className="text-sm">Đang tải dữ liệu...</span>
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={8} className="px-8 py-20 text-center text-red-500 text-sm">{error}</td></tr>
                )}
                {!loading && !error && users.length === 0 && (
                  <tr><td colSpan={8} className="px-8 py-20 text-center text-on-surface-variant text-sm">Không có người dùng nào.</td></tr>
                )}
                {!loading && !error && users.map(user => {
                  const roleCfg = ROLE_CFG[user.roleName];
                  return (
                    <tr key={user.id}
                      className={`transition-colors duration-150 ${user.isDeleted ? 'opacity-50 grayscale' : ''}`}
                      onMouseEnter={e => { if (!user.isDeleted) e.currentTarget.style.background = 'rgba(78,33,32,0.025)'; }}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>

                      {/* Avatar + Username */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                            style={{ background: roleCfg?.gradient ?? 'linear-gradient(135deg,#64748b,#94a3b8)', boxShadow: roleCfg?.glow ?? 'none' }}>
                            {getInitials(user.userName)}
                          </div>
                          <p className="font-black text-sm text-on-surface">{user.userName}</p>
                        </div>
                      </td>

                      {/* Full Name */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-on-surface">{user.fullName || <span className="text-on-surface-variant/40">—</span>}</p>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        <p className="text-xs text-on-surface-variant">{user.phone || '—'}</p>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4 text-center">
                        {roleCfg ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${roleCfg.cls}`}>
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>{roleCfg.icon}</span>
                            {user.roleName}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                            {user.roleName}
                          </span>
                        )}
                      </td>

                      {/* Wallet */}
                      <td className="px-5 py-4 text-center">
                        <p className="font-black text-sm text-primary">
                          {(user.wallet ?? 0).toLocaleString('vi-VN')}₫
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        {user.isDeleted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>block</span>
                            Đã xóa
                          </span>
                        ) : user.isActive ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.2)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.2)]">
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>pause_circle</span>
                            Không HĐ
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openRoleModal(user)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-rose-50 transition-colors" title="Cấp role">
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">manage_accounts</span>
                          </button>
                          {user.isDeleted && (
                            <button onClick={() => handleActivate(user.id)} disabled={activateLoading === user.id}
                              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-emerald-50 transition-colors disabled:opacity-50" title="Kích hoạt lại">
                              {activateLoading === user.id
                                ? <span className="material-symbols-outlined text-emerald-600 text-lg animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-emerald-600 text-lg">restart_alt</span>}
                            </button>
                          )}
                          {!user.isDeleted && (
                            <button onClick={() => setDeleteTarget({ userId: user.id, userName: user.userName })}
                              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors" title="Xóa người dùng">
                              <span className="material-symbols-outlined text-red-500 text-lg">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ─────────────────────────────────── */}
          {!loading && totalPages >= 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-rose-100 bg-rose-50/40">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Trang {page} / {totalPages} · {totalRecords} người dùng
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 bg-white border border-rose-200 text-on-surface hover:bg-rose-50">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {getPageNumbers().map((p, i) =>
                  p === '...'
                    ? <span key={`e${i}`} className="px-1 text-on-surface-variant text-xs">...</span>
                    : <button key={p} onClick={() => setPage(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl font-black text-xs transition-all ${
                          page === p
                            ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(78,33,32,0.35)]'
                            : 'bg-white border border-rose-200 text-on-surface hover:bg-rose-50'
                        }`}>
                        {p}
                      </button>
                )}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 bg-white border border-rose-200 text-on-surface hover:bg-rose-50">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Role Modal ──────────────────────────────────────── */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 12px rgba(78,33,32,0.35)' }}>
                <span className="material-symbols-outlined text-white text-xl">manage_accounts</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-black text-on-surface">Cấp role</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  <span className="font-bold text-on-surface">{roleModal.userName}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {ROLES.map(r => {
                const cfg = ROLE_CFG[r];
                const isSelected = newRole === r;
                return (
                  <button key={r} onClick={() => setNewRole(r)}
                    className={`py-3 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 justify-center ${
                      isSelected
                        ? 'border-transparent text-white'
                        : 'border-rose-100 text-on-surface-variant hover:border-rose-200 bg-rose-50/50'
                    }`}
                    style={isSelected ? { background: cfg?.gradient, boxShadow: cfg?.glow } : {}}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>{cfg?.icon ?? 'person'}</span>
                    {r}
                  </button>
                );
              })}
            </div>

            {roleError && <p className="text-red-500 text-xs mb-4 font-medium">{roleError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setRoleModal(null)}
                className="flex-1 py-3 rounded-xl border border-rose-200 text-on-surface font-bold text-sm hover:bg-rose-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleChangeRole} disabled={roleLoading}
                className="flex-1 py-3 rounded-xl text-white font-black text-sm transition-all disabled:opacity-60 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 14px rgba(78,33,32,0.35)' }}>
                {roleLoading ? 'Đang lưu...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-rose-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 mx-auto">
              <span className="material-symbols-outlined text-red-500 text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>delete</span>
            </div>
            <h3 className="font-headline text-xl font-black text-on-surface mb-2">Xóa người dùng?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Bạn có chắc muốn xóa <span className="font-black text-on-surface">"{deleteTarget.userName}"</span>?<br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-rose-200 text-on-surface font-bold text-sm hover:bg-rose-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl text-white font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#7f1d1d,#dc2626)', boxShadow: '0 4px 12px rgba(220,38,38,0.35)' }}>
                {deleteLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
