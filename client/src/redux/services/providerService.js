import apiClient from './authService';

// Service for opportunity provider-related API calls
export const providerService = {
  // Get the authenticated provider's profile
  getProviderProfile: async () => {
    const response = await apiClient.get('/provider/profile');
    return response.data;
  },
  
  // Get the provider's statistics (total opportunities, volunteers, etc.)
  getProviderStats: async () => {
    const response = await apiClient.get('/provider/stats');
    return response.data;
  },
  
  // Update the provider's profile
  updateProviderProfile: async (profileData) => {
    const response = await apiClient.put('/provider/profile', profileData);
    return response.data;
  },
  
  // Upload provider logo
  uploadProviderLogo: async (formData) => {
    const response = await apiClient.post('/provider/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get provider's posted opportunities with stats
  getProviderOpportunitiesAndStats: async () => {
    const response = await apiClient.get('/provider/dashboard');
    return response.data;
  }
};

export default providerService;