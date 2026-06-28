import axiosClient from "@/api/axios.client";
import type { Product } from "@/types/product";

export const productApi = {
  getAllProducts: () => {
    return axiosClient.get<{ data: Product[]; meta: any }>('/products');
  },
};