import axiosClient from "@/api/axios.client";
import type { Product, ProductPayload } from "@/types/product";

export const productApi = {
  getAllProducts: () => {
    return axiosClient.get<{ data: Product[]; meta: any }>('/products');
  },

  createProduct: (data: ProductPayload) => {
    return axiosClient.post<Product>('/products', data);
  },

  updateProduct: (id: string, data: Partial<ProductPayload>) => {
    return axiosClient.patch<Product>(`/products/${id}`, data);
  },

  deleteProduct: (id: string) => {
    return axiosClient.delete(`/products/${id}`);
  },
};