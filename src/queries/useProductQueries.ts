import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAllProducts(),
    staleTime: 5 * 60 * 1000, // Cache dữ liệu 5 phút, trong 5 phút khách chuyển trang sẽ không gọi lại API
  });
};