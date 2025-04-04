import apiClient from './authService';

export const opportunityService = {
  // Get all opportunities
  getAllOpportunities: async () => {
    const response = await apiClient.get('/opportunities');
    return response.data;
  },
  
  // Get latest opportunities
  getLatestOpportunities: async () => {
    const response = await apiClient.get('/opportunities/latest');
    return response.data;
  },
  
  // Get opportunities feed with pagination
  getOpportunitiesFeed: async (cursor, limit) => {
    const response = await apiClient.get(`/opportunities/feed?cursor=${cursor || ''}&limit=${limit || 10}`);
    return response.data;
  },
  
  // Get opportunity by ID
  getOpportunityById: async (id) => {
    const response = await apiClient.get(`/opportunities/${id}`);
    return response.data;
  },
  
  // Create new opportunity (provider only)
  createOpportunity: async (opportunityData) => {
    const response = await apiClient.post('/opportunities', opportunityData);
    return response.data;
  },
  
  // Update opportunity (provider only)
  updateOpportunity: async (id, opportunityData) => {
    const response = await apiClient.put(`/opportunities/${id}`, opportunityData);
    return response.data;
  },
  
  // Delete opportunity (provider only)
  deleteOpportunity: async (id) => {
    const response = await apiClient.delete(`/opportunities/${id}`);
    return response.data;
  },
  
  // Get opportunities by provider ID (provider's own opportunities)
  getProviderOpportunities: async () => {
    try {
      const response = await apiClient.get('/opportunities/provider');
      return response.data;
    } catch (error) {
      // If error is 404 with provider profile not found message, return empty data
      if (error.response && error.response.status === 404 && 
          error.response.data.message === 'Opportunity provider profile not found') {
        // Return empty data structure that matches the expected format
        return { message: 'Provider profile not found', data: [] };
      }
      // Otherwise rethrow the error
      throw error;
    }
  },
  
  // Mark an opportunity as completed
  completeOpportunity: async (id, completionData) => {
    const response = await apiClient.put(`/opportunities/${id}/complete`, completionData);
    return response.data;
  },
  
  // Cancel an opportunity
  cancelOpportunity: async (id, reason) => {
    const response = await apiClient.put(`/opportunities/${id}/cancel`, { reason });
    return response.data;
  }
};

export default opportunityService;