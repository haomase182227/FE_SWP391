import { useCallback, useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
const PENDING_PAGE_SIZE = 5;
const ALL_PAGE_SIZE = 10;

const STATUS_BADGE = {
  Pending:   'bg-orange-500/10 text-orange-600',
  Approved:  'bg-tertiary/10 text-tertiary',
  Rejected:  'bg-error/10 text-error',
  PendingInspection: 'bg-blue-500/10 text-blue-600',
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
        // fetch cả Approved và Rejected rồi merge
        const [r1, r2] = await Promise.all([
          fetch(`${API_BASE}/admin/listings?page=${p}&pageSize=${ALL_PAGE_SIZE}&status=Approved`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/admin/listings?page=${p}&pageSize=${ALL_PAGE_SIZE}&status=Rejected`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
        const items = [...(d1.items ?? []), ...(d2.items ?? [])];
        const total = (d1.totalCount ?? 0) + (d2.totalCount ?? 0);
        const pages = Math.max(d1.totalPages ?? 1, d2.totalPages ?? 1);
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
      <AdminTopBar title="Listing Moderation" searchPlaceholder="Search listings..." />

      <main className="ml-64 pt-16 p-10 space-y-10 min-h-screen">

        {/* ── BẢNG 1: PENDING ── */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">
                Chờ duyệt
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {pendingTotal} listing đang chờ xử lý
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Listing</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Giá</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Ngày tạo</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Thao tác</th>
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
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">
                TẤT CẢ LISTING ĐÃ ĐƯỢC ADMIN XỬ LÝ 
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">{allTotal} listing</p>
            </div>
            {/* Filter by status */}
            <div className="flex items-center gap-2">
              {[['__all__', 'Tất cả'], ['Approved', 'Approved'], ['Rejected', 'Rejected']].map(([val, label]) => (
                <button key={val} onClick={() => { setFilterStatus(val); setAllPage(1); }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${filterStatus === val ? 'bg-primary text-on-primary' : 'border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Listing</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Giá</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Trạng thái</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Ngày tạo</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Chi tiết / Thao tác</th>
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${STATUS_BADGE[item.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
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
    </div>
  );
}
