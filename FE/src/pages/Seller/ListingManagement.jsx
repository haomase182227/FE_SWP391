import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';

const STATUS_STYLES = {
  Active:  'bg-tertiary text-on-tertiary',
  Sold:    'bg-surface-container-highest text-on-surface-variant',
  Draft:   'border border-outline-variant/40 text-on-surface-variant',
  Pending: 'bg-orange-500/10 text-orange-600',
};

const TABS = ['All', 'Active', 'Sold', 'Draft', 'Pending'];

export default function ListingManagement() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch]       = useState('');

  // ── Edit modal ────────────────────────────────────────────────
  const [editTarget,  setEditTarget]  = useState(null); // listing object
  const [editForm,    setEditForm]    = useState({ title: '', description: '', price: '', frameSize: '', requestInspection: false });
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
      // API may return array directly or wrapped in a property
      setListings(Array.isArray(data) ? data : (data.listings ?? data.items ?? []));
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
      title:             listing.title ?? '',
      description:       listing.description ?? '',
      price:             listing.price ?? '',
      frameSize:         listing.frameSize ?? '',
      requestInspection: listing.requestInspection ?? false,
    });
    setEditError('');
  }

  // ── Save edit ─────────────────────────────────────────────────
  async function handleEdit(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`${API_BASE}/seller/Listings/${editTarget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title:             editForm.title,
          description:       editForm.description,
          price:             Number(editForm.price),
          frameSize:         editForm.frameSize,
          requestInspection: editForm.requestInspection,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
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

  // ── Client-side filter (search + tab) ────────────────────────
  const filtered = listings.filter((l) => {
    const title    = (l.title ?? '').toLowerCase();
    const brand    = (l.brand ?? l.brandName ?? '').toLowerCase();
    const id       = String(l.id ?? '').toLowerCase();
    const matchSearch = title.includes(search.toLowerCase())
      || brand.includes(search.toLowerCase())
      || id.includes(search.toLowerCase());
    if (activeTab === 0) return matchSearch;
    const tabStatus = TABS[activeTab];
    return matchSearch && (l.status ?? '').toLowerCase() === tabStatus.toLowerCase();
  });

  const countByStatus = (s) => listings.filter(l => (l.status ?? '').toLowerCase() === s.toLowerCase()).length;

  const stats = {
    total:   listings.length,
    active:  countByStatus('Active'),
    sold:    countByStatus('Sold'),
    draft:   countByStatus('Draft'),
    pending: countByStatus('Pending'),
  };

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
            onChange={(e) => setSearch(e.target.value)}
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
                { label: 'Total',   value: stats.total,   color: 'text-on-surface' },
                { label: 'Active',  value: stats.active,  color: 'text-tertiary' },
                { label: 'Sold',    value: stats.sold,    color: 'text-secondary' },
                { label: 'Draft',   value: stats.draft,   color: 'text-on-surface-variant' },
                { label: 'Pending', value: stats.pending, color: 'text-orange-500' },
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
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2 text-xs uppercase tracking-tight font-semibold rounded-lg transition-colors ${
                  activeTab === i
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className="ml-1.5 opacity-60">({countByStatus(tab)})</span>
                )}
              </button>
            ))}
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
          {!loading && !error && filtered.map((listing) => {
            const brand     = listing.brand ?? listing.brandName ?? '—';
            const category  = listing.category ?? listing.categoryName ?? '—';
            const condition = listing.condition ?? '—';
            const status    = listing.status ?? 'Draft';
            const price     = listing.price ?? 0;
            const year      = listing.year ?? '';
            const views     = listing.views ?? listing.viewCount ?? 0;
            const inspected = listing.requestInspection ?? listing.inspected ?? false;
            const imgSrc    = listing.primaryImage ?? listing.primaryImageUrl ?? null;

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

                  {/* Condition */}
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Condition</p>
                    <p className="text-sm font-semibold">{condition}</p>
                  </div>

                  {/* Views */}
                  <div className="col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Views</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">visibility</span>
                      {views}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                      {status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-2">
                    {status === 'Draft' ? (
                      <button
                        onClick={() => navigate('/seller/new-listing')}
                        className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        Continue
                      </button>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
          <p className="text-sm text-on-surface-variant italic">
            Showing {filtered.length} of {listings.length} listings
          </p>
          <button
            onClick={() => navigate('/seller/new-listing')}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(168,49,0,0.2)] hover:bg-primary-dim transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create New Listing
          </button>
        </div>
      </main>

      {/* ── Edit Modal ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/40">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Edit Listing</h3>
            <p className="text-xs text-on-surface-variant mb-6 uppercase tracking-widest font-bold">#{editTarget.id} · {editTarget.title}</p>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Title</label>
                <input
                  required
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Frame Size</label>
                  <input
                    value={editForm.frameSize}
                    onChange={e => setEditForm(f => ({ ...f, frameSize: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:border-primary"
                    placeholder="e.g. 54 cm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={editForm.requestInspection}
                  onClick={() => setEditForm(f => ({ ...f, requestInspection: !f.requestInspection }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${editForm.requestInspection ? 'bg-secondary' : 'bg-outline-variant'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.requestInspection ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Request Inspection</span>
              </div>
              {editError && <p className="text-error text-xs">{editError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
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
