import axiosClient from "@/api/axios.client";
import type { Category, CategoryPayload } from "@/types/category";

export const categoryApi = {
  getAllCategories: () => {
    return axiosClient.get<{ data: Category[] }>('/categories');
  },

  createCategory: (data: CategoryPayload) => {
    return axiosClient.post<Category>('/categories', data);
  },

  updateCategory: (id: string, data: Partial<CategoryPayload>) => {
    return axiosClient.patch<Category>(`/categories/${id}`, data);
  },

  deleteCategory: (id: string) => {
    return axiosClient.delete(`/categories/${id}`);
  },
};