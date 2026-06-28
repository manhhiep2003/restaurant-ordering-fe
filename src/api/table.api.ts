import axiosClient from './axios.client';

export const tableApi = {
  checkStatus: (tableId: string) => {
    return axiosClient.get<{ isOpen: boolean }>(`/tables/${tableId}/status`);
  },
};