import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { ArrowLeft, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { formatVND } from '@/lib/currency';
import { useCreateOrder } from '@/queries/useOrderQueries';

const Cart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');

  // Lấy toàn bộ dữ liệu và hàm xử lý từ kho Zustand
  const { cart, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();

  const { mutate: createOrder, isPending } = useCreateOrder();

  const handleOrder = () => {
    if (cart.length === 0 || !tableId) return;
    
    const payload = {
      tableId: tableId,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        note: item.note,
      })),
    };

    // Bắn API
    createOrder(payload, {
      onSuccess: () => {
        alert('Ting ting! Bếp đã nhận được đơn của bạn.');
        clearCart(); // Xóa sạch giỏ hàng sau khi gửi
        navigate(`/menu/items?tableId=${tableId}`, { replace: true }); // Quay lại Menu
      },
      onError: (error: any) => {
        const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
        alert(`Lỗi: ${errorMsg}`);
      }
    });
  };

  // Giao diện khi giỏ hàng không có món nào
  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 p-4">
        <button onClick={() => navigate(-1)} className="mb-6 w-fit flex items-center text-gray-600 active:scale-95">
          <ArrowLeft className="mr-2 h-5 w-5" /> Quay lại thực đơn
        </button>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <Trash2 className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Giỏ hàng trống</h2>
          <p className="mt-2 text-gray-500">Hãy quay lại và chọn vài món ngon nhé!</p>
        </div>
      </div>
    );
  }

  // Giao diện khi có món trong giỏ
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 pb-32">
      {/* Header cố định trên cùng */}
      <div className="sticky top-0 z-10 flex items-center bg-white p-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-2 p-1 text-gray-600 active:scale-90">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
      </div>

      {/* Danh sách món đã chọn */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={`${item.id}-${item.note}`} className="flex items-center rounded-xl bg-white p-3 shadow-sm border border-gray-100">
              {/* Hình ảnh */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>
                )}
              </div>

              {/* Thông tin */}
              <div className="ml-3 flex-1">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="font-medium text-blue-600">{formatVND(Number(item.price))}</p>
                {item.note && <p className="mt-1 text-xs italic text-gray-500">Ghi chú: {item.note}</p>}
              </div>

              {/* Nhóm nút Tăng/Giảm/Xóa */}
              <div className="ml-2 flex flex-col items-end gap-2">
                <button onClick={() => removeItem(item.id)} className="p-1 text-red-500 active:scale-90">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center text-gray-600 active:bg-gray-200 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center text-gray-600 active:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer cố định dưới cùng để Bấm Gửi */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-medium text-gray-600">Tổng cộng:</span>
          <span className="text-xl font-bold text-red-600">{formatVND(totalPrice)}</span>
        </div>
        <button
          onClick={handleOrder}
          disabled={isPending}
          className={`flex w-full items-center justify-center rounded-xl py-3.5 text-center font-bold text-white shadow-md transition-all 
            ${isPending ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}
          `}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang gửi đơn...
            </>
          ) : (
            'Gửi Bếp Nấu Ngay'
          )}
        </button>
      </div>
    </div>
  );
};

export default Cart;