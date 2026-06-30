import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../queries/useProductQueries';
import { useCategories } from '../../queries/useCategoryQueries';
import { useCartStore } from '../../store/cart.store';
import { Loader2, ShoppingCart, BellRing, ClipboardList, Plus, Minus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTable } from '@/queries/useTableQueries';

const Menu = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');

  const { data: productData, isLoading: isProductLoading } = useProducts();
  const { data: categoryData, isLoading: isCategoryLoading } = useCategories();
  
  const products = productData?.data || [];
  const categories = categoryData?.data || [];

  const { cart, addItem, removeItem, updateQuantity } = useCartStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const { data } = useTable(tableId);
  const table = data?.data;

  // State lọc danh mục
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  // State giả lập Tabs (Buffet vs Tính tiền)
  const [orderType, setOrderType] = useState('alacarte');

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'ALL' || p.categoryId === selectedCategory) && p.isAvailable
  );

  const getProductQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  if (isProductLoading || isCategoryLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white pb-24 shadow-xl">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white px-4 pt-4 pb-2 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/cow-logo.png" alt="Logo" className="h-10 w-10 rounded-md bg-gray-100 object-cover" />
            <span className="font-bold text-gray-900">{table?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="destructive" size="sm" className="rounded-full bg-red-600 font-semibold hover:bg-red-700">
              <BellRing className="mr-1 h-4 w-4" /> Gọi NV
            </Button>
            <div className="relative cursor-pointer" onClick={() => navigate(`/menu/cart?tableId=${tableId}`)}>
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 p-0 text-xs text-white">
                  {totalItems}
                </Badge>
              )}
            </div>
            <ClipboardList className="h-6 w-6 text-gray-700 cursor-pointer" />
          </div>
        </div>

        {/* 2. TABS: Buffet vs Gọi món */}
        <Tabs value={orderType} onValueChange={setOrderType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-100 p-1">
            <TabsTrigger value="buffet" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Món buffet</TabsTrigger>
            <TabsTrigger value="alacarte" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Món tính tiền</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* 3. LỌC DANH MỤC (Cuộn ngang) */}
      <div className="sticky top-30 z-30 flex gap-6 overflow-x-auto border-b border-gray-100 bg-white px-4 py-2 text-sm font-medium hide-scrollbar">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`whitespace-nowrap pb-2 transition-all ${selectedCategory === 'ALL' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
        >
          Tất cả
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap pb-2 transition-all ${selectedCategory === cat.id ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. DANH SÁCH MÓN ĂN (Gogi Card Style) */}
      <div className="flex-1 p-4 space-y-5">
        {filteredProducts.map(product => {
          const quantity = getProductQuantity(product.id);

          return (
            <div key={product.id} className="group relative aspect-4/3 w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Food'} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Gradient Đen dưới chân ảnh để làm nổi bật chữ */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="flex flex-col">
                  {orderType === 'buffet' && <span className="text-xs font-bold text-red-500">Buffet</span>}
                  <span className="text-lg font-bold text-white drop-shadow-md">{product.name}</span>
                  {orderType === 'alacarte' && <span className="text-sm font-medium text-gray-200">{Number(product.price).toLocaleString()}đ</span>}
                </div>

                {/* Nút bấm +/- nổi lên trên ảnh */}
                <div className="flex items-center gap-3">
                  {quantity > 0 ? (
                    <div className="flex items-center gap-3 rounded-full bg-white/20 p-1 backdrop-blur-md">
                      <button 
                        onClick={() => quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-4 text-center font-bold text-white">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addItem({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 })}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-600 active:scale-95"
                    >
                      <Plus size={24} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. THANH GIỎ HÀNG NỔI BÊN DƯỚI */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 z-50 w-full max-w-md bg-white p-4 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.1)]">
          <Button 
            onClick={() => navigate(`/menu/cart?tableId=${tableId}`)}
            className="flex w-full items-center justify-between rounded-xl bg-red-600 py-6 text-base font-bold text-white hover:bg-red-700"
          >
            <span>Giỏ đồ ăn * {totalItems} món</span>
            {orderType === 'alacarte' && <span>{cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}đ</span>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Menu;