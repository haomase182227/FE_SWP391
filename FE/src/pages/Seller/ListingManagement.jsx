import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

const STATUS_STYLES = {
  Active:            'bg-tertiary text-on-tertiary',
  Sold:              'bg-surface-container-highest text-on-surface-variant',
  Pending:           'bg-orange-500/10 text-orange-600',
  PendingInspection: 'bg-blue-500/10 text-blue-600',
};

const TABS = ['All', 'Active', 'Sold', 'Pending', 'PendingInspection'];

// Map API status → display status
function normalizeStatus(raw) {
  if (!raw) return null;
  if (raw.toLowerCase() === 'approved') return 'Active';
  if (raw.toLowerCase() === 'draft') return null; // hide drafts
  return raw;
}

export default function ListingManagement() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch]       = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Detail modal ─────────────────────────────────────────────
  const [detailTarget,  setDetailTarget]  = useState(null);
  const [detailData,    setDetailData]    = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function openDetail(listing) {
    setDetailTarget(listing);
    setDetailData(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seller/listings/${listing.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDetailData(data);
    } catch {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  }

  // ── Edit modal ────────────────────────────────────────────────
  const [editTarget,  setEditTarget]  = useState(null);
  const [editForm,    setEditForm]    = useState({ title: '', description: '', price: '', frameSize: '', requestReInspection: false });
  const [editLoading, setEditLoading] = useState(false);
  const [editError,   setEditError]   = useState('');

  // ── Delete confirm ────────────────────────────────────────────
  const [deleteTarget,  setDeleteTarget]  = useState(null); // listing object
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch listings ────────────────────────────────────────────
  const fetchListings = useCallback(async (status = '') => {
    setLoading(true);
    setError('');
    try {
      const url = status
        ? `${API_BASE}/seller/Listings?status=${encodeURIComponent(status)}`
        : `${API_BASE}/seller/Listings`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.listings ?? data.items ?? []);
      // Debug: log first item to inspect image field names
      if (list.length > 0) console.log('[ListingManagement] sample listing keys:', Object.keys(list[0]), list[0]);
      setListings(list);
    } catch {
      setError('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  // ── Open edit modal ───────────────────────────────────────────
  function openEdit(listing) {
    setEditTarget(listing);
    setEditForm({
      title:               listing.title ?? '',
      description:         listing.description ?? '',
      price:               listing.price ?? '',
      frameSize:           listing.frameSize ?? '',
      requestReInspection: false,
    });
    setEditError('');
  }

  // ── Save edit ─────────────────────────────────────────────────
  async function handleEdit(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`${API_BASE}/seller/listings/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title:               editForm.title,
          description:         editForm.description,
          price:               Number(editForm.price),
          frameSize:           editForm.frameSize,
          requestReInspection: editForm.requestReInspection,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || d.detail || `HTTP ${res.status}`);
      }
      setEditTarget(null);
      fetchListings();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seller/Listings/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteTarget(null);
      fetchListings();
    } catch {
      fetchListings();
    } finally {
      setDeleteLoading(false);
    }
  }

  const countByStatus = (s) => listings.filter(l => normalizeStatus(l.status) === s).length;

  // ── Client-side filter (search + tab) ────────────────────────
  const filtered = listings.filter((l) => {
    const status = normalizeStatus(l.status);
    if (!status) return false; // hide drafts
    const title    = (l.title ?? '').toLowerCase();
    const brand    = (l.brand ?? l.brandName ?? '').toLowerCase();
    const id       = String(l.id ?? '').toLowerCase();
    const matchSearch = title.includes(search.toLowerCase())
      || brand.includes(search.toLowerCase())
      || id.includes(search.toLowerCase());
    if (activeTab === 0) return matchSearch;
    const tabStatus = TABS[activeTab];
    return matchSearch && status === tabStatus;
  });

  const stats = {
    total:             listings.filter(l => normalizeStatus(l.status) !== null).length,
    active:            countByStatus('Active'),
    sold:              countByStatus('Sold'),
    pending:           countByStatus('Pending'),
    pendingInspection: countByStatus('PendingInspection'),
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Auto-advance: if currentPage exceeds totalPages, clamp to last page
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        merchantName="Verified Merchant"
        merchantSub="Seller Dashboard"
        bottomButton="+ New Listing"
        onBottomButtonClick={() => navigate('/seller/new-listing')}
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 ml-64 h-16 bg-surface/80 backdrop-blur-xl shadow-sm shadow-on-surface/5">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none focus:ring-1 focus:ring-primary/20 text-sm rounded-lg placeholder:text-on-surface-variant/50"
            placeholder="Search listings..."
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-4 ml-6">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            notifications
          </span>
          <button
            onClick={() => navigate('/seller/new-listing')}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Listing
          </button>
        </div>
      </header>

      <main className="ml-64 p-10 min-h-screen">
        {/* Header */}
        <section className="mb-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Inventory</p>
              <h1 className="text-5xl font-bold tracking-tighter font-headline text-on-surface">My Listings</h1>
            </div>
            {/* Stats */}
            <div className="flex gap-6">
              {[
                { label: 'Total',              value: stats.total,             color: 'text-on-surface' },
                { label: 'Active',             value: stats.active,            color: 'text-tertiary' },
                { label: 'Sold',               value: stats.sold,              color: 'text-secondary' },
                { label: 'Pending',            value: stats.pending,           color: 'text-orange-500' },
                { label: 'Pending Inspection', value: stats.pendingInspection, color: 'text-blue-500' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="w-px h-10 bg-outline-variant/20 self-center" />}
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">{s.label}</p>
                    <p className={`text-2xl font-bold font-headline ${s.color}`}>{s.value}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-primary/30 via-outline-variant/10 to-transparent" />
        </section>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-xl mb-8">
          <div className="flex gap-1">
            {TABS.map((tab, i) => {
              const label = tab === 'PendingInspection' ? 'Pending Insp.' : tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(i); setCurrentPage(1); }}
                  className={`px-6 py-2 text-xs uppercase tracking-tight font-semibold rounded-lg transition-colors ${
                    activeTab === i
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {label}
                  {tab !== 'All' && (
                    <span className="ml-1.5 opacity-60">({countByStatus(tab)})</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pr-2 text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">
            <span className="material-symbols-outlined text-sm">sort</span>
            {filtered.length} results
          </div>
        </div>

        {/* Listing Cards */}
        <div className="grid grid-cols-1 gap-4">
          {loading && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-30 animate-spin">progress_activity</span>
              <p className="font-bold uppercase tracking-widest text-xs">Loading...</p>
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-20 text-error">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-40">error</span>
              <p className="font-bold uppercase tracking-widest text-xs">{error}</p>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">directions_bike</span>
              <p className="font-bold uppercase tracking-widest text-xs">No listings found</p>
            </div>
          )}
          {!loading && !error && paginated.map((listing) => {
            const brand     = listing.brand ?? listing.brandName ?? '—';
            const category  = listing.category ?? listing.categoryName ?? '—';
            const condition = listing.condition ?? '—';
            const status    = normalizeStatus(listing.status) ?? 'Pending';
            const price     = listing.price ?? 0;
            const year      = listing.year ?? '';
            const views     = listing.views ?? listing.viewCount ?? 0;
            const inspected = listing.requestInspection ?? listing.inspected ?? false;
            const imgSrc    = listing.primaryImage ?? listing.primaryImageUrl ?? listing.imageUrl ?? listing.image ?? listing.thumbnail ?? listing.thumbnailUrl ?? null;

            return (
              <div
                key={listing.id}
                className="group bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-primary-container/5 transition-all"
                style={{ boxShadow: '0 20px 40px rgba(78,33,32,0.04)' }}
              >
                {/* Image */}
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">directions_bike</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                  {/* Title */}
                  <div className="col-span-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">#{listing.id}</p>
                    <h3 className="font-headline font-bold text-base leading-tight mt-0.5">{listing.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-on-surface-variant">{brand} · {category} · {year}</span>
                      {inspected && (
                        <span className="flex items-center gap-0.5 text-[10px] text-tertiary font-bold">
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                          Inspected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Price</p>
                    <p className="font-headline font-bold text-lg text-primary">
                      ${price.toLocaleString()}
                    </p>
                  </div>

                  {/* IsVerifiedBicycle */}
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Verified</p>
                    {listing.isVerifiedBicycle
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-tertiary">
                          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                          Inspected
                        </span>
                      : <span className="text-[10px] font-bold text-on-surface-variant/50">Not inspected</span>
                    }
                  </div>

                  {/* Views → Chi tiết */}
                  <div className="col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Detail</p>
                    <button
                      onClick={() => openDetail(listing)}
                      className="flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
                      title="View detail"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                      {status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(listing)}
                      className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border border-outline-variant/30 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(listing)}
                      className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors px-2 py-2 rounded-lg hover:bg-error-container/10"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
          <p className="text-sm text-on-surface-variant italic">
            Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} listings
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                  page === safePage
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <button
            onClick={() => navigate('/seller/new-listing')}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(168,49,0,0.2)] hover:bg-primary-dim transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create New Listing
          </button>
        </div>
      </main>

      {/* ── Detail Modal ── */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailTarget(null)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-white/40" onClick={e => e.stopPropagation()}>
            {detailLoading && (
              <div className="p-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-3xl block mx-auto mb-2">progress_activity</span>
                Đang tải...
              </div>
            )}
            {!detailLoading && (() => {
              const d = detailData ?? detailTarget;
              const img = d.images?.find(i => i.isCover)?.imageUrl ?? d.images?.[0]?.imageUrl ?? d.imageUrl ?? null;
              const inspection = d.inspections?.[0] ?? d.inspection ?? null;
              return (
                <div>
                  {img && <img src={img} alt={d.title} className="w-full h-56 object-cover rounded-t-2xl" />}
                  <div className="p-8 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">#{d.id}</p>
                        <h3 className="font-headline text-2xl font-black text-on-surface tracking-tighter">{d.title}</h3>
                      </div>
                      <p className="font-headline text-xl font-bold text-primary flex-shrink-0">
                        {(d.price ?? 0).toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${STATUS_STYLES[normalizeStatus(d.status)] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                        {normalizeStatus(d.status) ?? d.status}
                      </span>
                      {d.isVerifiedBicycle && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-tighter">
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                          Inspected
                        </span>
                      )}
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        ['Brand', d.brandName],
                        ['Model', d.modelName],
                        ['Category', d.categoryName],
                        ['Frame Size', d.frameSize],
                        ['Created', d.createdAt ? new Date(d.createdAt).toLocaleDateString('vi-VN') : '—'],
                        ['Updated', d.updatedAt ? new Date(d.updatedAt).toLocaleDateString('vi-VN') : '—'],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">{k}</p>
                          <p className="font-medium text-on-surface">{v || '—'}</p>
                        </div>
                      ))}
                    </div>

                    {/* Inspection info */}
                    {inspection && (
                      <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4">
                        <p className="font-label text-[10px] uppercase tracking-widest text-tertiary mb-2 font-bold">Inspection Details</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[10px] text-on-surface-variant">Result</p>
                            <p className="font-bold">{inspection.isPassed ? '✅ Passed' : '❌ Failed'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-on-surface-variant">Inspected At</p>
                            <p className="font-medium">{inspection.inspectedAt ? new Date(inspection.inspectedAt).toLocaleDateString('vi-VN') : '—'}</p>
                          </div>
                          {inspection.notes && (
                            <div className="col-span-2">
                              <p className="text-[10px] text-on-surface-variant">Notes</p>
                              <p className="font-medium">{inspection.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {d.description && (
                      <div>
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Description</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{d.description}</p>
                      </div>
                    )}

                    <button onClick={() => setDetailTarget(null)}
                      className="w-full py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-white/40 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 border-b border-outline-variant/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">Edit Listing</h3>
                  <p className="text-xs text-on-surface-variant mt-1">#{editTarget.id} · {editTarget.title}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${STATUS_STYLES[normalizeStatus(editTarget.status)] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                  {normalizeStatus(editTarget.status) ?? editTarget.status}
                </span>
              </div>
            </div>

            <div className="px-8 py-6 space-y-5">
              {/* Info banner theo status */}
              {normalizeStatus(editTarget.status) === 'Active' ? (
                <div className="bg-orange-500/8 border border-orange-500/25 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-600 text-lg">warning</span>
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Listing đang Approved</p>
                  </div>
                  <ul className="text-xs text-orange-700 space-y-1 pl-6 list-disc">
                    <li>Phí đăng lại = <strong>1% × giá mới</strong> sẽ bị trừ từ ví</li>
                    <li>Status chuyển về <strong>Pending</strong>, chờ Admin duyệt lại</li>
                    <li>Badge kiểm định bị <strong>reset về false</strong></li>
                  </ul>
                  {editForm.price && (
                    <div className="mt-2 bg-orange-500/10 rounded-lg px-3 py-2 text-xs font-bold text-orange-800">
                      Phí ước tính: {Math.round(Number(editForm.price) * 0.01).toLocaleString('vi-VN')}₫
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-tertiary/8 border border-tertiary/20 rounded-xl p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">info</span>
                  <p className="text-xs text-tertiary">
                    Listing đang <strong>{normalizeStatus(editTarget.status) ?? editTarget.status}</strong> — sửa tự do, không mất phí, status không đổi.
                  </p>
                </div>
              )}

              <form onSubmit={handleEdit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Title <span className="text-error">*</span></label>
                  <input
                    required
                    value={editForm.title}
                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary/30 text-sm text-on-surface outline-none transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary/30 text-sm text-on-surface outline-none resize-none transition-all"
                  />
                </div>

                {/* Price + Frame Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Price (₫) <span className="text-error">*</span></label>
                    <input
                      type="number" min="0" step="1" required
                      value={editForm.price}
                      onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary/30 text-sm text-on-surface outline-none transition-all"
                    />
                    {normalizeStatus(editTarget.status) === 'Active' && editForm.price && (
                      <p className="text-[10px] text-orange-600 mt-1 font-medium">
                        Phí: {Math.round(Number(editForm.price) * 0.01).toLocaleString('vi-VN')}₫
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Frame Size</label>
                    <input
                      value={editForm.frameSize}
                      onChange={e => setEditForm(f => ({ ...f, frameSize: e.target.value }))}
                      placeholder="e.g. S, M, L, XL"
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary/30 text-sm text-on-surface outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Request Re-Inspection — chỉ hiện khi Approved */}
                {normalizeStatus(editTarget.status) === 'Active' && (
                  <div className={`rounded-xl border-2 p-4 transition-all ${editForm.requestReInspection ? 'border-secondary/40 bg-secondary/5' : 'border-outline-variant/20 bg-surface-container-low'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-on-surface">Request Re-Inspection</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Tốn thêm <strong>200,000₫</strong> từ ví · Inspector kiểm định lại sau khi Admin duyệt · Lấy lại badge ✅
                        </p>
                        {editForm.requestReInspection && (
                          <p className="text-xs text-secondary font-bold mt-1.5">
                            Tổng phí: {(Math.round(Number(editForm.price || 0) * 0.01) + 200000).toLocaleString('vi-VN')}₫
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditForm(f => ({ ...f, requestReInspection: !f.requestReInspection }))}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${editForm.requestReInspection ? 'bg-secondary' : 'bg-outline-variant'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${editForm.requestReInspection ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {editError && (
                  <div className="flex items-center gap-2 bg-error/10 border border-error/20 rounded-xl px-4 py-3">
                    <span className="material-symbols-outlined text-error text-sm">error</span>
                    <p className="text-error text-xs font-medium">{editError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditTarget(null)}
                    className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={editLoading}
                    className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
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
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Delete Listing?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Are you sure you want to delete <span className="font-bold text-on-surface">"{deleteTarget.title}"</span>? This action cannot be undone.
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
}
