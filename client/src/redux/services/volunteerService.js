import apiClient from './authService';

export const volunteerService = {
  // Get current volunteer profile
  getCurrentVolunteerProfile: async () => {
    const response = await apiClient.get('/volunteers/profile');
    return response.data;
  },
  
  // Update volunteer profile - basic details (Step 1)
  updateBasicDetails: async (basicDetailsData) => {
    const response = await apiClient.put('/volunteers/profile/basic', basicDetailsData);
    return response.data;
  },
  
  // Update volunteer interests and skills (Step 2)
  updateInterests: async (interestsData) => {
    const response = await apiClient.put('/volunteers/profile/interests', interestsData);
    return response.data;
  },
  
  // Update volunteer engagement info (Step 3)
  updateEngagement: async (engagementData) => {
    const response = await apiClient.put('/volunteers/profile/engagement', engagementData);
    return response.data;
  },
  
  // Upload volunteer profile photo
  uploadProfilePhoto: async (formData) => {
    const response = await apiClient.post('/volunteers/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default volunteerService;