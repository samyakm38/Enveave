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
    const response = await apiClient.get('/opportunities/provider');
    return response.data;
  },
};

export default opportunityService;