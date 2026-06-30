import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomerHistory } from '../../queries/useOrderQueries';
import { ChevronLeft, Loader2, ReceiptText, Utensils, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');

  // Gọi hook lấy hóa đơn tạm tính của bàn (tổng hợp các món đã order)
  const { data: billData, isLoading } = useCustomerHistory(tableId);

  if (!tableId) {
    return <div className="p-4 text-center text-red-500">Lỗi: Không tìm thấy mã bàn!</div>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gray-50 pb-8 shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 bg-white p-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">Món đã gọi - Bàn {tableId.slice(-4)}</h1>
      </header>

      {/* Body */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500">
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-red-600" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : !billData || billData.orderCount === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm border border-dashed border-gray-200">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <ReceiptText className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Chưa gọi món nào</h2>
            <p className="mt-2 text-sm text-gray-500">Những món bạn gửi bếp sẽ hiển thị tại đây.</p>
            <Button 
              onClick={() => navigate(`/menu/items?tableId=${tableId}`)} 
              className="mt-6 bg-red-600 hover:bg-red-700"
            >
              Xem thực đơn ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Utensils className="h-5 w-5 text-red-500" />
                Số lượt gửi order:
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 text-sm">
                {billData.orderCount} lượt
              </Badge>
            </div>

            <h3 className="pt-2 text-sm font-bold uppercase text-gray-500">Chi tiết các món</h3>
            
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-0">
                <ul className="divide-y divide-gray-100">
                  {billData.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between bg-white p-4 transition-colors hover:bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{item.productName}</span>
                        <span className="mt-1 text-sm font-medium text-gray-500">
                          {Number(item.unitPrice).toLocaleString()}đ
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-red-600">x{item.quantity}</span>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-900 p-4 text-white shadow-lg">
              <span className="text-sm font-medium text-gray-300">Tổng tiền tạm tính:</span>
              <span className="text-xl font-black">{Number(billData.grandTotal).toLocaleString()}đ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;