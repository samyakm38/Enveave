import axios from 'axios';

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
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authService = {
  // Login using the unified login endpoint
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
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
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  // Verify OTP for provider
  verifyProviderOtp: async (email, otp) => {
    const response = await apiClient.post('/auth/opportunity-provider/verify-otp', { email, otp });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
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