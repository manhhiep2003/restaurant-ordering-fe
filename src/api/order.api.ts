import type { CreateOrderPayload } from '@/types/order';
import axiosClient from './axios.client';

export const orderApi = {
  createOrder: (data: CreateOrderPayload) => {
    return axiosClient.post('/orders', data);
  },
};