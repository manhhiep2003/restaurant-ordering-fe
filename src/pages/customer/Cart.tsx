import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { useCreateOrder } from '../../queries/useOrderQueries';
import { ChevronLeft, Loader2, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTable } from '@/queries/useTableQueries';

const Cart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');

  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { data } = useTable(tableId);
  const table = data?.data;

  const handleOrder = () => {
    if (cart.length === 0 || !tableId) return;
    
    createOrder({
      tableId,
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
    }, {
      onSuccess: () => {
        alert('Ting ting! Bếp đã nhận được đơn của bạn.');
        clearCart();
        navigate(`/menu/items?tableId=${tableId}`, { replace: true });
      },
      onError: () => alert('Có lỗi xảy ra, vui lòng thử lại!')
    });
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="mb-4 rounded-full bg-gray-200 p-6"><Trash2 className="h-10 w-10 text-gray-400" /></div>
        <h2 className="text-xl font-bold text-gray-800">Chưa có món nào</h2>
        <p className="mt-2 text-sm text-gray-500">Vui lòng quay lại thực đơn để chọn món nhé.</p>
        <Button onClick={() => navigate(`/menu/items?tableId=${tableId}`)} className="mt-6 bg-red-600 hover:bg-red-700">
          Quay lại thực đơn
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white pb-24 shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 bg-white p-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Xác nhận gọi món - Bàn {table?.name}</h1>
      </header>

      {/* Danh sách món */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
            {/* Ảnh thu nhỏ (mock) */}
            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <img src={'https://via.placeholder.com/150?text=Food'} alt={item.name} className="h-full w-full object-cover" />
            </div>
            
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">Buffet / Tự gọi</p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold text-red-600">{item.price > 0 ? `${item.price.toLocaleString()}đ` : ''}</span>
                
                {/* Nút tăng giảm */}
                <div className="flex items-center gap-4 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm">
                  <button onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-red-600">
                    <Minus size={16} />
                  </button>
                  <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-red-600">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thanh Xác Nhận Gọi Món (Gogi Style) */}
      <div className="fixed bottom-0 z-50 w-full max-w-md border-t border-gray-100 bg-white p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <p className="mb-2 text-xs text-gray-500">Sẽ được cộng vào bill thanh toán</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-gray-600">Tạm tính:</span>
            <span className="text-xl font-bold text-red-600">{totalPrice.toLocaleString()}đ</span>
          </div>
          <Button 
            disabled={isPending}
            onClick={handleOrder} 
            className="rounded-lg bg-red-600 px-8 py-6 text-base font-bold text-white hover:bg-red-700"
          >
            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Gọi món'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;