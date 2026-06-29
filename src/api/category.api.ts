import axiosClient from "@/api/axios.client";
import type { Category } from "@/types/category";

export const categoryApi = {
  getAllCategories: () => {
    return axiosClient.get<{ data: Category[] }>('/categories');
  },
};