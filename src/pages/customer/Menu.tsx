import { useProducts } from '../../queries/useProductQueries';
import { Loader2, Plus } from 'lucide-react';

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Menu = () => {
  const { data, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 text-center text-red-500 font-medium">
        Lỗi khi tải thực đơn! Vui lòng thử lại.
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Thực Đơn</h1>
      
      <div className="grid gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex items-center rounded-xl bg-white p-3 shadow-sm border border-gray-100"
          >
            {/* Cột 1: Ảnh món ăn */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Cột 2: Tên & Giá */}
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-1 font-medium text-blue-600">
                {formatVND(product.price)}
              </p>
              {!product.isAvailable && (
                <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  Hết món
                </span>
              )}
            </div>

            {/* Cột 3: Nút thêm vào giỏ */}
            <button
              disabled={!product.isAvailable}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors
                ${product.isAvailable ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' : 'bg-gray-300'}
              `}
              onClick={() => {
                // TODO: Tích hợp Zustand gọi action thêm vào giỏ hàng
                console.log('Thêm món:', product.name);
              }}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;