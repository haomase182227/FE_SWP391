import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import InspectorSidebar from '../../components/InspectorSidebar';

const API_BASE = '/api/v1';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_CONFIG = {
  pending:            { label: 'Pending',       color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  underreview:        { label: 'Under Review',  color: 'bg-blue-100 text-blue-700 border-blue-200' },
  inspectordone:      { label: 'Inspector Done', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  dismissedbyinspector: { label: 'Dismissed',   color: 'bg-red-100 text-red-700 border-red-200' },
  resolved:           { label: 'Resolved',      color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase().replace(/\s/g, '');
  const cfg = STATUS_CONFIG[key] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function InspectorReports() {
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  const [reports, setReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [inspectorNote, setInspectorNote] = useState('');
  const [decision, setDecision] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [submitLoading, setSubmitLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const closeToast = () => setToast(null);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      // Gọi song song: pending/underreview + history (đã xử lý)
      const [activeRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/inspector/reports`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        }),
        fetch(`${API_BASE}/inspector/reports/history`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        }),
      ]);

      // Active reports (Pending / UnderReview)
      if (activeRes.ok) {
        const data = await activeRes.json();
        const list = Array.isArray(data) ? data : (data.reports || data.data || []);
        setReports(list);
      } else {
        setReports([]);
      }

      // Resolved reports (đã xử lý xong)
      if (historyRes.ok) {
        const data = await historyRes.json();
        const list = Array.isArray(data) ? data : (data.reports || data.data || []);
        setResolvedReports(list);
      } else {
        // Endpoint history không tồn tại → bỏ qua, không báo lỗi
        setResolvedReports([]);
      }
    } catch (err) {
      console.error('[InspectorReports] Fetch error:', err);
      setError(`Không thể tải danh sách tố cáo: ${err.message}`);
      setReports([]);
      setResolvedReports([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const openModal = (report) => {
    setSelectedReport(report);
    setInspectorNote('');
    setDecision('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setInspectorNote('');
    setDecision('');
  };

  const handleSubmitReview = async () => {
    if (!inspectorNote.trim() || !decision) {
      showToast('error', 'Vui lòng điền ghi chú và chọn quyết định!');
      return;
    }
    setSubmitLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/inspector/reports/${selectedReport.reportId}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ inspectorNote, decision }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Lỗi Backend:', errorData);
        showToast('error', errorData.message || JSON.stringify(errorData.errors) || 'Có lỗi xảy ra!');
        return;
      }

      closeModal();
      showToast('success', 'Đã xử lý tố cáo thành công!');
      fetchReports();
    } catch (err) {
      console.error('Lỗi mạng:', err);
      showToast('error', 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setSubmitLoading(false);
    }
  };

  const pendingReports  = reports.filter(r => (r.status || '').toLowerCase() === 'pending');
  const underReview     = reports.filter(r => (r.status || '').toLowerCase() === 'underreview');
  const allResolved     = resolvedReports; // từ endpoint history
  const totalCount      = reports.length + resolvedReports.length;

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex">
      <InspectorSidebar />

      {/* Main content — offset by sidebar width */}
      <main className="ml-64 flex-1 px-8 py-8 max-w-full">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Inspector</p>
          <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface mt-1">
            Quản lý Tố Cáo
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Xem xét và xử lý các tố cáo từ người mua
          </p>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-outline-variant/20 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tổng</p>
              <p className="font-headline text-3xl font-bold text-on-surface mt-1">{totalCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-outline-variant/20 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Chờ xử lý</p>
              <p className="font-headline text-3xl font-bold text-yellow-600 mt-1">{pendingReports.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-outline-variant/20 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Under Review</p>
              <p className="font-headline text-3xl font-bold text-blue-600 mt-1">{underReview.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-outline-variant/20 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Đã xử lý</p>
              <p className="font-headline text-3xl font-bold text-emerald-600 mt-1">{allResolved.length}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-error font-bold">{error}</p>
            <button
              onClick={fetchReports}
              className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Tables */}
        {!loading && !error && (
          <div className="space-y-10">

            {/* ── BẢNG 1: CHỜ XỬ LÝ ── */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-headline text-xl font-black uppercase tracking-tighter text-on-surface">
                  Chờ xử lý
                </h2>
                <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-yellow-200">
                  {pendingReports.length}
                </span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tiêu đề</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Phân loại</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Người tố cáo</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Người bị tố cáo</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Ngày tạo</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Trạng thái</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {pendingReports.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                            Không có tố cáo nào đang chờ xử lý.
                          </td>
                        </tr>
                      ) : pendingReports.map((report) => (
                        <ReportRow
                          key={report.reportId || report.id}
                          report={report}
                          showAction
                          onProcess={() => openModal(report)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── BẢNG 2: ĐÃ XỬ LÝ ── */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-headline text-xl font-black uppercase tracking-tighter text-on-surface">
                  Đã xử lý
                </h2>
                <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-outline-variant/20">
                  {allResolved.length}
                </span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tiêu đề</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Phân loại</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Người tố cáo</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Người bị tố cáo</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Ngày tạo</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Trạng thái</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {allResolved.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                            Chưa có tố cáo nào được xử lý.
                          </td>
                        </tr>
                      ) : allResolved.map((report) => (
                        <ReportRow
                          key={report.reportId || report.id}
                          report={report}
                          showAction={false}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* ── REVIEW MODAL ── */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Xử lý tố cáo</p>
                <h2 className="font-headline text-2xl font-bold mt-1">Review Report</h2>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Thông tin tố cáo (read-only) */}
            <div className="bg-surface-container-lowest rounded-xl p-4 space-y-3 border border-outline-variant/20">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Thông tin tố cáo</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold">Tiêu đề</p>
                  <p className="text-sm font-medium text-on-surface mt-0.5">{selectedReport.title || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold">Phân loại</p>
                  <p className="text-sm font-medium text-on-surface mt-0.5">
                    {selectedReport.reportTypeName || selectedReport.reportType || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold">Người tố cáo</p>
                  <p className="text-sm font-medium text-on-surface mt-0.5">
                    {selectedReport.reporterName || selectedReport.reporterUserName || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold">Người bị tố cáo</p>
                  <p className="text-sm font-medium text-on-surface mt-0.5">
                    {selectedReport.reportedUserName || selectedReport.reportedUser || '—'}
                  </p>
                </div>
              </div>

              {selectedReport.content && (
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold mb-1">Nội dung</p>
                  <div className="bg-white rounded-lg p-3 border border-outline-variant/20">
                    <p className="text-sm text-on-surface leading-relaxed">{selectedReport.content}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <StatusBadge status={selectedReport.status} />
                <p className="text-xs text-on-surface-variant">
                  {formatDate(selectedReport.createdAt)}
                </p>
              </div>
            </div>

            {/* Form xử lý */}
            <div className="space-y-4">
              {/* Ghi chú */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">
                  Ghi chú / Phương án giải quyết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={inspectorNote}
                  onChange={(e) => setInspectorNote(e.target.value)}
                  placeholder="Nhập ghi chú hoặc phương án giải quyết của bạn..."
                  rows={4}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                />
              </div>

              {/* Quyết định */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">
                  Quyết định <span className="text-red-500">*</span>
                </label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
                >
                  <option value="">-- Chọn quyết định --</option>
                  <option value="UnderReview">Chuyển lên Admin duyệt (UnderReview)</option>
                  <option value="InspectorDone">Inspector tự xử lý xong (InspectorDone)</option>
                  <option value="DismissedByInspector">Bác bỏ tố cáo (DismissedByInspector)</option>
                </select>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitLoading}
                className="flex-1 px-4 py-3 bg-primary text-on-primary font-bold uppercase text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">gavel</span>
                    Xác nhận xử lý
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST POPUP ── */}
      {toast && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                <span className={`material-symbols-outlined text-4xl ${
                  toast.type === 'success' ? 'text-emerald-600' : 'text-red-500'
                }`}
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
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
              onClick={closeToast}
              className={`w-full px-4 py-3 font-bold uppercase text-sm rounded-lg hover:opacity-90 transition-opacity ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-error text-on-error'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Row component ────────────────────────────────────────────────────────────
function ReportRow({ report, showAction, onProcess }) {
  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  return (
    <tr className="hover:bg-surface-container-lowest/50 transition-colors">
      {/* Tiêu đề */}
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-on-surface line-clamp-1">{report.title || '—'}</p>
        {report.orderId && (
          <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">#{report.orderId}</p>
        )}
      </td>
      {/* Phân loại */}
      <td className="px-6 py-4">
        <p className="text-sm text-on-surface">
          {report.reportTypeName || report.reportType || '—'}
        </p>
      </td>
      {/* Người tố cáo */}
      <td className="px-6 py-4">
        <p className="text-sm text-on-surface">
          {report.reporterName || report.reporterUserName || '—'}
        </p>
      </td>
      {/* Người bị tố cáo */}
      <td className="px-6 py-4">
        <p className="text-sm text-on-surface">
          {report.reportedUserName || report.reportedUser || '—'}
        </p>
      </td>
      {/* Ngày tạo */}
      <td className="px-6 py-4">
        <p className="text-xs text-on-surface-variant">{formatDate(report.createdAt)}</p>
      </td>
      {/* Trạng thái */}
      <td className="px-6 py-4">
        <StatusBadge status={report.status} />
      </td>
      {/* Thao tác / Ghi chú */}
      <td className="px-6 py-4 text-right">
        {showAction ? (
          <button
            onClick={onProcess}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px]">gavel</span>
            Xử lý
          </button>
        ) : (
          <p className="text-xs text-on-surface-variant line-clamp-2 max-w-[160px] ml-auto text-left">
            {report.inspectorNote || '—'}
          </p>
        )}
      </td>
    </tr>
  );
}
