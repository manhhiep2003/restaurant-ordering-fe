import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useTables = (page: number = 1) => {
  return useQuery({
    queryKey: ['tables', page], 
    queryFn: () => tableApi.getAllTables(page, 10),
    placeholderData: (previousData) => previousData,
  });
};

export const useOpenTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tableApi.openTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

export const useCloseTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tableApi.closeTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

export const useTable = (tableId: string | null) => {
  return useQuery({
    queryKey: ['table', tableId],
    queryFn: () => {
      if (!tableId) throw new Error('Không tìm thấy bàn');
      return tableApi.getTableById(tableId);
    },
    enabled: !!tableId,
  });
};