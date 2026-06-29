import { categoryApi } from '@/api/category.api';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAllCategories(),
    staleTime: 30 * 60 * 1000, // Cache 30 phút luôn cho nhẹ server
  });
};