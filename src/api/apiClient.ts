// apiClient.ts
import axios from 'axios';
import { getToken, clearToken } from '../utils/auth';
import { showErrorToast } from '@/utils/sonnerToastConfig';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL // Use import.meta.env for Vite projects
});

// Request interceptor for adding auth headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    console.log(error, 'err');
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      clearToken();
      window.location.href = '/login';
    }
    
    
    showErrorToast(error.response.data.error || error?.message || 'An error occurred');
    return Promise.reject(error);
  }
);

export default apiClient;