import axios from 'axios';

// Automatically detect API URL based on environment
const getApiBaseUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it (for custom configurations)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production (deployed on myground.in)
  const isProduction = 
    import.meta.env.PROD || 
    (typeof window !== 'undefined' && (
      window.location.hostname === 'myground.in' || 
      window.location.hostname === 'www.myground.in'
    ));
  
  if (isProduction) {
    // Production: Use Render backend URL
    // Backend is deployed on Render at myground-1.onrender.com
    return 'https://myground-1.onrender.com/api';
  }
  
  // Development: Use localhost
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

