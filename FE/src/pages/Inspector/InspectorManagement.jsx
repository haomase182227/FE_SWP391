import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import InspectorSidebar from '../../components/InspectorSidebar';

const API_BASE = '/api/v1';

function formatPrice(p) {
  return (p ?? 0).toLocaleString('vi-VN') + '₫';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function InspectorManagement() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const token = currentUser?.token;

  // ── Pending listings (chờ kiểm định) ────────────────────────
  const [pending, setPending] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  // ── My approvals (đã kiểm định) ─────────────────────────────
  const [approvals, setApprovals] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(false);

  // ── Start inspection modal ───────────────────────────────────
  const [startModal, setStartModal] = useState(null); // { listingId, title }
  const [startForm, setStartForm] = useState({ frameChecked: false, brakeChecked: false, drivetrainChecked: false, notes: '' });
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState('');

  // ── Approve modal ────────────────────────────────────────────
  const [approveModal, setApproveModal] = useState(null); // { listingId, title }
  const [approveLoading, setApproveLoading] = useState(false);

  const fetchPending = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inspections/pending-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPending(Array.isArray(data) ? data : []);
    } catch {
      setPending([]);
    } finally {
      setPendingLoading(false);
    }
  }, [token]);

  const fetchApprovals = useCallback(async () => {
    setApprovalsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inspections/my-approvals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setApprovals(Array.isArray(data) ? data : []);
    } catch {
      setApprovals([]);
    } finally {
      setApprovalsLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPending(); fetchApprovals(); }, [fetchPending, fetchApprovals]);

  // ── Start inspection ─────────────────────────────────────────
  async function handleStartInspection() {
    if (!startModal) return;
    setStartLoading(true);
    setStartError('');
    try {
      const res = await fetch(`${API_BASE}/inspections/${startModal.listingId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(startForm),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || d.message || `HTTP ${res.status}`);
      }
      setStartModal(null);
      setStartForm({ frameChecked: false, brakeChecked: false, drivetrainChecked: false, notes: '' });
      fetchPending();
      fetchApprovals();
    } catch (e) {
      setStartError(e.message);
    } finally {
      setStartLoading(false);
    }
  }

  // ── Approve listing ──────────────────────────────────────────
  async function handleApprove() {
    if (!approveModal) return;
    setApproveLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inspections/${approveModal.listingId}/approval`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setApproveModal(null);
      fetchPending();
      fetchApprovals();
    } catch {
      // silent fail, refetch anyway
      fetchPending();
      fetchApprovals();
    } finally {
      setApproveLoading(false);
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex">
      <InspectorSidebar />

      <div className="ml-64 flex-1">
      {/* Simple header */}
      <header className="fixed top-0 left-64 right-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
        <div className="flex items-center justify-between px-8 h-16">
          <h1 className="font-headline text-xl font-black tracking-tighter text-primary uppercase">Inspection Management</h1>
        </div>
      </header>

      <main className="pt-20 pb-16 px-8 max-w-7xl mx-auto space-y-10">

        {/* ── BẢNG 1: PENDING LISTINGS ── */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">
                Chờ kiểm định
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">{pending.length} listing đang chờ</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Listing</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Brand / Model</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Giá</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Yêu cầu lúc</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {pendingLoading && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined animate-spin text-2xl block mx-auto mb-2">progress_activity</span>Đang tải...
                    </td></tr>
                  )}
                  {!pendingLoading && pending.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      Không có listing nào đang chờ kiểm định.
                    </td></tr>
                  )}
                  {!pendingLoading && pending.map(item => (
                    <tr key={item.requestId} className="hover:bg-primary-container/5 transition-colors">
                      {/* Listing */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.listingCoverImageUrl
                            ? <img src={item.listingCoverImageUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            : <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-outline-variant">directions_bike</span>
                              </div>
                          }
                          <div>
                            <p className="font-headline text-sm font-bold text-on-surface line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-on-surface-variant">Listing #{item.listingId}</p>
                          </div>
                        </div>
                      </td>
                      {/* Brand / Model */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-on-surface">{item.brandName || '—'}</p>
                        <p className="text-xs text-on-surface-variant">{item.modelName || '—'}</p>
                      </td>
                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="font-headline text-sm font-bold text-on-surface">{formatPrice(item.price)}</p>
                      </td>
                      {/* Requested at */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface-variant">{formatDate(item.requestedAt)}</p>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Chấp nhận kiểm định */}
                          <button
                            onClick={() => setApproveModal({ listingId: item.listingId, title: item.title })}
                            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                          >
                            Chấp nhận kiểm định
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

        {/* ── BẢNG 2: MY APPROVALS ── */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-headline text-2xl font-black text-on-surface tracking-tighter uppercase">
                Đã kiểm định
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">{approvals.length} listing</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Listing</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Brand / Model</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Giá</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Kết quả</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Kiểm định lúc</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">Ghi chú</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {approvalsLoading && (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined animate-spin text-2xl block mx-auto mb-2">progress_activity</span>Đang tải...
                    </td></tr>
                  )}
                  {!approvalsLoading && approvals.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      Chưa có listing nào được kiểm định.
                    </td></tr>
                  )}
                  {!approvalsLoading && approvals.map(item => (
                    <tr key={item.requestId} className="hover:bg-primary-container/5 transition-colors">
                      {/* Listing */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.listingCoverImageUrl
                            ? <img src={item.listingCoverImageUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            : <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-outline-variant">directions_bike</span>
                              </div>
                          }
                          <div>
                            <p className="font-headline text-sm font-bold text-on-surface line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-on-surface-variant">Listing #{item.listingId}</p>
                          </div>
                        </div>
                      </td>
                      {/* Brand / Model */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-on-surface">{item.brandName || '—'}</p>
                        <p className="text-xs text-on-surface-variant">{item.modelName || '—'}</p>
                      </td>
                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="font-headline text-sm font-bold text-on-surface">{formatPrice(item.price)}</p>
                      </td>
                      {/* Result */}
                      <td className="px-6 py-4">
                        {item.isCompleted
                          ? item.isPassed
                            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-tighter">Đạt</span>
                            : <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-tighter">Không đạt</span>
                          : <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-tighter">Đang xử lý</span>
                        }
                      </td>
                      {/* Inspected at */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface-variant">{formatDate(item.inspectedAt)}</p>
                      </td>
                      {/* Notes */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface-variant line-clamp-2">{item.notes || '—'}</p>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {!item.isCompleted && (
                          <button
                            onClick={() => {
                              setStartModal({ listingId: item.listingId, title: item.title });
                              setStartForm({ frameChecked: false, brakeChecked: false, drivetrainChecked: false, notes: '' });
                              setStartError('');
                            }}
                            className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                          >
                            Bắt đầu kiểm định
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      </div>

      {/* ── START INSPECTION MODAL ── */}
      {startModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">search</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Bắt đầu kiểm định</h3>
            <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{startModal.title}</p>

            <div className="space-y-4 mb-6">
              {/* Checkboxes */}
              {[
                { key: 'frameChecked', label: 'Khung xe' },
                { key: 'brakeChecked', label: 'Phanh' },
                { key: 'drivetrainChecked', label: 'Hệ thống truyền động' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setStartForm(f => ({ ...f, [key]: !f[key] }))}
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${startForm[key] ? 'bg-primary border-primary' : 'border-outline'}`}
                  >
                    {startForm[key] && <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '14px' }}>check</span>}
                  </button>
                  <span className="text-sm text-on-surface">{label}</span>
                </label>
              ))}

              {/* Notes */}
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Ghi chú</label>
                <textarea
                  rows={3}
                  value={startForm.notes}
                  onChange={e => setStartForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Nhập ghi chú kiểm định..."
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant/50 outline-none resize-none transition-all"
                />
              </div>
            </div>

            {startError && <p className="text-error text-xs mb-4">{startError}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStartModal(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleStartInspection} disabled={startLoading}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                {startLoading ? 'Đang lưu...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVE MODAL ── */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/40">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Chấp nhận kiểm định</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Xác nhận chấp nhận yêu cầu kiểm định cho listing <span className="font-bold text-on-surface">{approveModal.title}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setApproveModal(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleApprove} disabled={approveLoading}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                {approveLoading ? 'Đang xử lý...' : 'Chấp nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
