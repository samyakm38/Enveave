import apiClient from './authService';

// Service for provider to interact with volunteer data
const providerVolunteerService = {
  // Get volunteer by ID (for provider viewing volunteer profile)
  getVolunteerById: async (volunteerId) => {
    try {
      const response = await apiClient.get(`/provider/volunteers/${volunteerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      throw error;
    }
  }
};

export default providerVolunteerService;
