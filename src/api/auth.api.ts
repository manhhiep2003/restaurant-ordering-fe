import type { User } from '@/types/user';
import axiosClient from './axios.client';

interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (data: any) => {
    return axiosClient.post<LoginResponse>('/auth/login', data);
  },
};