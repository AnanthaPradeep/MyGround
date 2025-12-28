export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    LOGOUT: '/auth/logout',
  },
  PROPERTIES: {
    LIST: '/properties',
    DETAIL: (id: string) => `/properties/${id}`,
    CREATE: '/properties',
    UPDATE: (id: string) => `/properties/${id}`,
    DELETE: (id: string) => `/properties/${id}`,
    SUBMIT: (id: string) => `/properties/${id}/submit`,
    MY_PROPERTIES: '/properties?listedBy=me',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
  },
} as const

// Automatically detect API URL based on environment
const getApiBaseUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it (for custom configurations)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production (deployed on myground.in)
  const isProduction = import.meta.env.PROD || (typeof window !== 'undefined' && (window.location.hostname === 'myground.in' || window.location.hostname === 'www.myground.in'));
  
  if (isProduction) {
    // Production: Use Render backend URL
    // Backend is deployed on Render at myground-1.onrender.com
    return 'https://myground-1.onrender.com/api';
  }
  
  // Development: Use localhost
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl()



