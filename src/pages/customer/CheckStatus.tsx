import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { Loader2, Store } from 'lucide-react';
import { diningSessionApi } from '@/api/dining-session.api';

const CheckStatus = () => {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');
  const navigate = useNavigate();
  const setSessionId = useCartStore((state) => state.setSessionId);
  const [error, setError] = useState<string | null>(null);
  const isCalledRef = useRef(false);

  useEffect(() => {
    const initSession = async () => {
      if (!tableId) {
        setError('Mã bàn không hợp lệ. Vui lòng quét lại QR code!');
        return;
      }

      if (isCalledRef.current) return;
      isCalledRef.current = true;

      try {
        // Gọi xuống Backend để xin sessionId
        const res = await diningSessionApi.checkStatus(tableId);
        const data = res as any;
        console.log("Session từ API:", data.sessionId);
        // Lưu sessionId vào bộ nhớ cục bộ (Zustand)
        setSessionId(data.sessionId);
        console.log(useCartStore.getState().sessionId);
        // Xin thành công -> Đá sang trang Menu kèm tableId để hiển thị UI
        navigate(`/menu/items?tableId=${tableId}`, { replace: true });
      } catch (err: any) {
        isCalledRef.current = false; // Cho phép thử lại nếu lỗi
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối đến bàn này.');
      }
    };

    initSession();
  }, [tableId, navigate, setSessionId]);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4">
          <Store className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Không thể truy cập</h1>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-orange-600" />
      <h1 className="text-lg font-semibold text-gray-900">Đang chuẩn bị bàn...</h1>
      <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
    </div>
  );
};

export default CheckStatus;