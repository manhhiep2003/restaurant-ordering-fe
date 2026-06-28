import { useMutation } from '@tanstack/react-query';
import { orderApi } from '../api/order.api';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: orderApi.createOrder,
  });
};