import { useQuery } from '@tanstack/react-query';
import { tableApi } from '../api/table.api';

export const useCheckTableStatus = (tableId: string | null) => {
  return useQuery({
    queryKey: ['tableStatus', tableId],
    queryFn: () => {
      if (!tableId) throw new Error('Không tìm thấy mã bàn');
      return tableApi.checkStatus(tableId);
    },
    // Chỉ kích hoạt gọi API khi có tableId (để tránh gọi API hỏng khi khách truy cập link sai)
    enabled: !!tableId, 
    retry: false, // Bàn chưa mở là lỗi ngay, không cần thử lại
  });
};