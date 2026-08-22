import axios from 'axios';

// Load base API URL from environment variables or use local default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically append JWT bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dayflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens or authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If request fails due to invalid/expired token (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_role');
      // Dispatch a custom event to notify our React Context
      window.dispatchEvent(new Event('dayflow_auth_expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
