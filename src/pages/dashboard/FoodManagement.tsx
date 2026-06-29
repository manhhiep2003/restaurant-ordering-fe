import { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../queries/useProductQueries';
import { Loader2, Plus, Edit, Trash2, X } from 'lucide-react';
import { formatVND } from '@/lib/currency';
import type { ProductPayload, Product } from '@/types/product';
import { useCategories } from '../../queries/useCategoryQueries';

const FoodManagement = () => {
  const { data, isLoading } = useProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const products = data?.data || [];

  // Gọi API lấy danh sách danh mục
  const { data: categoryData, isLoading: isCategoryLoading } = useCategories();
  const categories = categoryData?.data || [];

  // State quản lý Hộp thoại (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State quản lý Form nhập liệu
  const [formData, setFormData] = useState<ProductPayload>({
    name: '',
    price: 0,
    imageUrl: '',
    categoryId: '',
    isAvailable: true,
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
        name: '', 
        price: 0, 
        imageUrl: '', 
        categoryId: '', 
        isAvailable: true });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
      isAvailable: product.isAvailable,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa món "${name}"?`)) {
      deleteProduct(id, {
        onSuccess: () => alert('Đã xóa thành công!'),
        onError: () => alert('Không thể xóa món này (có thể đã nằm trong hóa đơn cũ)'),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct({ id: editingId, data: formData }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createProduct(formData, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thực đơn</h1>
          <p className="text-sm text-gray-500">Thêm, sửa, xóa món ăn trong hệ thống</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-700 active:scale-95 shadow-sm"
        >
          <Plus size={18} /> Thêm món mới
        </button>
      </div>

      {/* Bảng danh sách món ăn */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Tên món</th>
              <th className="px-6 py-4 font-semibold">Giá bán</th>
              <th className="px-6 py-4 font-semibold">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 font-bold text-blue-600">{formatVND(Number(product.price))}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold
                    ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}>
                    {product.isAvailable ? 'Đang bán' : 'Hết món'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(product)} className="mr-3 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id, product.name)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Món ăn */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tên món</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                />
              </div>

              {/* TRƯỜNG CHỌN DANH MỤC (MỚI THÊM) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Danh mục</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  {/* Tùy chọn mặc định khi chưa chọn gì */}
                  <option value="" disabled>-- Chọn danh mục món ăn --</option>
                  
                  {/* Đổ dữ liệu thật từ Backend ra */}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" 
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                  Còn hàng (Cho phép khách gọi món)
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating || isUpdating}
                  className="flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManagement;