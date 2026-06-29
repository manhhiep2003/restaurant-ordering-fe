import { useMutation } from '@tanstack/react-query';
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