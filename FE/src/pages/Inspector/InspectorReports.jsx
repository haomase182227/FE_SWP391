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

  // Tab state
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'handled'

  const [reports, setReports] = useState([]);
  const [handledReports, setHandledReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state (xử lý tố cáo)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [inspectorNote, setInspectorNote] = useState('');
  const [decision, setDecision] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal chi tiết (read-only)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [reportDetail, setReportDetail] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const closeToast = () => setToast(null);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/inspector/reports`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.reports || data.data || []);
        setReports(list);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('[InspectorReports] Fetch error:', err);
      setError(`Không thể tải danh sách tố cáo: ${err.message}`);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchHandledReports = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/inspector/reports/handled`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.reports || data.data || []);
        setHandledReports(list);
      } else {
        setHandledReports([]);
      }
    } catch (err) {
      console.error('[InspectorReports] Fetch handled error:', err);
      setError(`Không thể tải danh sách đã xử lý: ${err.message}`);
      setHandledReports([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchReports();
    } else {
      fetchHandledReports();
    }
  }, [activeTab, fetchReports, fetchHandledReports]);

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

  const handleViewDetail = async (reportId) => {
    try {
      const response = await fetch(`${API_BASE}/inspector/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (!response.ok) {
        showToast('error', 'Không thể tải chi tiết tố cáo!');
        return;
      }

      const data = await response.json();
      setReportDetail(data);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('[ViewDetail] Error:', err);
      showToast('error', 'Có lỗi xảy ra khi tải chi tiết!');
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setReportDetail(null);
  };

  const pendingReports  = reports.filter(r => (r.status || '').toLowerCase() === 'pending');
  const underReview     = reports.filter(r => (r.status || '').toLowerCase() === 'underreview');
  const totalCount      = reports.length + handledReports.length;

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
              <p className="font-headline text-3xl font-bold text-emerald-600 mt-1">{handledReports.length}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-outline-variant/20">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all relative ${
              activeTab === 'pending'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Cần xử lý
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('handled')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all relative ${
              activeTab === 'handled'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Đã xử lý
            {activeTab === 'handled' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

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

            {/* ── TAB 1: CẦN XỬ LÝ ── */}
            {activeTab === 'pending' && (
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
            )}

            {/* ── TAB 2: ĐÃ XỬ LÝ ── */}
            {activeTab === 'handled' && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-headline text-xl font-black uppercase tracking-tighter text-on-surface">
                    Đã xử lý
                  </h2>
                  <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-outline-variant/20">
                    {handledReports.length}
                  </span>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Mã đơn</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tiêu đề</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Loại tố cáo</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Trạng thái</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {handledReports.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                              Chưa có tố cáo nào được xử lý.
                            </td>
                          </tr>
                        ) : handledReports.map((report) => (
                          <tr key={report.reportId || report.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-xs font-mono text-on-surface-variant">
                                #{report.orderId || report.orderCode || '—'}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-on-surface line-clamp-1">
                                {report.title || '—'}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-on-surface">
                                {report.reportTypeName || report.reportType || '—'}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={report.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleViewDetail(report.reportId || report.id)}
                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center justify-center"
                                title="Xem chi tiết"
                              >
                                <span className="material-symbols-outlined text-primary text-[20px]">visibility</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

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

      {/* ── MODAL CHI TIẾT (READ-ONLY) ── */}
      {isDetailModalOpen && reportDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Chi tiết tố cáo</p>
                <h2 className="font-headline text-2xl font-bold mt-1 text-on-surface">
                  {reportDetail.title || 'Chi tiết Report'}
                </h2>
              </div>
              <button onClick={closeDetailModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Thông tin chung */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Thông tin chung</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold mb-1">Mã đơn</p>
                  <p className="text-sm font-mono text-on-surface">
                    #{reportDetail.orderId || reportDetail.orderCode || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold mb-1">Phân loại</p>
                  <p className="text-sm font-medium text-on-surface">
                    {reportDetail.reportTypeName || reportDetail.reportType || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold mb-1">Trạng thái</p>
                  <StatusBadge status={reportDetail.status} />
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold mb-1">Ngày tạo</p>
                  <p className="text-sm text-on-surface">{formatDate(reportDetail.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Người tham gia */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Người tham gia</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold mb-1">Người gửi tố cáo</p>
                  <p className="text-sm font-medium text-on-surface">
                    {reportDetail.reporterName || reportDetail.reporterUserName || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold mb-1">Người bị tố cáo</p>
                  <p className="text-sm font-medium text-on-surface">
                    {reportDetail.reportedUserName || reportDetail.reportedUser || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Nội dung gốc */}
            {reportDetail.content && (
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Nội dung tố cáo</p>
                <div className="bg-white rounded-lg p-4 border border-outline-variant/20">
                  <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                    {reportDetail.content}
                  </p>
                </div>
              </div>
            )}

            {/* Lịch sử xử lý của Inspector */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-blue-700 font-bold">Xử lý của Inspector (Bạn)</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-blue-600 uppercase tracking-wide font-bold mb-1">Quyết định</p>
                  <StatusBadge status={reportDetail.inspectorDecision || reportDetail.decision} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-600 uppercase tracking-wide font-bold mb-1">Thời gian duyệt</p>
                  <p className="text-sm text-on-surface">{formatDate(reportDetail.reviewedAt)}</p>
                </div>
              </div>

              {reportDetail.inspectorNote && (
                <div>
                  <p className="text-[10px] text-blue-600 uppercase tracking-wide font-bold mb-1">Ghi chú của bạn</p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                      {reportDetail.inspectorNote}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quyết định của Admin */}
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-purple-700 font-bold">Quyết định của Admin</p>
              
              {reportDetail.adminDecision ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-purple-600 uppercase tracking-wide font-bold mb-1">Quyết định cuối</p>
                      <StatusBadge status={reportDetail.adminDecision} />
                    </div>
                    <div>
                      <p className="text-[10px] text-purple-600 uppercase tracking-wide font-bold mb-1">Thời gian đóng</p>
                      <p className="text-sm text-on-surface">{formatDate(reportDetail.resolvedAt)}</p>
                    </div>
                  </div>

                  {reportDetail.adminName && (
                    <div>
                      <p className="text-[10px] text-purple-600 uppercase tracking-wide font-bold mb-1">Admin xử lý</p>
                      <p className="text-sm font-medium text-on-surface">{reportDetail.adminName}</p>
                    </div>
                  )}

                  {reportDetail.adminNote && (
                    <div>
                      <p className="text-[10px] text-purple-600 uppercase tracking-wide font-bold mb-1">Ghi chú Admin</p>
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                          {reportDetail.adminNote}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-purple-600 font-medium">Admin đang xem xét</p>
                </div>
              )}
            </div>

            {/* Nút đóng */}
            <div className="flex justify-end pt-2">
              <button
                onClick={closeDetailModal}
                className="px-6 py-3 bg-error text-on-error font-bold uppercase text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                Đóng
              </button>
            </div>
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
