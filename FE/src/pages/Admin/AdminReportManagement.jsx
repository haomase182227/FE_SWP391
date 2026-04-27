import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';

const API_BASE = '/api/v1';

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

const STATUS_CFG = {
  pending:              { label: 'Pending',           cls: 'bg-amber-100 text-amber-700 border border-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.2)]',   icon: 'schedule' },
  underreview:          { label: 'Chờ Admin',         cls: 'bg-blue-100 text-blue-700 border border-blue-300 shadow-[0_2px_8px_rgba(59,130,246,0.2)]',      icon: 'hourglass_top' },
  inspectordone:        { label: 'Inspector Done',    cls: 'bg-purple-100 text-purple-700 border border-purple-300 shadow-[0_2px_8px_rgba(139,92,246,0.2)]', icon: 'task_alt' },
  dismissedbyinspector: { label: 'Dismissed (Insp.)', cls: 'bg-orange-100 text-orange-700 border border-orange-300 shadow-[0_2px_8px_rgba(249,115,22,0.2)]', icon: 'cancel' },
  resolved:             { label: 'Resolved',          cls: 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.2)]', icon: 'check_circle' },
  dismissed:            { label: 'Dismissed',         cls: 'bg-red-100 text-red-700 border border-red-300 shadow-[0_2px_8px_rgba(239,68,68,0.2)]',           icon: 'block' },
};

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase().replace(/\s/g, '');
  const cfg = STATUS_CFG[key] || { label: status || '—', cls: 'bg-gray-100 text-gray-600 border border-gray-200', icon: 'help' };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.cls}`}>
      <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

// ── Toast component ───────────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-rose-100 max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
            <span
              className={`material-symbols-outlined text-4xl ${toast.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}
              style={{ fontVariationSettings: '"FILL" 1' }}>
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface">
            {toast.type === 'success' ? 'Thành công!' : 'Có lỗi xảy ra'}
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-3 font-bold uppercase text-sm rounded-xl hover:opacity-90 text-white"
          style={{ background: toast.type === 'success' ? 'linear-gradient(135deg,#065f46,#10b981)' : 'linear-gradient(135deg,#7f1d1d,#dc2626)' }}>
          OK
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 1 — DANH SÁCH TỐ CÁO
// ════════════════════════════════════════════════════════════════════════════
function ReportsTab({ token }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal decide
  const [decideModal, setDecideModal] = useState(null);
  const [decision, setDecision] = useState('');
  const [adminDecisionNote, setAdminDecisionNote] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal chi tiết (read-only)
  const [detailModal, setDetailModal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.reports || data.data || []);
      setReports(list);
    } catch (err) {
      setToast({ type: 'error', message: `Không thể tải danh sách: ${err.message}` });
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const openDecide = (report) => {
    setDecideModal(report);
    setDecision('');
    setAdminDecisionNote('');
  };

  const closeDecide = () => {
    setDecideModal(null);
    setDecision('');
    setAdminDecisionNote('');
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      setToast({ type: 'error', message: 'Vui lòng chọn quyết định!' });
      return;
    }
    if (!adminDecisionNote.trim()) {
      setToast({ type: 'error', message: 'Vui lòng nhập ghi chú quyết định!' });
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reports/${decideModal.reportId}/decide`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ decision, adminDecisionNote }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || JSON.stringify(err.errors) || `HTTP ${res.status}`);
      }
      closeDecide();
      setToast({ type: 'success', message: 'Đã ra quyết định thành công!' });
      await fetchReports();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleViewDetail = async (reportId) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDetailModal(data);
    } catch (err) {
      setToast({ type: 'error', message: `Không thể tải chi tiết: ${err.message}` });
    } finally {
      setDetailLoading(false);
    }
  };

  const canDecide = (status) => {
    const s = (status || '').toLowerCase();
    return s === 'inspectordone' || s === 'underreview';
  };

  // Stats
  const pending     = reports.filter(r => (r.status || '').toLowerCase() === 'pending').length;
  const underReview = reports.filter(r => ['underreview', 'inspectordone'].includes((r.status || '').toLowerCase())).length;
  const resolved    = reports.filter(r => (r.status || '').toLowerCase() === 'resolved').length;
  const dismissed   = reports.filter(r => (r.status || '').toLowerCase().includes('dismissed')).length;

  const statCards = [
    {
      label: 'Tổng',      value: reports.length, icon: 'flag',
      gradient: 'linear-gradient(135deg,#4e2120,#9b3a38)', glow: '0 12px 40px rgba(78,33,32,0.35)',   accent: '#fecaca', sub: '#fca5a5',
    },
    {
      label: 'Pending',   value: pending,         icon: 'schedule',
      gradient: 'linear-gradient(135deg,#92400e,#d97706)', glow: '0 12px 40px rgba(217,119,6,0.35)',   accent: '#fde68a', sub: '#fcd34d',
    },
    {
      label: 'Chờ Admin', value: underReview,     icon: 'hourglass_top',
      gradient: 'linear-gradient(135deg,#1e40af,#3b82f6)', glow: '0 12px 40px rgba(59,130,246,0.35)',  accent: '#bfdbfe', sub: '#93c5fd',
    },
    {
      label: 'Resolved',  value: resolved,        icon: 'check_circle',
      gradient: 'linear-gradient(135deg,#065f46,#10b981)', glow: '0 12px 40px rgba(16,185,129,0.35)',  accent: '#a7f3d0', sub: '#6ee7b7',
    },
    {
      label: 'Dismissed', value: dismissed,       icon: 'block',
      gradient: 'linear-gradient(135deg,#7f1d1d,#dc2626)', glow: '0 12px 40px rgba(220,38,38,0.35)',   accent: '#fecaca', sub: '#fca5a5',
    },
  ];

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">
        {statCards.map(s => (
          <div key={s.label}
            className="relative rounded-3xl overflow-hidden p-5 flex flex-col gap-3 cursor-default hover:-translate-y-1 transition-transform duration-300"
            style={{ background: s.gradient, boxShadow: s.glow }}>
            {/* dot grid */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
            {/* glow blob */}
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-25 blur-2xl pointer-events-none"
              style={{ background: `radial-gradient(circle,${s.accent},transparent)` }} />

            <div className="flex items-center justify-between relative z-10">
              <p className="text-[10px] uppercase font-black tracking-[0.22em]" style={{ color: s.accent }}>{s.label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <span className="material-symbols-outlined text-base text-white" style={{ fontVariationSettings: '"FILL" 1' }}>{s.icon}</span>
              </div>
            </div>
            <h3 className="text-3xl font-headline font-black tracking-tighter text-white relative z-10 leading-none">{s.value}</h3>
            <div className="flex items-center gap-1.5 relative z-10">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.sub }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.sub }}>All time</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(78,33,32,0.1)] border border-rose-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="text-sm text-on-surface-variant">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.06),rgba(78,33,32,0.03))', borderBottom: '2px solid rgba(78,33,32,0.08)' }}>
                  {['Mã đơn', 'Tiêu đề', 'Người gửi', 'Người bị tố cáo', 'Ghi chú Inspector', 'Trạng thái', 'Ngày tạo', ''].map(h => (
                    <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <span className="material-symbols-outlined text-5xl text-rose-200 block mx-auto mb-3">flag</span>
                      <p className="text-sm text-on-surface-variant">Không có tố cáo nào.</p>
                    </td>
                  </tr>
                ) : reports.map(r => (
                  <tr key={r.reportId}
                    className="transition-colors duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(78,33,32,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>

                    {/* Mã đơn */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] font-bold text-on-surface bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 inline-block">
                        {r.orderCode || `#${r.orderId}` || '—'}
                      </span>
                    </td>

                    {/* Tiêu đề */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-on-surface line-clamp-1 max-w-[160px]">{r.title || '—'}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{r.reportTypeName || '—'}</p>
                    </td>

                    {/* Người gửi */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
                          {(r.reporterName || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-on-surface">{r.reporterName || '—'}</p>
                          <p className="text-[10px] text-on-surface-variant">{r.reporterEmail || ''}</p>
                        </div>
                      </div>
                    </td>

                    {/* Người bị tố cáo */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#b45309,#f59e0b)', boxShadow: '0 2px 8px rgba(245,158,11,0.35)' }}>
                          {(r.reportedUserName || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-on-surface">{r.reportedUserName || '—'}</p>
                          <p className="text-[10px] text-on-surface-variant">{r.reportedUserEmail || ''}</p>
                        </div>
                      </div>
                    </td>

                    {/* Ghi chú Inspector */}
                    <td className="px-5 py-4 max-w-[180px]">
                      <p className="text-xs text-on-surface-variant line-clamp-2">{r.inspectorNote || '—'}</p>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>

                    {/* Ngày tạo */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-xs text-on-surface-variant">{formatDate(r.createdAt)}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(r.reportId)}
                          disabled={detailLoading}
                          className="p-2 hover:bg-rose-50 rounded-xl transition-colors inline-flex items-center justify-center"
                          title="Xem chi tiết">
                          <span className="material-symbols-outlined text-primary/60 text-[20px]">visibility</span>
                        </button>
                        {canDecide(r.status) && (
                          <button
                            onClick={() => openDecide(r)}
                            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white inline-flex items-center gap-1.5 whitespace-nowrap hover:opacity-90 transition-opacity"
                            style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 14px rgba(78,33,32,0.35)' }}>
                            <span className="material-symbols-outlined text-[14px]">gavel</span>
                            Quyết định
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Decide Modal ── */}
      {decideModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-black mb-0.5">Admin</p>
                <h2 className="font-headline text-2xl font-black tracking-tighter text-on-surface">Ra quyết định</h2>
              </div>
              <button onClick={closeDecide} className="p-2 hover:bg-rose-50 rounded-xl transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Report info read-only */}
            <div className="bg-rose-50 rounded-xl p-4 space-y-3 border border-rose-100">
              <p className="text-[10px] uppercase tracking-widest text-primary/60 font-black">Thông tin tố cáo</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wide">Tiêu đề</p>
                  <p className="text-sm font-medium mt-0.5 text-on-surface">{decideModal.title}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wide">Loại</p>
                  <p className="text-sm font-medium mt-0.5 text-on-surface">{decideModal.reportTypeName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wide">Người tố cáo</p>
                  <p className="text-sm font-medium mt-0.5 text-on-surface">{decideModal.reporterName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wide">Người bị tố cáo</p>
                  <p className="text-sm font-medium mt-0.5 text-on-surface">{decideModal.reportedUserName || '—'}</p>
                </div>
              </div>
              {decideModal.inspectorNote && (
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wide mb-1">Ghi chú Inspector</p>
                  <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                    <p className="text-sm text-on-surface">{decideModal.inspectorNote}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <StatusBadge status={decideModal.status} />
                <p className="text-xs text-on-surface-variant">{formatDate(decideModal.createdAt)}</p>
              </div>
            </div>

            {/* Decision dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-black text-on-surface">
                Quyết định <span className="text-red-500">*</span>
              </label>
              <select
                value={decision}
                onChange={e => setDecision(e.target.value)}
                className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary/50 text-sm transition-colors">
                <option value="">-- Chọn quyết định --</option>
                <option value="Resolved">Chấp nhận tố cáo (Resolved)</option>
                <option value="Dismissed">Bác bỏ tố cáo (Dismissed)</option>
              </select>
            </div>

            {/* Admin note */}
            <div className="space-y-2">
              <label className="text-sm font-black text-on-surface">
                Ghi chú quyết định <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adminDecisionNote}
                onChange={e => setAdminDecisionNote(e.target.value)}
                placeholder="Nhập lý do / ghi chú quyết định của Admin..."
                rows={4}
                className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary/50 resize-none text-sm transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={closeDecide}
                className="flex-1 px-4 py-3 border border-rose-200 text-on-surface font-black uppercase text-sm rounded-xl hover:bg-rose-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleSubmitDecision} disabled={submitLoading}
                className="flex-1 px-4 py-3 font-black uppercase text-sm rounded-xl hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white transition-opacity"
                style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 14px rgba(78,33,32,0.35)' }}>
                {submitLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Đang xử lý...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">gavel</span>Xác nhận</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal (read-only) ── */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 max-w-3xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-rose-100 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-black mb-0.5">Chi tiết tố cáo</p>
                <h2 className="font-headline text-2xl font-black tracking-tighter text-on-surface">
                  {detailModal.title || 'Chi tiết Report'}
                </h2>
              </div>
              <button onClick={() => setDetailModal(null)} className="p-2 hover:bg-rose-50 rounded-xl transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Thông tin chung */}
            <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-primary/60 font-black">Thông tin chung</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-black mb-1">Mã đơn</p>
                  <span className="font-mono text-sm text-on-surface bg-white px-2 py-1 rounded-lg border border-rose-100 inline-block">
                    #{detailModal.orderId || detailModal.orderCode || '—'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-black mb-1">Phân loại</p>
                  <p className="text-sm font-medium text-on-surface">{detailModal.reportTypeName || detailModal.reportType || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-black mb-1">Trạng thái</p>
                  <StatusBadge status={detailModal.status} />
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-black mb-1">Ngày tạo</p>
                  <p className="text-sm text-on-surface">{formatDate(detailModal.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Người tham gia */}
            <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-primary/60 font-black">Người tham gia</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
                    {((detailModal.reporterName || detailModal.reporterUserName || '?')[0]).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-black mb-0.5">Người gửi tố cáo</p>
                    <p className="text-sm font-medium text-on-surface">{detailModal.reporterName || detailModal.reporterUserName || '—'}</p>
                    {detailModal.reporterEmail && (
                      <p className="text-xs text-on-surface-variant mt-0.5">{detailModal.reporterEmail}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#b45309,#f59e0b)', boxShadow: '0 2px 8px rgba(245,158,11,0.35)' }}>
                    {((detailModal.reportedUserName || detailModal.reportedUser || '?')[0]).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-black mb-0.5">Người bị tố cáo</p>
                    <p className="text-sm font-medium text-on-surface">{detailModal.reportedUserName || detailModal.reportedUser || '—'}</p>
                    {detailModal.reportedUserEmail && (
                      <p className="text-xs text-on-surface-variant mt-0.5">{detailModal.reportedUserEmail}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung tố cáo */}
            {detailModal.content && (
              <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-primary/60 font-black">Nội dung tố cáo</p>
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{detailModal.content}</p>
                </div>
              </div>
            )}

            {/* Xử lý của Inspector */}
            {detailModal.inspectorNote && (
              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-indigo-700 font-black">Xử lý của Inspector</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-indigo-600 uppercase tracking-wide font-black mb-1">Inspector</p>
                    <p className="text-sm text-on-surface">{detailModal.inspectorName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-indigo-600 uppercase tracking-wide font-black mb-1">Thời gian duyệt</p>
                    <p className="text-sm text-on-surface">{formatDate(detailModal.reviewedAt)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-600 uppercase tracking-wide font-black mb-1">Ghi chú Inspector</p>
                  <div className="bg-white rounded-xl p-3 border border-indigo-100">
                    <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{detailModal.inspectorNote}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quyết định của Admin */}
            {detailModal.adminDecision && (
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-purple-700 font-black">Quyết định của Admin</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-purple-600 uppercase tracking-wide font-black mb-1">Quyết định cuối</p>
                    <StatusBadge status={detailModal.adminDecision} />
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-600 uppercase tracking-wide font-black mb-1">Thời gian đóng</p>
                    <p className="text-sm text-on-surface">{formatDate(detailModal.resolvedAt)}</p>
                  </div>
                </div>
                {detailModal.adminName && (
                  <div>
                    <p className="text-[10px] text-purple-600 uppercase tracking-wide font-black mb-1">Admin xử lý</p>
                    <p className="text-sm font-medium text-on-surface">{detailModal.adminName}</p>
                  </div>
                )}
                {detailModal.adminNote && (
                  <div>
                    <p className="text-[10px] text-purple-600 uppercase tracking-wide font-black mb-1">Ghi chú Admin</p>
                    <div className="bg-white rounded-xl p-3 border border-purple-100">
                      <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{detailModal.adminNote}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nút đóng */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailModal(null)}
                className="px-6 py-3 border border-rose-200 text-on-surface font-black uppercase text-sm rounded-xl hover:bg-rose-50 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — PHÂN LOẠI TỐ CÁO (CRUD)
// ════════════════════════════════════════════════════════════════════════════
function ReportTypesTab({ token }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Add modal
  const [addModal, setAddModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Edit modal
  const [editModal, setEditModal] = useState(null); // { id, name }
  const [editTypeName, setEditTypeName] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reports/types`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.reportTypes || data.data || []);
      setTypes(list);
    } catch (err) {
      setToast({ type: 'error', message: `Không thể tải loại tố cáo: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchTypes(); }, [fetchTypes]);

  // ADD
  const handleAdd = async () => {
    if (!newTypeName.trim()) {
      setToast({ type: 'error', message: 'Vui lòng nhập tên loại tố cáo!' });
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reports/types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newTypeName.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || JSON.stringify(err.errors) || `HTTP ${res.status}`);
      }
      setAddModal(false);
      setNewTypeName('');
      setToast({ type: 'success', message: 'Thêm loại tố cáo thành công!' });
      await fetchTypes();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setAddLoading(false);
    }
  };

  // EDIT
  const openEdit = (type) => {
    const id = type.reportTypeId || type.id;
    const name = type.typeName || type.name || '';
    setEditModal({ id, name });
    setEditTypeName(name);
  };

  const handleEdit = async () => {
    if (!editTypeName.trim()) {
      setToast({ type: 'error', message: 'Vui lòng nhập tên loại tố cáo!' });
      return;
    }
    setEditLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reports/types/${editModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editTypeName.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || JSON.stringify(err.errors) || `HTTP ${res.status}`);
      }
      setEditModal(null);
      setEditTypeName('');
      setToast({ type: 'success', message: 'Cập nhật thành công!' });
      await fetchTypes();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setEditLoading(false);
    }
  };

  // DELETE
  const handleDelete = (type) => {
    const id = type.reportTypeId || type.id;
    const name = type.typeName || type.name || '';
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reports/types/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || JSON.stringify(err.errors) || `HTTP ${res.status}`);
      }
      setDeleteConfirm(null);
      setToast({ type: 'success', message: 'Đã xóa loại tố cáo!' });
      await fetchTypes();
    } catch (err) {
      setDeleteConfirm(null);
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)', boxShadow: '0 4px 14px rgba(6,182,212,0.45)' }}>
            <span className="material-symbols-outlined text-white text-xl">category</span>
          </div>
          <div>
            <h3 className="font-headline text-xl font-black uppercase tracking-tighter text-on-surface">
              Danh mục loại tố cáo
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse inline-block" />
              {types.length} loại đang hoạt động
            </p>
          </div>
        </div>
        <button
          onClick={() => { setAddModal(true); setNewTypeName(''); }}
          className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 14px rgba(78,33,32,0.35)' }}>
          <span className="material-symbols-outlined text-[16px]">add</span>
          Thêm mới
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(78,33,32,0.1)] border border-rose-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="text-sm text-on-surface-variant">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'linear-gradient(90deg,rgba(78,33,32,0.06),rgba(78,33,32,0.03))', borderBottom: '2px solid rgba(78,33,32,0.08)' }}>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Tên loại tố cáo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {types.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-rose-200 block mx-auto mb-3">category</span>
                    <p className="text-sm text-on-surface-variant">Chưa có loại tố cáo nào.</p>
                  </td>
                </tr>
              ) : types.map(type => {
                const id = type.reportTypeId || type.id;
                const name = type.typeName || type.name || '—';
                return (
                  <tr key={id}
                    className="transition-colors duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(78,33,32,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] text-on-surface-variant bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 inline-block">#{id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-on-surface">{name}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(type)}
                          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                          style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(type)}
                          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                          style={{ background: 'linear-gradient(135deg,#7f1d1d,#dc2626)', boxShadow: '0 2px 8px rgba(220,38,38,0.3)' }}>
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── ADD MODAL ── */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-black mb-0.5">Thêm mới</p>
                <h2 className="font-headline text-xl font-black tracking-tighter text-on-surface">Loại tố cáo</h2>
              </div>
              <button onClick={() => setAddModal(false)} className="p-2 hover:bg-rose-50 rounded-xl transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-on-surface">
                Tên loại tố cáo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
                placeholder="VD: Hàng giả / Hàng nhái..."
                className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary/50 text-sm transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAddModal(false)}
                className="flex-1 px-4 py-3 border border-rose-200 text-on-surface font-black uppercase text-sm rounded-xl hover:bg-rose-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleAdd} disabled={addLoading}
                className="flex-1 px-4 py-3 font-black uppercase text-sm rounded-xl hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white transition-opacity"
                style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 4px 14px rgba(78,33,32,0.35)' }}>
                {addLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Đang lưu...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">add</span>Thêm</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-black mb-0.5">Chỉnh sửa</p>
                <h2 className="font-headline text-xl font-black tracking-tighter text-on-surface">Loại tố cáo #{editModal.id}</h2>
              </div>
              <button onClick={() => setEditModal(null)} className="p-2 hover:bg-rose-50 rounded-xl transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-on-surface">
                Tên loại tố cáo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editTypeName}
                onChange={e => setEditTypeName(e.target.value)}
                className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary/50 text-sm transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleEdit()}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditModal(null)}
                className="flex-1 px-4 py-3 border border-rose-200 text-on-surface font-black uppercase text-sm rounded-xl hover:bg-rose-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleEdit} disabled={editLoading}
                className="flex-1 px-4 py-3 font-black uppercase text-sm rounded-xl hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white transition-opacity"
                style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)', boxShadow: '0 4px 14px rgba(59,130,246,0.35)' }}>
                {editLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Đang lưu...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">save</span>Lưu</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 max-w-sm w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-500"
                  style={{ fontVariationSettings: '"FILL" 1' }}>
                  delete
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-lg font-black tracking-tighter text-on-surface">Xác nhận xóa</h3>
              <p className="text-sm text-on-surface-variant mt-2">
                Bạn có chắc muốn xóa loại tố cáo{' '}
                <span className="font-bold text-on-surface">"{deleteConfirm.name}"</span>?
              </p>
              <p className="text-xs text-red-500 mt-1">Hành động này không thể hoàn tác.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 border border-rose-200 text-on-surface font-black uppercase text-sm rounded-xl hover:bg-rose-50 transition-colors disabled:opacity-60">
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 font-black uppercase text-sm rounded-xl hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white transition-opacity"
                style={{ background: 'linear-gradient(135deg,#7f1d1d,#dc2626)', boxShadow: '0 4px 14px rgba(220,38,38,0.35)' }}>
                {deleteLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Đang xóa...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">delete</span>Xóa</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function AdminReportManagement() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;
  const [activeTab, setActiveTab] = useState('reports');

  const tabs = [
    { key: 'reports', label: 'Danh sách Tố cáo', icon: 'flag' },
    { key: 'types',   label: 'Phân loại Tố cáo', icon: 'category' },
  ];

  return (
    <div className="bg-[#fff4f3] font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />

      <main className="ml-64 pt-8 px-8 pb-16 min-h-screen">

        {/* ── Page header ── */}
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#4e2120,#9b3a38)', boxShadow: '0 6px 20px rgba(78,33,32,0.4)' }}>
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>flag</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-0.5">Admin</p>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none">Quản lý Tố Cáo</h1>
            <p className="text-sm text-on-surface-variant mt-1">Xem xét và ra quyết định cho các tố cáo trên nền tảng</p>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex items-center gap-2 mb-8 p-1.5 rounded-2xl bg-white shadow-[0_4px_20px_rgba(78,33,32,0.1)] border border-rose-100 w-fit">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(78,33,32,0.05)' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'text-white shadow-[0_4px_14px_rgba(78,33,32,0.35)]'
                    : 'text-on-surface-variant hover:bg-rose-50 hover:text-on-surface'
                }`}
                style={activeTab === tab.key ? { background: 'linear-gradient(135deg,#4e2120,#9b3a38)' } : {}}>
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'reports' && <ReportsTab token={token} />}
        {activeTab === 'types'   && <ReportTypesTab token={token} />}
      </main>
    </div>
  );
}
