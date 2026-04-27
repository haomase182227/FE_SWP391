import { useCallback, useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const PENDING_PAGE_SIZE = 5;
const ALL_PAGE_SIZE = 10;

const STATUS_BADGE = {
  Pending:           'bg-amber-400/20 text-amber-700 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.25)]',
  Approved:          'bg-emerald-500/20 text-emerald-700 border border-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.25)]',
  Rejected:          'bg-red-500/20 text-red-700 border border-red-400/40 shadow-[0_0_8px_rgba(239,68,68,0.25)]',
  Sold:              'bg-purple-500/20 text-purple-700 border border-purple-400/40 shadow-[0_0_8px_rgba(139,92,246,0.25)]',
  PendingInspection: 'bg-blue-500/20 text-blue-700 border border-blue-400/40 shadow-[0_0_8px_rgba(59,130,246,0.25)]',
};

function formatPrice(p) {
  return (p ?? 0).toLocaleString('vi-VN') + '₫';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ── Reusable table pagination ────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
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
  return (
    <div className="px-8 py-5 border-t border-surface-container-low flex items-center justify-between">
      <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">
        Trang {page} / {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(p => Math.max(1, p - 1))} disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low disabled:opacity-40 transition-colors">
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        {pages.map((p, i) => p === '...'
          ? <span key={`e${i}`} className="px-1 text-on-surface-variant text-xs">...</span>
          : <button key={p} onClick={() => onChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${page === p ? 'bg-primary text-on-primary' : 'border border-outline-variant/20 hover:bg-surface-container-low'}`}>
              {p}
            </button>
        )}
        <button onClick={() => onChange(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low disabled:opacity-40 transition-colors">
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
export default function ListingModeration() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  // ── Pending table ────────────────────────────────────────────
  const [pending, setPending]         = useState([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pendingPages, setPendingPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingLoading, setPendingLoading] = useState(false);

  // ── All listings table ───────────────────────────────────────
  const [all, setAll]           = useState([]);
  const [allTotal, setAllTotal] = useState(0);
  const [allPages, setAllPages] = useState(1);
  const [allPage, setAllPage]   = useState(1);
  const [allLoading, setAllLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Approved');

  // ── Detail modal ─────────────────────────────────────────────
  const [detail, setDetail]         = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Action modal (approve / reject / approve-with-inspection) ─
  const [actionModal, setActionModal] = useState(null);
  // { listingId, type: 'approve'|'reject'|'inspection', title }
  const [actionNote, setActionNote]   = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // ── Delete rejected modal ────────────────────────────────────
  const [deleteTarget, setDeleteTarget]   = useState(null); // { id, title }
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Mark sold modal ──────────────────────────────────────────
  const [soldTarget, setSoldTarget]   = useState(null); // { id, title }
  const [soldLoading, setSoldLoading] = useState(false);
  const [soldError, setSoldError]     = useState('');

  // ── Bike Categories ───────────────────────────────────────────
  const [categories, setCategories]         = useState([]);
  const [catLoading, setCatLoading]         = useState(false);
  const [catError, setCatError]             = useState('');

  // Create modal
  const [showCatCreate, setShowCatCreate]   = useState(false);
  const [catCreateName, setCatCreateName]   = useState('');
  const [catCreateDesc, setCatCreateDesc]   = useState('');
  const [catCreateLoading, setCatCreateLoading] = useState(false);
  const [catCreateError, setCatCreateError] = useState('');

  // Edit modal
  const [catEdit, setCatEdit]               = useState(null); // { id, name, description }
  const [catEditLoading, setCatEditLoading] = useState(false);
  const [catEditError, setCatEditError]     = useState('');

  // Delete modal
  const [catDelete, setCatDelete]           = useState(null); // { id, name }
  const [catDeleteLoading, setCatDeleteLoading] = useState(false);

  // Detail modal
  const [catDetail, setCatDetail]           = useState(null);
  const [catDetailLoading, setCatDetailLoading] = useState(false);

  // ── Fetch pending ────────────────────────────────────────────
  const fetchPending = useCallback(async (p = 1) => {
    setPendingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/listings/pending?page=${p}&pageSize=${PENDING_PAGE_SIZE}`,
        { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      // pending endpoint trả về array hoặc object tuỳ backend
      if (Array.isArray(data)) {
        setPending(data); setPendingTotal(data.length); setPendingPages(1);
      } else {
        setPending(data.items ?? data.listings ?? []);
        setPendingTotal(data.totalCount ?? data.totalRecords ?? 0);
        setPendingPages(data.totalPages ?? 1);
      }
    } catch { setPending([]); }
    finally { setPendingLoading(false); }
  }, [token]);

  // ── Fetch all (chỉ Approved + Rejected) ─────────────────────
  const fetchAll = useCallback(async (p = 1, status = 'Approved') => {
    setAllLoading(true);
    try {
      if (status === '__all__') {
        // fetch cả Approved, Rejected và Sold rồi merge
        const [r1, r2, r3] = await Promise.all([
          fetch(`${API_BASE}/admin/listings?page=${p}&pageSize=${ALL_PAGE_SIZE}&status=Approved`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/admin/listings?page=${p}&pageSize=${ALL_PAGE_SIZE}&status=Rejected`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/admin/listings?page=${p}&pageSize=${ALL_PAGE_SIZE}&status=Sold`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [d1, d2, d3] = await Promise.all([r1.json(), r2.json(), r3.json()]);
        const items = [...(d1.items ?? []), ...(d2.items ?? []), ...(d3.items ?? [])];
        const total = (d1.totalCount ?? 0) + (d2.totalCount ?? 0) + (d3.totalCount ?? 0);
        const pages = Math.max(d1.totalPages ?? 1, d2.totalPages ?? 1, d3.totalPages ?? 1);
        setAll(items);
        setAllTotal(total);
        setAllPages(pages);
      } else {
        const qs = new URLSearchParams({ page: p, pageSize: ALL_PAGE_SIZE, status });
        const res = await fetch(`${API_BASE}/admin/listings?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setAll(data.items ?? data.listings ?? []);
        setAllTotal(data.totalCount ?? data.totalRecords ?? 0);
        setAllPages(data.totalPages ?? 1);
      }
    } catch { setAll([]); }
    finally { setAllLoading(false); }
  }, [token]);

  useEffect(() => { fetchPending(pendingPage); }, [pendingPage, fetchPending]);
  useEffect(() => { fetchAll(allPage, filterStatus); }, [allPage, filterStatus, fetchAll]);

  // ── Open detail ──────────────────────────────────────────────
  async function openDetail(listingId) {
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`${API_BASE}/admin/listings/${listingId}/detail`,
        { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDetail(data);
    } catch { setDetail(null); }
    finally { setDetailLoading(false); }
  }

  // ── Submit action ────────────────────────────────────────────
  async function submitAction() {
    if (!actionModal) return;
    setActionLoading(true);
    setActionError('');
    const { listingId, type } = actionModal;
    const url = type === 'approve'
      ? `${API_BASE}/admin/listings/${listingId}/approve`
      : type === 'reject'
        ? `${API_BASE}/admin/listings/${listingId}/reject`
        : `${API_BASE}/admin/listings/${listingId}/approve-with-inspection`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(actionNote),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      setActionModal(null);
      setActionNote('');
      fetchPending(pendingPage);
      fetchAll(allPage, filterStatus);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  const ACTION_CONFIG = {
    approve:    { label: 'Duyệt listing',          color: 'bg-tertiary text-white',  icon: 'check_circle' },
    reject:     { label: 'Từ chối listing',         color: 'bg-error text-white',     icon: 'cancel' },
    inspection: { label: 'Gửi kiểm định',           color: 'bg-blue-600 text-white',  icon: 'search' },
  };

  // ── Delete rejected listing ──────────────────────────────────
  async function handleDeleteRejected() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/listings/${deleteTarget.id}/rejected`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteTarget(null);
      fetchAll(allPage, filterStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Bike Categories: fetch all ───────────────────────────────
  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    setCatError('');
    try {
      const res = await fetch(`${API_BASE}/admin/bike-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : (data.items ?? data.categories ?? []));
    } catch (e) {
      setCatError(e.message);
    } finally {
      setCatLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ── Bike Categories: get by id ───────────────────────────────
  async function openCatDetail(id) {
    setCatDetailLoading(true);
    setCatDetail(null);
    try {
      const res = await fetch(`${API_BASE}/admin/bike-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCatDetail(data);
    } catch (e) {
      setCatDetail({ error: e.message });
    } finally {
      setCatDetailLoading(false);
    }
  }

  // ── Bike Categories: create ──────────────────────────────────
  async function handleCatCreate() {
    setCatCreateLoading(true);
    setCatCreateError('');
    try {
      const res = await fetch(`${API_BASE}/admin/bike-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: catCreateName, description: catCreateDesc }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      setShowCatCreate(false);
      setCatCreateName('');
      setCatCreateDesc('');
      fetchCategories();
    } catch (e) {
      setCatCreateError(e.message);
    } finally {
      setCatCreateLoading(false);
    }
  }

  // ── Bike Categories: update ──────────────────────────────────
  async function handleCatEdit() {
    if (!catEdit) return;
    setCatEditLoading(true);
    setCatEditError('');
    try {
      const res = await fetch(`${API_BASE}/admin/bike-categories/${catEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: catEdit.name, description: catEdit.description }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      setCatEdit(null);
      fetchCategories();
    } catch (e) {
      setCatEditError(e.message);
    } finally {
      setCatEditLoading(false);
    }
  }

  // ── Bike Categories: delete ──────────────────────────────────
  const [catDeleteError, setCatDeleteError] = useState('');

  async function handleCatDelete() {
    if (!catDelete) return;
    setCatDeleteLoading(true);
    setCatDeleteError('');
    try {
      const res = await fetch(`${API_BASE}/admin/bike-categories/${catDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || d.title || d.error || `HTTP ${res.status}`);
      }
      setCatDelete(null);
      fetchCategories();
    } catch (e) {
      setCatDeleteError(e.message);
    } finally {
      setCatDeleteLoading(false);
    }
  }

  // ── Mark listing as sold ─────────────────────────────────────
  async function handleMarkSold() {
    if (!soldTarget) return;
    setSoldLoading(true);
    setSoldError('');
    try {
      const res = await fetch(`${API_BASE}/admin/listings/${soldTarget.id}/sold`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      setSoldTarget(null);
      fetchAll(allPage, filterStatus);
    } catch (e) {
      setSoldError(e.message);
    } finally {
      setSoldLoading(false);
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      <main className="ml-64 pt-8 p-10 space-y-10 min-h-screen">

        {/* ── BẢNG 1: PENDING ── */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.45)' }}>
                <span className="material-symbols-outlined text-white text-xl">pending_actions</span>
              </div>
              <div>
                <h2 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">
                  Chờ duyệt
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                    {pendingTotal} listing đang chờ xử lý
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/60">
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-amber-700">Listing</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-amber-700">Giá</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-amber-700">Ngày tạo</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-amber-700 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {pendingLoading && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined animate-spin text-2xl block mx-auto mb-2">progress_activity</span>Đang tải...
                    </td></tr>
                  )}
                  {!pendingLoading && pending.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      Không có listing nào đang chờ duyệt.
                    </td></tr>
                  )}
                  {!pendingLoading && pending.map(item => {
                    const imgSrc = item.imageUrl ?? item.primaryImageUrl ?? item.primaryImage ?? item.thumbnail ?? null;
                    return (
                    <tr key={item.id} className="hover:bg-primary-container/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {imgSrc
                            ? <img src={imgSrc} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            : <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-outline-variant">directions_bike</span>
                              </div>
                          }
                          <div>
                            <p className="font-headline text-sm font-bold text-on-surface line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-on-surface-variant">ID #{item.id}{item.sellerName ? ` · ${item.sellerName}` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-headline text-sm font-bold text-on-surface">{formatPrice(item.price)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface-variant">{formatDate(item.createdAt)}</p>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Chi tiết */}
                          <button onClick={() => openDetail(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors" title="Xem chi tiết">
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">visibility</span>
                          </button>
                          {/* Duyệt */}
                          <button onClick={() => { setActionModal({ listingId: item.id, type: 'approve', title: item.title }); setActionNote(''); setActionError(''); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-tertiary/10 transition-colors" title="Duyệt">
                            <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                          </button>
                          {/* Gửi kiểm định */}
                          <button onClick={() => { setActionModal({ listingId: item.id, type: 'inspection', title: item.title }); setActionNote(''); setActionError(''); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-500/10 transition-colors" title="Gửi kiểm định">
                            <span className="material-symbols-outlined text-blue-600 text-lg">search</span>
                          </button>
                          {/* Từ chối */}
                          <button onClick={() => { setActionModal({ listingId: item.id, type: 'reject', title: item.title }); setActionNote(''); setActionError(''); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 transition-colors" title="Từ chối">
                            <span className="material-symbols-outlined text-error text-lg">cancel</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={pendingPage} totalPages={pendingPages} onChange={setPendingPage} />
          </div>
        </section>

        {/* ── BẢNG 2: TẤT CẢ LISTING ĐÃ ĐƯỢC ADMIN XỬ LÝ ── */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4e2120,#7c3a39)', boxShadow: '0 4px 14px rgba(78,33,32,0.45)' }}>
                <span className="material-symbols-outlined text-white text-xl">list_alt</span>
              </div>
              <div>
                <h2 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">
                  Tất cả listing đã xử lý
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">{allTotal} listing</p>
              </div>
            </div>
            {/* Filter by status */}
            <div className="flex items-center gap-2 p-1 rounded-2xl" style={{ background: 'rgba(78,33,32,0.06)' }}>
              {[
                { val: '__all__', label: 'Tất cả',  icon: 'apps',          active: 'bg-on-surface text-surface',                                                                inactive: 'text-on-surface-variant hover:text-on-surface' },
                { val: 'Approved', label: 'Approved', icon: 'check_circle', active: 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.5)]',                         inactive: 'text-emerald-700 hover:bg-emerald-50' },
                { val: 'Rejected', label: 'Rejected', icon: 'cancel',       active: 'bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.5)]',                             inactive: 'text-red-700 hover:bg-red-50' },
                { val: 'Sold',     label: 'Sold',     icon: 'sell',         active: 'bg-purple-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.5)]',                         inactive: 'text-purple-700 hover:bg-purple-50' },
              ].map(({ val, label, icon, active, inactive }) => (
                <button key={val} onClick={() => { setFilterStatus(val); setAllPage(1); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${filterStatus === val ? active : inactive}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/8" style={{ background: 'rgba(78,33,32,0.05)' }}>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-primary/70">Listing</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-primary/70">Giá</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-primary/70">Trạng thái</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-primary/70">Ngày tạo</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-primary/70 text-right">Chi tiết / Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {allLoading && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined animate-spin text-2xl block mx-auto mb-2">progress_activity</span>Đang tải...
                    </td></tr>
                  )}
                  {!allLoading && all.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm">Không có listing nào.</td></tr>
                  )}
                  {!allLoading && all.map(item => {
                    const imgSrc = item.imageUrl ?? item.primaryImageUrl ?? item.primaryImage ?? item.thumbnail ?? null;
                    return (
                    <tr key={item.id} className="hover:bg-primary-container/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {imgSrc
                            ? <img src={imgSrc} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            : <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-outline-variant">directions_bike</span>
                              </div>
                          }
                          <div>
                            <p className="font-headline text-sm font-bold text-on-surface line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-on-surface-variant">ID #{item.id}{item.sellerName ? ` · ${item.sellerName}` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-headline text-sm font-bold text-on-surface">{formatPrice(item.price)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${STATUS_BADGE[item.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                            {item.status === 'Approved' ? 'check_circle' : item.status === 'Rejected' ? 'cancel' : item.status === 'Sold' ? 'sell' : item.status === 'PendingInspection' ? 'search' : 'schedule'}
                          </span>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface-variant">{formatDate(item.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openDetail(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors" title="Xem chi tiết">
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">visibility</span>
                          </button>
                          {item.status === 'Approved' && (
                            <button onClick={() => { setSoldTarget({ id: item.id, title: item.title }); setSoldError(''); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary/10 transition-colors" title="Đánh dấu đã bán">
                              <span className="material-symbols-outlined text-secondary text-lg">sell</span>
                            </button>
                          )}
                          <button onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 transition-colors" title="Xóa listing">
                            <span className="material-symbols-outlined text-error text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={allPage} totalPages={allPages} onChange={setAllPage} />
          </div>
        </section>

        {/* ── BẢNG 3: BIKE CATEGORIES ── */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)', boxShadow: '0 4px 14px rgba(8,145,178,0.45)' }}>
                <span className="material-symbols-outlined text-white text-xl">category</span>
              </div>
              <div>
                <h2 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">
                  Danh mục xe đạp
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">{categories.length} danh mục</p>
              </div>
            </div>
            <button onClick={() => { setShowCatCreate(true); setCatCreateName(''); setCatCreateDesc(''); setCatCreateError(''); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-base">add</span>
              Thêm danh mục
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(8,145,178,0.06)' }}>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-cyan-700">ID</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-cyan-700">Tên danh mục</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-cyan-700">Mô tả</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-cyan-700 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {catLoading && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined animate-spin text-2xl block mx-auto mb-2">progress_activity</span>Đang tải...
                    </td></tr>
                  )}
                  {!catLoading && catError && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-error text-sm">{catError}</td></tr>
                  )}
                  {!catLoading && !catError && categories.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm">Chưa có danh mục nào.</td></tr>
                  )}
                  {!catLoading && categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-primary-container/5 transition-colors">
                      <td className="px-6 py-4 text-xs text-on-surface-variant">#{cat.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-headline text-sm font-bold text-on-surface">{cat.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface-variant line-clamp-2">{cat.description || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openCatDetail(cat.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors" title="Xem chi tiết">
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">visibility</span>
                          </button>
                          <button onClick={() => { setCatEdit({ id: cat.id, name: cat.name, description: cat.description ?? '' }); setCatEditError(''); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors" title="Chỉnh sửa">
                            <span className="material-symbols-outlined text-primary text-lg">edit</span>
                          </button>
                          <button onClick={() => { setCatDelete({ id: cat.id, name: cat.name }); setCatDeleteError(''); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 transition-colors" title="Xóa">
                            <span className="material-symbols-outlined text-error text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* ── DETAIL MODAL ── */}
      {(detailLoading || detail) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetail(null)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-white/40" onClick={e => e.stopPropagation()}>
            {detailLoading && (
              <div className="p-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>Đang tải...
              </div>
            )}
            {!detailLoading && detail && (() => {
              const l = detail.listing;
              const coverImg = l.images?.find(i => i.isCover)?.imageUrl ?? l.images?.[0]?.imageUrl;
              return (
                <div>
                  {coverImg && <img src={coverImg} alt={l.title} className="w-full h-56 object-cover rounded-t-2xl" />}
                  <div className="p-8 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter">{l.title}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">ID #{l.id}</p>
                      </div>
                      <p className="font-headline text-xl font-bold text-primary flex-shrink-0">{formatPrice(l.price)}</p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${STATUS_BADGE[l.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                        {typeof l.status === 'number' ? ['Pending','Approved','Rejected','PendingInspection'][l.status] ?? l.status : l.status}
                      </span>
                      {detail.hasInspectionRequest && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-blue-500/10 text-blue-600">Có yêu cầu kiểm định</span>
                      )}
                      {detail.inspectionPassed && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-tertiary/10 text-tertiary">Đã qua kiểm định</span>
                      )}
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        ['Frame Size', l.frameSize],
                        ['Material', l.material],
                        ['Gear Count', l.gearCount],
                        ['Ngày tạo', formatDate(l.createdAt)],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">{k}</p>
                          <p className="font-medium text-on-surface">{v || '—'}</p>
                        </div>
                      ))}
                    </div>

                    {/* Attributes */}
                    {l.attributes?.length > 0 && (
                      <div>
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Thuộc tính</p>
                        <div className="grid grid-cols-2 gap-2">
                          {l.attributes.map(a => (
                            <div key={a.id} className="bg-surface-container-low rounded-lg px-3 py-2">
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{a.key}</p>
                              <p className="text-sm font-medium text-on-surface">{a.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {l.description && (
                      <div>
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Mô tả</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{l.description}</p>
                      </div>
                    )}

                    <button onClick={() => setDetail(null)}
                      className="w-full py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                      Đóng
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── ACTION MODAL ── */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/40">
            {(() => {
              const cfg = ACTION_CONFIG[actionModal.type];
              return (
                <>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${cfg.color} opacity-90`}>
                    <span className="material-symbols-outlined text-2xl">{cfg.icon}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-1">{cfg.label}</h3>
                  <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{actionModal.title}</p>
                  <div className="mb-4">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                      {actionModal.type === 'reject' ? 'Lý do từ chối *' : 'Ghi chú (tuỳ chọn)'}
                    </label>
                    <textarea rows={3} value={actionNote} onChange={e => setActionNote(e.target.value)}
                      placeholder={actionModal.type === 'reject' ? 'Nhập lý do...' : 'Nhập ghi chú...'}
                      className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant/50 outline-none resize-none transition-all" />
                  </div>
                  {actionError && <p className="text-error text-xs mb-4">{actionError}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => setActionModal(null)}
                      className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                      Hủy
                    </button>
                    <button onClick={submitAction} disabled={actionLoading}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-opacity disabled:opacity-60 ${cfg.color}`}>
                      {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── DELETE REJECTED MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-error text-2xl">delete</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Xóa listing bị từ chối?</h3>
            <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">
              Bạn có chắc muốn xóa <span className="font-bold text-on-surface">"{deleteTarget.title}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleDeleteRejected} disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
                {deleteLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MARK SOLD MODAL ── */}
      {soldTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">sell</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Đánh dấu đã bán?</h3>
            <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">
              Đánh dấu <span className="font-bold text-on-surface">"{soldTarget.title}"</span> là đã bán.
            </p>
            {soldError && <p className="text-error text-xs mb-4">{soldError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setSoldTarget(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleMarkSold} disabled={soldLoading}
                className="flex-1 py-3 rounded-xl bg-secondary text-on-secondary font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
                {soldLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CAT DETAIL MODAL ── */}
      {(catDetailLoading || catDetail) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setCatDetail(null)}>
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/40" onClick={e => e.stopPropagation()}>
            {catDetailLoading && (
              <div className="py-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>Đang tải...
              </div>
            )}
            {!catDetailLoading && catDetail && (
              catDetail.error
                ? <p className="text-error text-sm">{catDetail.error}</p>
                : <div className="space-y-4">
                    <h3 className="font-headline text-xl font-bold text-on-surface">Chi tiết danh mục</h3>
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">ID</p>
                      <p className="text-sm text-on-surface">#{catDetail.id}</p>
                    </div>
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Tên</p>
                      <p className="text-sm font-bold text-on-surface">{catDetail.name}</p>
                    </div>
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Mô tả</p>
                      <p className="text-sm text-on-surface-variant">{catDetail.description || '—'}</p>
                    </div>
                    <button onClick={() => setCatDetail(null)}
                      className="w-full py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                      Đóng
                    </button>
                  </div>
            )}
          </div>
        </div>
      )}

      {/* ── CAT CREATE MODAL ── */}
      {showCatCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/40">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Thêm danh mục mới</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Tên danh mục *</label>
                <input type="text" value={catCreateName} onChange={e => setCatCreateName(e.target.value)}
                  placeholder="Nhập tên danh mục..."
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Mô tả</label>
                <textarea rows={3} value={catCreateDesc} onChange={e => setCatCreateDesc(e.target.value)}
                  placeholder="Nhập mô tả..."
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant/50 outline-none resize-none transition-all" />
              </div>
            </div>
            {catCreateError && <p className="text-error text-xs mb-4">{catCreateError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowCatCreate(false)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleCatCreate} disabled={catCreateLoading || !catCreateName.trim()}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
                {catCreateLoading ? 'Đang tạo...' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CAT EDIT MODAL ── */}
      {catEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/40">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Chỉnh sửa danh mục</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Tên danh mục *</label>
                <input type="text" value={catEdit.name} onChange={e => setCatEdit(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all" />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Mô tả</label>
                <textarea rows={3} value={catEdit.description} onChange={e => setCatEdit(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none resize-none transition-all" />
              </div>
            </div>
            {catEditError && <p className="text-error text-xs mb-4">{catEditError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setCatEdit(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleCatEdit} disabled={catEditLoading || !catEdit.name.trim()}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
                {catEditLoading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CAT DELETE MODAL ── */}
      {catDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-error text-2xl">delete</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Xóa danh mục?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Bạn có chắc muốn xóa <span className="font-bold text-on-surface">"{catDelete.name}"</span>? Hành động này không thể hoàn tác.
            </p>
            {catDeleteError && <p className="text-error text-xs mb-4">{catDeleteError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setCatDelete(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleCatDelete} disabled={catDeleteLoading}
                className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
                {catDeleteLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
