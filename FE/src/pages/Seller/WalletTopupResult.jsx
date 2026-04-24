import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const API_BASE = '/api/v1';

export default function WalletTopupResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const query = searchParams.toString();
    fetch(`${API_BASE}/wallet/vnpay/return?${query}`)
      .then(r => r.json())
      .then(data => {
        const msg = data.message ?? '';
        const isSuccess = msg.toLowerCase().includes('thành công') || msg.toLowerCase().includes('success');
        const txnRef = searchParams.get('vnp_TxnRef') ?? searchParams.get('txnRef');
        const rawAmount = searchParams.get('vnp_Amount');
        const amount = rawAmount ? (Number(rawAmount) / 100).toLocaleString('vi-VN') + '₫' : null;
        if (isSuccess) window.dispatchEvent(new Event('walletUpdated'));
        setResult({ isSuccess, message: msg, txnRef, amount });
      })
      .catch(() => {
        const responseCode = searchParams.get('vnp_ResponseCode') ?? searchParams.get('responseCode');
        const status = searchParams.get('status');
        const isSuccess = responseCode === '00' || status === 'success';
        const txnRef = searchParams.get('vnp_TxnRef') ?? searchParams.get('txnRef');
        const rawAmount = searchParams.get('vnp_Amount');
        const amount = rawAmount ? (Number(rawAmount) / 100).toLocaleString('vi-VN') + '₫' : null;
        if (isSuccess) window.dispatchEvent(new Event('walletUpdated'));
        setResult({
          isSuccess,
          message: isSuccess ? 'Nạp tiền vào ví thành công.' : 'Giao dịch không thành công.',
          txnRef,
          amount,
        });
      });
  }, []);

  useEffect(() => {
    if (!result) return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); navigate('/seller/wallet'); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result, navigate]);

  if (!result) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl p-10 max-w-md w-full text-center shadow-xl space-y-6">
        {result.isSuccess ? (
          <>
            <div className="flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-tertiary text-[96px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-2xl font-bold">Nạp tiền thành công</h1>
              <p className="text-on-surface-variant text-sm">{result.message}</p>
              {result.amount && (
                <p className="font-headline text-3xl font-bold text-tertiary mt-2">{result.amount}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-error text-[96px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                cancel
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-2xl font-bold">Nạp tiền thất bại</h1>
              <p className="text-on-surface-variant text-sm">{result.message}</p>
            </div>
          </>
        )}

        {result.txnRef && (
          <p className="text-xs text-on-surface-variant font-mono bg-surface-container-high px-4 py-2 rounded-lg break-all">
            Mã giao dịch: {result.txnRef}
          </p>
        )}

        <p className="text-sm text-on-surface-variant">
          Tự động chuyển về ví sau <span className="font-bold text-primary">{countdown}s</span>
        </p>

        <button
          onClick={() => navigate('/seller/wallet')}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-3 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-all"
        >
          Về ví ngay
        </button>
      </div>
    </main>
  );
}
