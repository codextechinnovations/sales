import { post } from './apiClient';

interface SalesPerson {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface LoginResponse {
  success?: boolean;
  message?: string;
  accessToken: string;
  user: SalesPerson;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return await post<LoginResponse>('/salesperson/login', { email, password });
  },

  logout: () => {
    localStorage.removeItem('sales_token');
    localStorage.removeItem('sales_user');
  },
};