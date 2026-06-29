import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/order.api';
import axiosClient from '@/api/axios.client';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: orderApi.createOrder,
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => {
      return axiosClient.patch(`/orders/${orderId}/status`, { status });
    },
  });
};

export const useTableBill = (tableId: string | null) => {
  return useQuery({
    queryKey: ['tableBill', tableId],
    queryFn: () => {
      if (!tableId) throw new Error('Không có mã bàn');
      return orderApi.getBill(tableId);
    },
    enabled: !!tableId,
    retry: false,
  });
};

export const useCheckoutTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};