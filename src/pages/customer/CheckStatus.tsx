import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCheckTableStatus } from '../../queries/useTableQueries';
import { Loader2, AlertCircle } from 'lucide-react';

const CheckStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Lấy tableId từ link QR (VD: thucdon.com/menu?tableId=bfcd94aa-b12d-46f2-afe9-e054190987a0)
  const tableId = searchParams.get('tableId');
  
  // Gọi hook React Query
  const { data, isLoading, isError, error } = useCheckTableStatus(tableId);

  useEffect(() => {
    // Nếu API trả về true (Bàn đã mở), lập tức sang trang gọi món, mang theo tableId
    if (data?.isOpen) {
      navigate(`/menu/items?tableId=${tableId}`, { replace: true });
    }
  }, [data, navigate, tableId]);

  // UI 1: Khách quét QR thiếu tableId
  if (!tableId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="text-xl font-bold">Mã QR không hợp lệ</h1>
        <p className="text-gray-500">Vui lòng quét lại mã QR tại bàn của bạn.</p>
      </div>
    );
  }

  // UI 2: Đang tải (Chờ API Backend trả về)
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-500" />
        <p className="font-medium">Đang kết nối với bàn...</p>
      </div>
    );
  }

  // UI 3: Backend báo lỗi 403 (Bàn chưa mở) hoặc 404 (Bàn không tồn tại)
  if (isError) {
    // Ép kiểu lỗi từ Axios
    const errorMessage = (error as any)?.response?.data?.message || 'Bàn chưa được kích hoạt';
    
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-orange-500" />
        <h1 className="text-xl font-bold">Không thể phục vụ</h1>
        <p className="mt-2 text-gray-500">{errorMessage}</p>
        <p className="mt-4 text-sm font-medium">Vui lòng gọi nhân viên để mở bàn!</p>
      </div>
    );
  }

  // Render rỗng trong lúc chờ useEffect đá sang trang Menu
  return null;
};

export default CheckStatus;