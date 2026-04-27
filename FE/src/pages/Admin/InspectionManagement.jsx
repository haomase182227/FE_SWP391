import React, { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const PAGE_SIZE  = 5;
const FETCH_SIZE = 1000;

function getInitials(name = '') { return name.slice(0, 2).toUpperCase(); }

const EMPTY_FORM = { userName: '', fullName: '', email: '', phone: '', password: '', role: 'Inspector' };

const InspectionManagement = () => {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [allInspectors, setAllInspectors] = useState([]);
  const [totalRecords, setTotal]          = useState(0);
  const [totalPages, setTotalPages]       = useState(1);
  const [page, setPage]                   = useState(1);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');

  const inspectors = allInspectors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [showAdd, setShowAdd]               = useState(false);
  const [addForm, setAddForm]               = useState(EMPTY_FORM);
  const [addLoading, setAddLoading]         = useState(false);
  const [addError, setAddError]             = useState('');

  const [viewTarget, setViewTarget]         = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [deleteLoading, setDeleteLoading]   = useState(false);
  const [activateLoading, setActivateLoading] = useState(null);

  const fetchInspectors = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/Auth/users?pageNumber=1&pageSize=${FETCH_SIZE}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const filtered = (data.users ?? []).filter(u => u.roleName === 'Inspector');
      setAllInspectors(filtered);
      setTotal(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
    } catch { setError('Failed to load inspector list.'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchInspectors(); }, [fetchInspectors]);

  async function handleAdd(e) {
    e.preventDefault(); setAddLoading(true); setAddError('');
    try {
      const res = await fetch(`${API_BASE}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...addForm, role: 'Inspector' }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || `HTTP ${res.status}`); }
      setShowAdd(false); setAddForm(EMPTY_FORM); fetchInspectors();
    } catch (err) { setAddError(err.message); }
    finally { setAddLoading(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${deleteTarget.userId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteTarget(null);
      const remaining = allInspectors.length - 1;
      const newPage = page > Math.max(1, Math.ceil(remaining / PAGE_SIZE)) ? page - 1 : page;
      setPage(newPage); fetchInspectors();
    } catch { fetchInspectors(); }
    finally { setDeleteLoading(false); }
  }

  async function handleActivate(userId) {
    setActivateLoading(userId);
    try {
      const res = await fetch(`${API_BASE}/Auth/users/${userId}/activate`,
        { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchInspectors();
    } catch { fetchInspectors(); }
    finally { setActivateLoading(null); }
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

  /* ── Shared input style ─────────────────────────────────── */
  const inputCls = 'w-full px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-on-surface placeholder:text-rose-300 focus:outline-none focus:border-primary/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(78,33,32,0.08)] transition-all';

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      <main className="ml-64 pt-8 px-8 pb-16 space-y-10">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 6px 20px rgba(78,33,32,0.4)' }}>
              <span className="material-symbols-outlined text-white text-2xl">manage_search</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-0.5">Admin Panel</p>
              <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none">Inspection Management</h1>
              <p className="text-sm text-on-surface-variant mt-1">Manage inspector accounts and track inspected bikes.</p>
            </div>
          </div>
          <button
            onClick={() => { setShowAdd(true); setAddForm(EMPTY_FORM); setAddError(''); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(78,33,32,0.4)]"
            style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 14px rgba(78,33,32,0.35)' }}>
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Inspector
          </button>
        </div>

        {/* ── Inspector Accounts table ─────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
              <span className="material-symbols-outlined text-white text-lg">badge</span>
            </div>
            <div>
              <h3 className="font-headline text-xl font-black text-on-surface uppercase tracking-tight leading-none">Inspector Accounts</h3>
              <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
                {totalRecords} inspectors
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(78,33,32,0.1)] border border-rose-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.06),rgba(78,33,32,0.03))', borderBottom: '2px solid rgba(78,33,32,0.08)' }}>
                  {[
                    { label: 'Inspector', center: false },
                    { label: 'Name',      center: false },
                    { label: 'Status',    center: true  },
                    { label: 'Actions',   center: true  },
                  ].map(h => (
                    <th key={h.label}
                      className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ${h.center ? 'text-center' : ''}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {loading && (
                  <tr><td colSpan={4} className="px-6 py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2 text-primary">progress_activity</span>
                    <span className="text-sm">Loading...</span>
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={4} className="px-6 py-16 text-center text-red-500 text-sm">{error}</td></tr>
                )}
                {!loading && !error && inspectors.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-16 text-center text-on-surface-variant text-sm">No inspectors found.</td></tr>
                )}
                {!loading && !error && inspectors.map(user => (
                  <tr key={user.id}
                    className={`transition-colors duration-150 ${user.isDeleted ? 'opacity-50 grayscale' : ''}`}
                    onMouseEnter={e => { if (!user.isDeleted) e.currentTarget.style.background = 'rgba(78,33,32,0.025)'; }}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>

                    {/* Avatar + Username */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
                          {getInitials(user.userName)}
                        </div>
                        <div>
                          <p className="font-black text-sm text-on-surface">{user.userName}</p>
                          <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Full Name */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-on-surface">{user.fullName || '—'}</p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      {user.isDeleted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>block</span>
                          Deleted
                        </span>
                      ) : user.isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.2)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.2)]">
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>pause_circle</span>
                          Deactivated
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewTarget(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 transition-colors" title="View details">
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">visibility</span>
                        </button>
                        {user.isDeleted && (
                          <button onClick={() => handleActivate(user.id)} disabled={activateLoading === user.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 disabled:opacity-50">
                            {activateLoading === user.id
                              ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                              : <span className="material-symbols-outlined text-sm">restart_alt</span>}
                            Reactivate
                          </button>
                        )}
                        {!user.isDeleted && (
                          <button onClick={() => setDeleteTarget({ userId: user.id, userName: user.userName })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors" title="Delete inspector">
                            <span className="material-symbols-outlined text-red-500 text-lg">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-rose-100 bg-rose-50/40">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Page {page} / {totalPages}
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
        </section>
      </main>

      {/* ── Add Inspector Modal ──────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 12px rgba(78,33,32,0.35)' }}>
                <span className="material-symbols-outlined text-white text-xl">person_add</span>
              </div>
              <h3 className="font-headline text-xl font-black text-on-surface">Add Inspector</h3>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              {[
                { label: 'Username *',  key: 'userName', type: 'text',     placeholder: 'username',               required: true  },
                { label: 'Full Name',   key: 'fullName', type: 'text',     placeholder: 'John Doe',               required: false },
                { label: 'Email *',     key: 'email',    type: 'email',    placeholder: 'inspector@example.com',  required: true  },
                { label: 'Phone',       key: 'phone',    type: 'text',     placeholder: '+84 xxx xxx xxx',        required: false },
                { label: 'Password *',  key: 'password', type: 'password', placeholder: '••••••••',               required: true  },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">{f.label}</label>
                  <input required={f.required} type={f.type} placeholder={f.placeholder}
                    value={addForm[f.key]}
                    onChange={e => setAddForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">Role</label>
                <input readOnly value="Inspector"
                  className="w-full px-4 py-3 rounded-xl bg-rose-50/50 border border-rose-100 text-sm text-on-surface-variant cursor-not-allowed" />
              </div>
              {addError && <p className="text-red-500 text-xs font-medium">{addError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl border border-rose-200 text-on-surface font-bold text-sm hover:bg-rose-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading}
                  className="flex-1 py-3 rounded-xl text-white font-black text-sm transition-all disabled:opacity-60 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)' }}>
                  {addLoading ? 'Adding...' : 'Add Inspector'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Inspector Modal ─────────────────────────────── */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-rose-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                {getInitials(viewTarget.userName)}
              </div>
              <div>
                <p className="font-headline text-lg font-black text-on-surface">{viewTarget.userName}</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-black uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>badge</span>
                  Inspector
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: viewTarget.fullName || '—' },
                { label: 'Email',     value: viewTarget.email },
                { label: 'Phone',     value: viewTarget.phone || '—' },
                { label: 'Status',    value: viewTarget.isDeleted ? 'Deleted' : viewTarget.isActive ? 'Active' : 'Deactivated' },
                { label: 'Wallet',    value: `${(viewTarget.wallet ?? 0).toLocaleString('vi-VN')} ₫` },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{row.label}</span>
                  <span className="text-sm font-bold text-on-surface">{row.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setViewTarget(null)}
              className="mt-6 w-full py-3 rounded-xl border border-rose-200 text-on-surface font-bold text-sm hover:bg-rose-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-rose-100">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 mx-auto">
              <span className="material-symbols-outlined text-red-500 text-3xl">delete</span>
            </div>
            <h3 className="font-headline text-xl font-black text-on-surface mb-2 text-center">Delete Inspector?</h3>
            <p className="text-sm text-on-surface-variant mb-6 text-center">
              Are you sure you want to delete <span className="font-black text-on-surface">"{deleteTarget.userName}"</span>?<br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-rose-200 text-on-surface font-bold text-sm hover:bg-rose-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-[0_4px_12px_rgba(239,68,68,0.35)]">
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
