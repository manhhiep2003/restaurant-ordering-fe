import type { CreateOrderPayload } from '@/types/order';
import axiosClient from './axios.client';

export const orderApi = {
  createOrder: (data: CreateOrderPayload) => {
    return axiosClient.post('/orders', data);
  },

  getBill: (tableId: string) => {
    return axiosClient.get<{ table: any, items: any[], grandTotal: number, orderCount: number }>(`/orders/table/${tableId}/bill`);
  },

  checkout: (tableId: string) => {
    return axiosClient.post(`/orders/table/${tableId}/checkout`);
  },
};