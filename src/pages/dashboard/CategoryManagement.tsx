import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/queries/useCategoryQueries';
import { Loader2, Plus, Edit, Trash2, Tags } from 'lucide-react';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

const CategoryManagement = () => {
  const { data, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const categories = data?.data || [];

  // Quản lý trạng thái Dialog (Modal) của shadcn
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setCategoryName('');
    setIsOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setIsOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Xóa danh mục "${name}"? Lưu ý: Không thể xóa nếu danh mục này đang chứa món ăn.`)) {
      deleteCategory(id, {
        onSuccess: () => alert('Đã xóa thành công!'),
        onError: () => alert('Lỗi: Danh mục này đang chứa món ăn, vui lòng chuyển món sang danh mục khác trước khi xóa.'),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingId) {
      updateCategory({ id: editingId, data: { name: categoryName } }, {
        onSuccess: () => setIsOpen(false)
      });
    } else {
      createCategory({ name: categoryName }, {
        onSuccess: () => setIsOpen(false)
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Nút Thêm */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <Tags className="h-6 w-6 text-orange-600" /> Quản lý Danh mục
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Phân loại món ăn theo nhóm (Lẩu, Nướng, Nước...)</p>
        </div>
        <Button onClick={openAddModal} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      {/* Bảng dữ liệu bọc trong Card của shadcn */}
      <Card className="max-w-3xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-semibold text-slate-900">Tên danh mục</TableHead>
                <TableHead className="w-32 text-right font-semibold text-slate-900">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    Chưa có danh mục nào.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} className="transition-colors hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-700">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditModal(category)}
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal / Dialog của shadcn */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input
                id="name"
                required
                autoFocus
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ví dụ: Đồ uống, Khai vị..."
                className="focus-visible:ring-orange-500"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating} className="bg-orange-600 hover:bg-orange-700">
                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu lại
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;