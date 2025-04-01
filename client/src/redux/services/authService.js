import axios from 'axios';
import { store } from '../store';
import { setToken } from '../slices/authSlice';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Redux state instead of directly from localStorage
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.url);
    } else {
      console.log('No auth token found for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Auth API
export const authService = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!store.getState().auth.token;
  },

  // Get current token from Redux
  getToken: () => {
    return store.getState().auth.token;
  },

  // Set token in Redux (which also sets it in localStorage)
  setToken: (token) => {
    if (token) {
      store.dispatch(setToken(token));
      return true;
    }
    return false;
  },

  // Login using the unified login endpoint
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      store.dispatch(setToken(response.data.token));
    }
    return response.data;
  },
  
  // Logout
  logout: () => {
    store.dispatch(setToken(null));
  },
  
  // Volunteer signup
  volunteerSignup: async (formData) => {
    const response = await apiClient.post('/auth/volunteer/signup', formData);
    return response.data;
  },
  
  // Provider signup
  providerSignup: async (formData) => {
    const response = await apiClient.post('/auth/opportunity-provider/signup', formData);
    return response.data;
  },
  
  // Verify OTP for volunteer
  verifyVolunteerOtp: async (email, otp) => {
    const response = await apiClient.post('/auth/volunteer/verify-otp', { email, otp });
    if (response.data.token) {
      store.dispatch(setToken(response.data.token));
    }
    return response.data;
  },
  
  // Verify OTP for provider
  verifyProviderOtp: async (email, otp) => {
    const response = await apiClient.post('/auth/opportunity-provider/verify-otp', { email, otp });
    if (response.data.token) {
      store.dispatch(setToken(response.data.token));
    }
    return response.data;
  },
  
  // Request password reset
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password/request', { email });
    return response.data;
  },
  
  // Verify OTP for password reset
  verifyPasswordResetOtp: async (email, otp) => {
    const response = await apiClient.post('/auth/forgot-password/verify-otp', { email, otp });
    return response.data;
  },
  
  // Reset password
  resetPassword: async (email, otp, newPassword) => {
    const response = await apiClient.post('/auth/forgot-password/reset', { 
      email, 
      otp, 
      newPassword 
    });
    return response.data;
  },
};

export default apiClient;