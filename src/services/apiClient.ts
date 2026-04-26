import axios from 'axios';

const API_BASE_URL = 'https://api.manageyourpg.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sales_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sales_token');
      localStorage.removeItem('sales_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const get = async <T>(url: string, config?: any): Promise<T> => {
  const response = await apiClient.get(url, config);
  return response.data;
};

export const post = async <T>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await apiClient.post(url, data, config);
  return response.data;
};

export const salesPost = post;

export default apiClient;