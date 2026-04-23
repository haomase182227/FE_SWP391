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
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState('');
  const [inspectorNote, setInspectorNote] = useState('');

  // Checklist state — mặc định tích hết [0,1,2,3,4]
  const [checkedItems, setCheckedItems] = useState({
    frame: [0, 1, 2, 3, 4],
    brakes: [0, 1, 2, 3, 4],
    drivetrain: [0, 1, 2, 3, 4],
  });

  const inspectionCriteria = {
    frame: [
      'Khung và phuộc không bị nứt, gãy hoặc biến dạng.',
      'Lớp sơn còn tốt, không bong tróc mảng lớn.',
      'Không có dấu hiệu rỉ sét nghiêm trọng ở các khớp nối.',
      'Phuộc nhún hoạt động êm ái, không bị xì dầu (nếu có).',
      'Các mối hàn chắn chắn, không bị nứt hở.',
    ],
    brakes: [
      'Má phanh còn dày, chưa bị mòn đến vạch cảnh báo.',
      'Dây phanh/Cáp phanh căng, không bị tưa hoặc đứt rão.',
      'Tay phanh đàn hồi tốt, bóp nhả nhẹ nhàng, không bị kẹt.',
      'Đĩa phanh không bị vênh, hoặc không rò rỉ dầu (phanh thủy lực).',
      'Lực phanh ăn, đảm bảo xe dừng hẳn khi bóp chặt.',
    ],
    drivetrain: [
      'Xích xe không bị chùng nhão, đứt mắt hay rỉ sét nặng.',
      'Líp và đùi đĩa (răng cưa) không bị mòn vẹt, mẻ răng.',
      'Củ đề trước/sau (Derailleur) nhảy số mượt mà, không bị kẹt.',
      'Dây đề đứt tưa, thao tác bấm/vặn xả trên ghi đông nhẹ nhàng.',
      'Trục giữa (Bottom Bracket) quay êm, không bị rơ lắc hoặc kêu lạo xạo.',
    ],
  };

  const handleCheck = (part, index) => {
    setCheckedItems(prev => {
      const current = prev[part];
      const updated = current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index];
      return { ...prev, [part]: updated };
    });
  };

  const openStartModal = (item) => {
    setStartModal({ listingId: item.listingId, title: item.title });
    setCheckedItems({ frame: [0,1,2,3,4], brakes: [0,1,2,3,4], drivetrain: [0,1,2,3,4] });
    setInspectorNote('');
    setStartError('');
  };

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
      const framePercent     = (checkedItems.frame.length / 5) * 100;
      const brakesPercent    = (checkedItems.brakes.length / 5) * 100;
      const drivetrainPercent = (checkedItems.drivetrain.length / 5) * 100;

      const payload = {
        frameChecked:      framePercent > 50,
        brakeChecked:      brakesPercent > 50,
        drivetrainChecked: drivetrainPercent > 50,
        notes: inspectorNote,
      };

      console.log('Payload gửi đi:', payload);

      const res = await fetch(`${API_BASE}/inspections/${startModal.listingId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || d.message || `HTTP ${res.status}`);
      }
      setStartModal(null);
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
                            onClick={() => openStartModal(item)}
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
          <div className="bg-white rounded-2xl w-[90vw] max-w-7xl shadow-2xl flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-outline-variant/10 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Kiểm định xe đạp</p>
                  <h3 className="font-headline text-xl font-bold text-on-surface mt-0.5">Bắt đầu kiểm định</h3>
                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{startModal.title}</p>
                </div>
                <button onClick={() => setStartModal(null)} className="p-2 hover:bg-gray-100 rounded-full ml-4 flex-shrink-0">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

              {/* 3 bộ phận */}
              {[
                {
                  key: 'frame', label: 'Khung xe', icon: 'directions_bike',
                  img1: 'https://images.unsplash.com/photo-1772109065028-7c261692faa9?q=80&w=1074&auto=format&fit=crop',
                  img2: 'https://plus.unsplash.com/premium_photo-1678718712069-4cd5ddc8819c?q=80&w=687&auto=format&fit=crop',
                },
                {
                  key: 'brakes', label: 'Phanh', icon: 'do_not_touch',
                  img1: 'https://images.unsplash.com/photo-1727281624958-fa9734ea4160?q=80&w=1170&auto=format&fit=crop',
                  img2: 'https://images.unsplash.com/photo-1769445966495-f2a5822603a0?q=80&w=627&auto=format&fit=crop',
                },
                {
                  key: 'drivetrain', label: 'Hệ thống truyền động', icon: 'settings',
                  img1: 'https://images.unsplash.com/photo-1672138127452-3f538394f431?q=80&w=1171&auto=format&fit=crop',
                  img2: 'https://images.unsplash.com/photo-1716494974209-3a2d562b8258?q=80&w=1170&auto=format&fit=crop',
                },
              ].map(({ key, label, icon, img1, img2 }) => {
                const count   = checkedItems[key].length;
                const percent = Math.round((count / 5) * 100);
                const passed  = percent > 50;
                return (
                  <div key={key} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">

                    {/* Tiêu đề bộ phận + % + badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                        <span className="font-bold text-sm text-on-surface">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-sm text-on-surface">{percent}%</span>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                          passed
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-red-100 text-red-600 border-red-200'
                        }`}>
                          {passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full mb-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${passed ? 'bg-emerald-500' : 'bg-red-400'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Layout: [Hình 1] [Checklist] [Hình 2] */}
                    <div className="flex items-center gap-6">
                      {/* Hình trái */}
                      <img
                        src={img1}
                        alt={`${label} tham chiếu 1`}
                        className="w-40 h-40 aspect-square object-cover rounded-xl shadow-md flex-shrink-0"
                      />

                      {/* 5 tiêu chí */}
                      <div className="flex-1 space-y-2.5">
                        {inspectionCriteria[key].map((criterion, idx) => {
                          const isChecked = checkedItems[key].includes(idx);
                          return (
                            <label
                              key={idx}
                              className="flex items-start gap-3 cursor-pointer group"
                              onClick={() => handleCheck(key, idx)}
                            >
                              <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all mt-0.5 ${
                                isChecked ? 'bg-primary border-primary' : 'border-outline group-hover:border-primary/50'
                              }`}>
                                {isChecked && (
                                  <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '13px' }}>check</span>
                                )}
                              </div>
                              <span className={`text-sm leading-relaxed transition-colors ${
                                isChecked ? 'text-on-surface' : 'text-on-surface-variant'
                              }`}>
                                {criterion}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Hình phải */}
                      <img
                        src={img2}
                        alt={`${label} tham chiếu 2`}
                        className="w-40 h-40 aspect-square object-cover rounded-xl shadow-md flex-shrink-0"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Ghi chú chung */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                  Ghi chú chung
                </label>
                <textarea
                  rows={3}
                  value={inspectorNote}
                  onChange={e => setInspectorNote(e.target.value)}
                  placeholder="Nhập ghi chú kiểm định tổng thể..."
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant/50 outline-none resize-none transition-all"
                />
              </div>

              {startError && (
                <p className="text-error text-xs bg-error/5 border border-error/20 rounded-lg px-4 py-2">{startError}</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3 flex-shrink-0">
              <button
                onClick={() => setStartModal(null)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleStartInspection}
                disabled={startLoading}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {startLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Đang lưu...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">check_circle</span>Xác nhận</>
                )}
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
