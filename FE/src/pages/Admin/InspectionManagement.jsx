import React, { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const PAGE_SIZE = 5;       // rows per page (client-side)
const FETCH_SIZE = 1000;   // fetch all users at once then filter

function getInitials(name = '') {
  return name.slice(0, 2).toUpperCase();
}

const EMPTY_FORM = {
  userName: '',
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: 'Inspector',
};

const InspectionManagement = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  // Inspector Accounts state — all inspectors fetched, paginated client-side
  const [allInspectors, setAllInspectors]   = useState([]);   // full filtered list
  const [totalRecords, setTotal]            = useState(0);
  const [totalPages, setTotalPages]         = useState(1);
  const [page, setPage]                     = useState(1);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');

  // Derived: slice for current page
  const inspectors = allInspectors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Add modal
  const [showAdd, setShowAdd]               = useState(false);
  const [addForm, setAddForm]               = useState(EMPTY_FORM);
  const [addLoading, setAddLoading]         = useState(false);
  const [addError, setAddError]             = useState('');

  // View modal
  const [viewTarget, setViewTarget]         = useState(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [deleteLoading, setDeleteLoading]   = useState(false);

  // Activate
  const [activateLoading, setActivateLoading] = useState(null);

  // Fetch ALL users, filter inspectors client-side, compute pagination
  const fetchInspectors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API_BASE}/Auth/users?pageNumber=1&pageSize=${FETCH_SIZE}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const filtered = (data.users ?? []).filter(u => u.roleName === 'Inspector');
      setAllInspectors(filtered);
      setTotal(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
    } catch {
      setError('Failed to load inspector list.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchInspectors(); }, [fetchInspectors]);

  // Add Inspector
  async function handleAdd(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const res = await fetch(`${API_BASE}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...addForm, role: 'Inspector' }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      setShowAdd(false);
      setAddForm(EMPTY_FORM);
      fetchInspectors();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  }

  // Delete Inspector
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
      // if last item on current page, go back one page
      const remaining = allInspectors.length - 1;
      const newPage = page > Math.max(1, Math.ceil(remaining / PAGE_SIZE)) ? page - 1 : page;
      setPage(newPage);
      fetchInspectors();
    } catch {
      fetchInspectors();
    } finally {
      setDeleteLoading(false);
    }
  }

  // Activate Inspector
  async function handleActivate(userId) {
    setActivateLoading(userId);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${userId}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchInspectors();
    } catch {
      fetchInspectors();
    } finally {
      setActivateLoading(null);
    }
  }

  // Pagination helpers
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
      <AdminTopBar title="Inspector Directory" searchPlaceholder="Search Inspector ID or Task..." />

      <main className="ml-64 pt-16 p-10 space-y-12 min-h-screen">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-headline text-4xl font-black text-on-surface tracking-tighter uppercase mb-2">
              Inspection Management
            </h2>
            <p className="text-on-surface-variant font-body">
              Manage inspector accounts and track inspected bikes.
            </p>
          </div>
          <button
            onClick={() => { setShowAdd(true); setAddForm(EMPTY_FORM); setAddError(''); }}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Inspector
          </button>
        </div>

        {/* Table 1: Inspector Accounts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tight">
              Inspector Accounts
            </h3>
            <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">
              Total: <span className="font-bold text-on-surface">{totalRecords}</span>
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Inspector</th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Name</th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Status</th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-on-surface-variant text-sm">
                        <span className="material-symbols-outlined animate-spin text-2xl block mx-auto mb-2">progress_activity</span>
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loading && error && (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-error text-sm">{error}</td>
                    </tr>
                  )}
                  {!loading && !error && inspectors.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-on-surface-variant text-sm">
                        No inspectors found.
                      </td>
                    </tr>
                  )}
                  {!loading && inspectors.map((user) => (
                    <tr key={user.id} className={`transition-colors ${user.isDeleted ? 'opacity-40 grayscale bg-surface-container-low/30' : 'hover:bg-primary-container/5'}`}>
                      {/* Avatar + Username */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center font-headline font-bold text-sm text-orange-600 flex-shrink-0">
                            {getInitials(user.userName)}
                          </div>
                          <p className="font-headline text-sm font-bold text-on-surface">{user.userName}</p>
                        </div>
                      </td>
                      {/* Full Name */}
                      <td className="px-8 py-5">
                        <p className="text-xs text-on-surface">{user.fullName || '—'}</p>
                      </td>
                      {/* Status */}
                      <td className="px-8 py-5">
                        {user.isDeleted
                          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-tighter">Deleted</span>
                          : user.isActive
                            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-tighter">Active</span>
                            : <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-tighter">Inactive</span>
                        }
                      </td>
                      {/* Actions */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          <button
                            onClick={() => setViewTarget(user)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
                            title="View details"
                          >
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">visibility</span>
                          </button>
                          {/* Reactivate (only when deleted) */}
                          {user.isDeleted && (
                            <button
                              onClick={() => handleActivate(user.id)}
                              disabled={activateLoading === user.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary text-on-tertiary hover:opacity-90 transition-opacity disabled:opacity-50 text-[10px] font-bold uppercase tracking-widest shadow-sm"
                              title="Reactivate account"
                            >
                              {activateLoading === user.id
                                ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-sm">restart_alt</span>
                              }
                              Reactivate
                            </button>
                          )}
                          {/* Delete (only when not deleted) */}
                          {!user.isDeleted && (
                            <button
                              onClick={() => setDeleteTarget({ userId: user.id, userName: user.userName })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 transition-colors"
                              title="Delete inspector"
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
                  Page {page} / {totalPages}
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
        </section>

        {/* Table 2: Inspected Bikes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tight">
              Inspected Bikes
            </h3>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Bike</th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Inspector</th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Inspection Date</th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Result</th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-on-surface-variant text-sm">
                      No inspected bikes yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      {/* Add Inspector Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/40">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Add Inspector</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Username *</label>
                <input
                  required
                  value={addForm.userName}
                  onChange={e => setAddForm(f => ({ ...f, userName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Full Name</label>
                <input
                  value={addForm.fullName}
                  onChange={e => setAddForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                  placeholder="inspector@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Phone</label>
                <input
                  value={addForm.phone}
                  onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Password *</label>
                <input
                  required
                  type="password"
                  value={addForm.password}
                  onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Role</label>
                <input
                  readOnly
                  value="Inspector"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 text-sm text-on-surface-variant cursor-not-allowed"
                />
              </div>
              {addError && <p className="text-error text-xs">{addError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {addLoading ? 'Adding...' : 'Add Inspector'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Inspector Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center font-headline font-bold text-xl text-orange-600">
                {getInitials(viewTarget.userName)}
              </div>
              <div>
                <p className="font-headline text-lg font-bold text-on-surface">{viewTarget.userName}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-tighter">
                  Inspector
                </span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-label uppercase text-[10px] tracking-widest">Full Name</span>
                <span className="font-medium text-on-surface">{viewTarget.fullName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-label uppercase text-[10px] tracking-widest">Email</span>
                <span className="font-medium text-on-surface">{viewTarget.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-label uppercase text-[10px] tracking-widest">Phone</span>
                <span className="font-medium text-on-surface">{viewTarget.phone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-label uppercase text-[10px] tracking-widest">Status</span>
                <span className="font-medium text-on-surface">
                  {viewTarget.isDeleted ? 'Deleted' : viewTarget.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-label uppercase text-[10px] tracking-widest">Wallet</span>
                <span className="font-medium text-on-surface">{(viewTarget.wallet ?? 0).toLocaleString('en-US')} ₫</span>
              </div>
            </div>
            <button
              onClick={() => setViewTarget(null)}
              className="mt-6 w-full py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-error text-2xl">delete</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Delete Inspector?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Are you sure you want to delete <span className="font-bold text-on-surface">{deleteTarget.userName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InspectionManagement;
