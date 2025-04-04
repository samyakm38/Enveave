import apiClient from './authService';

export const volunteerService = {
  // Get current volunteer profile
  getCurrentVolunteerProfile: async () => {
    try {
      const response = await apiClient.get('/volunteers/profile');
      return response.data;
    } catch (error) {
      // If the error is a 404 (profile not found), return null without throwing
      if (error.response && error.response.status === 404) {
        console.log('Profile not found - likely not created yet');
        return { data: null };
      }
      throw error;
    }
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
  
  // Update volunteer profile status
  updateProfileStatus: async (status) => {
    const response = await apiClient.put('/volunteers/profile/status', { profileStatus: status });
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