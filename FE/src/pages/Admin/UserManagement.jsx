import React, { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const PAGE_SIZE = 10;

const ROLES = ['Buyer', 'Seller', 'Inspector', 'Admin'];

const ROLE_BADGE = {
  Buyer:    'bg-surface-container-high text-on-surface-variant',
  Seller:   'bg-secondary text-on-secondary',
  Inspector:'bg-orange-500/10 text-orange-600',
  Admin:    'bg-zinc-800 text-white',
};

function getInitials(name = '') {
  return name.slice(0, 2).toUpperCase();
}

export default function UserManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [users, setUsers]           = useState([]);
  const [totalRecords, setTotal]    = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  // Role modal
  const [roleModal, setRoleModal]   = useState(null); // { userId, currentRole }
  const [newRole, setNewRole]       = useState('');
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError]   = useState('');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null); // { userId, userName }
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Activate
  const [activateLoading, setActivateLoading] = useState(null); // userId đang loading

  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API_BASE}/Auth/users?pageNumber=${p}&pageSize=${PAGE_SIZE}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.totalRecords ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  // ── Change Role ──────────────────────────────────────────────
  function openRoleModal(user) {
    setRoleModal({ userId: user.id, userName: user.userName });
    setNewRole(user.roleName);
    setRoleError('');
  }

  async function handleChangeRole() {
    if (!newRole) return;
    setRoleLoading(true);
    setRoleError('');
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${roleModal.userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      setRoleModal(null);
      fetchUsers(page);
    } catch (e) {
      setRoleError(e.message);
    } finally {
      setRoleLoading(false);
    }
  }

  // ── Activate User ────────────────────────────────────────────
  async function handleActivate(userId) {
    setActivateLoading(userId);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${userId}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchUsers(page);
    } catch {
      // refetch để đồng bộ
      fetchUsers(page);
    } finally {
      setActivateLoading(null);
    }
  }

  // ── Delete User ──────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${deleteTarget.userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteTarget(null);
      // nếu xóa hết trang hiện tại thì lùi 1 trang
      const newPage = users.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      fetchUsers(newPage);
    } catch {
      // vẫn refetch để đồng bộ
      fetchUsers(page);
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Pagination helpers ───────────────────────────────────────
  function getPageNumbers() {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />
      <AdminTopBar title="User Directory" searchPlaceholder="Search users..." />

      <main className="ml-64 pt-16 p-10 space-y-8 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-headline text-4xl font-black text-on-surface tracking-tighter uppercase mb-2">
              User Directory
            </h2>
            <p className="text-on-surface-variant font-body">
              Manage permissions, moderate accounts, and review platform activity.
            </p>
          </div>
          <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">
            Tổng: <span className="font-bold text-on-surface">{totalRecords}</span> người dùng
          </p>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Người dùng</th>
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Họ và tên</th>
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Email</th>
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Số điện thoại</th>
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Role</th>
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Wallet</th>
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Trạng thái</th>
                  <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-8 py-16 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined animate-spin text-2xl block mx-auto mb-2">progress_activity</span>
                      Đang tải...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={8} className="px-8 py-16 text-center text-error text-sm">{error}</td>
                  </tr>
                )}
                {!loading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-8 py-16 text-center text-on-surface-variant text-sm">Không có người dùng nào.</td>
                  </tr>
                )}
                {!loading && users.map((user) => (
                  <tr key={user.id} className={`hover:bg-primary-container/5 transition-colors ${user.isDeleted ? 'opacity-50 grayscale' : ''}`}>
                    {/* Avatar + Name */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline font-bold text-sm text-on-surface-variant flex-shrink-0">
                          {getInitials(user.userName)}
                        </div>
                        <p className="font-headline text-sm font-bold text-on-surface">{user.userName}</p>
                      </div>
                    </td>
                    {/* Full Name */}
                    <td className="px-8 py-5">
                      <p className="text-xs text-on-surface">{user.fullName || <span className="text-outline-variant">—</span>}</p>
                    </td>
                    {/* Email */}
                    <td className="px-8 py-5">
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </td>
                    {/* Phone */}
                    <td className="px-8 py-5">
                      <p className="text-xs text-on-surface-variant">{user.phone || '—'}</p>
                    </td>
                    {/* Role */}
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${ROLE_BADGE[user.roleName] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                        {user.roleName}
                      </span>
                    </td>
                    {/* Wallet */}
                    <td className="px-8 py-5">
                      <p className="font-headline text-sm font-bold text-on-surface">
                        {(user.wallet ?? 0).toLocaleString('vi-VN')}₫
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-8 py-5">
                      {user.isDeleted
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-tighter">Đã xóa</span>
                        : user.isActive
                          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-tighter">Hoạt động</span>
                          : <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-tighter">Không hoạt động</span>
                      }
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Cấp role */}
                        <button
                          onClick={() => openRoleModal(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
                          title="Cấp role"
                        >
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">manage_accounts</span>
                        </button>
                        {/* Activate (chỉ hiện khi isDeleted) */}
                        {user.isDeleted && (
                          <button
                            onClick={() => handleActivate(user.id)}
                            disabled={activateLoading === user.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-tertiary/10 transition-colors disabled:opacity-50"
                            title="Kích hoạt lại"
                          >
                            {activateLoading === user.id
                              ? <span className="material-symbols-outlined text-tertiary text-lg animate-spin">progress_activity</span>
                              : <span className="material-symbols-outlined text-tertiary text-lg">restart_alt</span>
                            }
                          </button>
                        )}
                        {/* Xóa (chỉ hiện khi chưa bị xóa) */}
                        {!user.isDeleted && (
                          <button
                            onClick={() => setDeleteTarget({ userId: user.id, userName: user.userName })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 transition-colors"
                            title="Xóa người dùng"
                          >
                            <span className="material-symbols-outlined text-error text-lg">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-8 py-5 border-t border-surface-container-low flex items-center justify-between">
              <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">
                Trang {page} / {totalPages} — {totalRecords} người dùng
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {getPageNumbers().map((p, i) =>
                  p === '...'
                    ? <span key={`ellipsis-${i}`} className="px-2 text-on-surface-variant">...</span>
                    : <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${page === p ? 'bg-primary text-on-primary' : 'border border-outline-variant/20 hover:bg-surface-container-low'}`}
                      >
                        {p}
                      </button>
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Role Modal ── */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Cấp role</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Người dùng: <span className="font-bold text-on-surface">{roleModal.userName}</span>
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setNewRole(r)}
                  className={`py-3 rounded-xl border-2 font-label font-bold text-xs uppercase tracking-widest transition-all ${newRole === r ? 'border-primary bg-primary/5 text-primary' : 'border-surface-container-high text-on-surface-variant hover:border-outline'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            {roleError && <p className="text-error text-xs mb-4">{roleError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setRoleModal(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleChangeRole}
                disabled={roleLoading}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {roleLoading ? 'Đang lưu...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-error text-2xl">delete</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Xóa người dùng?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Bạn có chắc muốn xóa <span className="font-bold text-on-surface">{deleteTarget.userName}</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {deleteLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
