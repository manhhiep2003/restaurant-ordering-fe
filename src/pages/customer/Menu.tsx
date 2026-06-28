import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../queries/useProductQueries';
import { useCartStore } from '../../store/cart.store';
import { Loader2, Plus, ShoppingBag } from 'lucide-react';
import { formatVND } from '@/lib/currency';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useProducts();
  
  // Lấy hàm addItem và các biến tổng từ Zustand Store
  const addItem = useCartStore((state) => state.addItem);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (isError) return <div className="mt-10 text-center text-red-500 font-medium">Lỗi khi tải thực đơn!</div>;

  const products = data?.data || [];

  return (
    <div className="relative min-h-screen bg-gray-50 pb-28">
      <div className="p-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Thực Đơn</h1>
        
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center rounded-xl bg-white p-3 shadow-sm border border-gray-100">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>
                )}
              </div>

              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-1 font-medium text-blue-600">{formatVND(Number(product.price))}</p>
              </div>

              <button
                disabled={!product.isAvailable}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-all active:scale-90
                  ${product.isAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'}
                `}
                onClick={() => {
                  addItem(product);
                  // Có thể tích hợp Shadcn Toast ở đây để báo "Đã thêm"
                }}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Thanh Giỏ Hàng Nổi (Chỉ hiện khi có món) */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button
            onClick={() => navigate(`/menu/cart?tableId=${tableId}`)}
            className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                  {totalItems}
                </span>
              </div>
              <span className="font-semibold">Xem giỏ hàng</span>
            </div>
            <span className="font-bold">{formatVND(totalPrice)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;