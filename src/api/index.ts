import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { RewardTransactionHistoryDto } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const getMerchantNames = async () => {
  const response = await api.get<{ id: number; name: string }[]>('/merchants/names');
  return response.data;
};

export const getRewardTransactionHistory = async () => {
  const response = await api.get<RewardTransactionHistoryDto[]>('/transactions');
  return response.data;
};

export default api;