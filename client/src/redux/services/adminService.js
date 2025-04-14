// filepath: d:\Enveave-SDOS\client\src\redux\services\adminService.js
import apiClient from './authService';

// Create admin service object
const adminService = {
  // --- Organizations ---
  getOrganizations: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/admin/organizations', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch organizations' };
    }
  },

  deleteOrganization: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/organizations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting organization:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to delete organization' };
    }
  },

  // --- Volunteers ---
  getVolunteers: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/admin/volunteers', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch volunteers' };
    }
  },

  deleteVolunteer: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/volunteers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to delete volunteer' };
    }
  },

  // --- Opportunities ---
  getOpportunities: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/admin/opportunities', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch opportunities' };
    }
  },

  deleteOpportunity: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/opportunities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to delete opportunity' };
    }
  },

  // --- Stories ---
  getStories: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/admin/stories', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch stories' };
    }
  },
  createStory: async (storyData) => {
    try {
      // Check if storyData is FormData (for file uploads)
      const isFormData = storyData instanceof FormData;
      
      // Set proper headers for FormData or JSON
      const config = {
        headers: isFormData ? {
          'Content-Type': 'multipart/form-data'
        } : {
          'Content-Type': 'application/json'
        }
      };
      
      const response = await apiClient.post('/admin/stories', storyData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating story:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create story' };
    }
  },

  deleteStory: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/stories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting story:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to delete story' };
    }
  },


  // --- Dashboard Stats ---
  getDashboardStats: async () => {
      try {
          console.log('Fetching dashboard statistics...');    
          const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch dashboard statistics' };
    }
  },

  // --- Admin Profile ---
  getAdminProfile: async () => {
    try {
      const response = await apiClient.get('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch admin profile' };
    }
  }
};

export default adminService;
