import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';

const API_BASE = '/api/v1';

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

const STATUS_CFG = {
  pending:              { label: 'Pending',           color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  underreview:          { label: 'Under Review',      color: 'bg-blue-100 text-blue-700 border-blue-200' },
  inspectordone:        { label: 'Inspector Done',    color: 'bg-purple-100 text-purple-700 border-purple-200' },
  dismissedbyinspector: { label: 'Dismissed (Insp.)', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  resolved:             { label: 'Resolved',          color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  dismissed:            { label: 'Dismissed',         color: 'bg-red-100 text-red-700 border-red-200' },
};

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase().replace(/\s/g, '');
  const cfg = STATUS_CFG[key] || { label: status || '—', color: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// ── Toast component ───────────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
            <span className={`material-symbols-outlined text-4xl ${toast.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}
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
        <button onClick={onClose}
          className={`w-full px-4 py-3 font-bold uppercase text-sm rounded-lg hover:opacity-90 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
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
  const [decideModal, setDecideModal] = useState(null); // report object
  const [decision, setDecision] = useState('');
  const [adminDecisionNote, setAdminDecisionNote] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

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
      fetchReports();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitLoading(false);
    }
  };

  const canDecide = (status) => {
    const s = (status || '').toLowerCase();
    return s === 'inspectordone' || s === 'underreview';
  };

  // Stats
  const pending      = reports.filter(r => (r.status || '').toLowerCase() === 'pending').length;
  const underReview  = reports.filter(r => ['underreview','inspectordone'].includes((r.status || '').toLowerCase())).length;
  const resolved     = reports.filter(r => (r.status || '').toLowerCase() === 'resolved').length;
  const dismissed    = reports.filter(r => (r.status || '').toLowerCase().includes('dismissed')).length;

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Tổng', value: reports.length, color: 'text-on-surface' },
          { label: 'Pending', value: pending, color: 'text-yellow-600' },
          { label: 'Chờ Admin', value: underReview, color: 'text-blue-600' },
          { label: 'Resolved', value: resolved, color: 'text-emerald-600' },
          { label: 'Dismissed', value: dismissed, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-outline-variant/20 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{s.label}</p>
            <p className={`font-headline text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                  {['Mã đơn', 'Tiêu đề', 'Người gửi', 'Người bị tố cáo', 'Ghi chú Inspector', 'Trạng thái', 'Ngày tạo', ''].map(h => (
                    <th key={h} className="px-5 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {reports.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-16 text-center text-on-surface-variant text-sm">Không có tố cáo nào.</td></tr>
                ) : reports.map(r => (
                  <tr key={r.reportId} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-on-surface">{r.orderCode || `#${r.orderId}` || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-on-surface line-clamp-1 max-w-[160px]">{r.title || '—'}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{r.reportTypeName || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-on-surface">{r.reporterName || '—'}</p>
                      <p className="text-[10px] text-on-surface-variant">{r.reporterEmail || ''}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-on-surface">{r.reportedUserName || '—'}</p>
                      <p className="text-[10px] text-on-surface-variant">{r.reportedUserEmail || ''}</p>
                    </td>
                    <td className="px-5 py-4 max-w-[180px]">
                      <p className="text-xs text-on-surface-variant line-clamp-2">{r.inspectorNote || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-xs text-on-surface-variant">{formatDate(r.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {canDecide(r.status) && (
                        <button
                          onClick={() => openDecide(r)}
                          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <span className="material-symbols-outlined text-[14px]">gavel</span>
                          Quyết định
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decide Modal */}
      {decideModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Admin</p>
                <h2 className="font-headline text-2xl font-bold mt-1">Ra quyết định</h2>
              </div>
              <button onClick={closeDecide} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Report info read-only */}
            <div className="bg-surface-container-lowest rounded-xl p-4 space-y-3 border border-outline-variant/20">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Thông tin tố cáo</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">Tiêu đề</p>
                  <p className="text-sm font-medium mt-0.5">{decideModal.title}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">Loại</p>
                  <p className="text-sm font-medium mt-0.5">{decideModal.reportTypeName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">Người tố cáo</p>
                  <p className="text-sm font-medium mt-0.5">{decideModal.reporterName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">Người bị tố cáo</p>
                  <p className="text-sm font-medium mt-0.5">{decideModal.reportedUserName || '—'}</p>
                </div>
              </div>
              {decideModal.inspectorNote && (
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Ghi chú Inspector</p>
                  <div className="bg-white rounded-lg p-3 border border-outline-variant/20">
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
              <label className="text-sm font-bold text-on-surface">
                Quyết định <span className="text-red-500">*</span>
              </label>
              <select
                value={decision}
                onChange={e => setDecision(e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
              >
                <option value="">-- Chọn quyết định --</option>
                <option value="Resolved">Chấp nhận tố cáo (Resolved)</option>
                <option value="Dismissed">Bác bỏ tố cáo (Dismissed)</option>
              </select>
            </div>

            {/* Admin note */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">
                Ghi chú quyết định <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adminDecisionNote}
                onChange={e => setAdminDecisionNote(e.target.value)}
                placeholder="Nhập lý do / ghi chú quyết định của Admin..."
                rows={4}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={closeDecide}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90">
                Hủy
              </button>
              <button onClick={handleSubmitDecision} disabled={submitLoading}
                className="flex-1 px-4 py-3 bg-primary text-on-primary font-bold uppercase text-sm rounded-lg hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
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
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setAddModal(false);
      setNewTypeName('');
      setToast({ type: 'success', message: 'Thêm loại tố cáo thành công!' });
      fetchTypes();
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
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setEditModal(null);
      setEditTypeName('');
      setToast({ type: 'success', message: 'Cập nhật thành công!' });
      fetchTypes();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setEditLoading(false);
    }
  };

  // DELETE
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setDeleteConfirm(null);
      setToast({ type: 'success', message: 'Đã xóa loại tố cáo!' });
      fetchTypes();
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

      {/* Header + Add button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-black uppercase tracking-tighter text-on-surface">
            Danh mục loại tố cáo
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">{types.length} loại</p>
        </div>
        <button
          onClick={() => { setAddModal(true); setNewTypeName(''); }}
          className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tên loại tố cáo</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {types.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-16 text-center text-on-surface-variant text-sm">Chưa có loại tố cáo nào.</td></tr>
              ) : types.map(type => {
                const id = type.reportTypeId || type.id;
                const name = type.typeName || type.name || '—';
                return (
                  <tr key={id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-on-surface-variant">#{id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-on-surface">{name}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(type)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 inline-flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(type)}
                          className="px-4 py-2 bg-error text-on-error rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 inline-flex items-center gap-1.5"
                        >
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

      {/* ADD MODAL */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Thêm mới</p>
                <h2 className="font-headline text-xl font-bold mt-1">Loại tố cáo</h2>
              </div>
              <button onClick={() => setAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">
                Tên loại tố cáo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
                placeholder="VD: Hàng giả / Hàng nhái..."
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAddModal(false)}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90">
                Hủy
              </button>
              <button onClick={handleAdd} disabled={addLoading}
                className="flex-1 px-4 py-3 bg-primary text-on-primary font-bold uppercase text-sm rounded-lg hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
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

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Chỉnh sửa</p>
                <h2 className="font-headline text-xl font-bold mt-1">Loại tố cáo #{editModal.id}</h2>
              </div>
              <button onClick={() => setEditModal(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">
                Tên loại tố cáo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editTypeName}
                onChange={e => setEditTypeName(e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyDown={e => e.key === 'Enter' && handleEdit()}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditModal(null)}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90">
                Hủy
              </button>
              <button onClick={handleEdit} disabled={editLoading}
                className="flex-1 px-4 py-3 bg-blue-500 text-white font-bold uppercase text-sm rounded-lg hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
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

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-500"
                  style={{ fontVariationSettings: '"FILL" 1' }}>
                  delete
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Xác nhận xóa</h3>
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
                className="flex-1 px-4 py-3 border border-outline-variant text-on-surface font-bold uppercase text-sm rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
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
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <AdminSidebar />
      <AdminTopBar title="Quản lý Tố Cáo" />

      <main className="ml-64 pt-24 px-8 pb-12 min-h-screen">
        {/* Page header */}
        <div className="mb-8">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Admin</span>
          <h2 className="font-headline text-4xl font-black text-on-surface tracking-tighter mt-1">
            Quản lý Tố Cáo
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-outline-variant/20">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm uppercase tracking-tight transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'text-primary border-b-primary'
                  : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'reports' && <ReportsTab token={token} />}
        {activeTab === 'types'   && <ReportTypesTab token={token} />}
      </main>
    </div>
  );
}
