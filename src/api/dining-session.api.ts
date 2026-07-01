import axiosClient from './axios.client';

export const diningSessionApi = {
  checkStatus: (tableId: string, customerName?: string) => {
    return axiosClient.post<{ sessionId: string; isNew: boolean }>('/public/dining-sessions/check-status', { 
      tableId, 
      customerName 
    });
  },
};