import type { Table } from '@/types/table';
import axiosClient from './axios.client';

export const tableApi = {
  checkStatus: (tableId: string) => {
    return axiosClient.get<{ isOpen: boolean }>(`/tables/${tableId}/status`);
  },

  getAllTables: (page: number = 1, size: number = 10) => {
    return axiosClient.get<{ data: Table[]; meta: any }>('/tables', {
      params: { page, size },
    });
  },

  openTable: (id: string) => {
    return axiosClient.post<Table>(`/tables/${id}/open`);
  },

  closeTable: (id: string) => {
    return axiosClient.post<Table>(`/tables/${id}/close`);
  },
};