import apiClient from './authService';

export const applicationService = {
  // Get all applications (admin/provider access)
  getAllApplications: async () => {
    const response = await apiClient.get('/applications');
    return response.data;
  },
  
  // Get applications for a specific opportunity (provider access)
  getOpportunityApplications: async (opportunityId) => {
    const response = await apiClient.get(`/applications/opportunity/${opportunityId}`);
    return response.data;
  },
  
  // Get volunteer's own applications (volunteer access)
  getUserApplications: async () => {
    const response = await apiClient.get('/applications/user');
    return response.data;
  },
  
  // Get application by ID
  getApplicationById: async (id) => {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },
  
  // Submit new application (volunteer only)
  submitApplication: async (applicationData) => {
    const response = await apiClient.post('/applications', applicationData);
    return response.data;
  },
  
  // Update application (volunteer can update before provider reviews)
  updateApplication: async (id, applicationData) => {
    const response = await apiClient.put(`/applications/${id}`, applicationData);
    return response.data;
  },
  
  // Provider update application status (approve/reject)
  updateApplicationStatus: async (id, status, feedbackNote) => {
    const response = await apiClient.patch(`/applications/${id}/status`, { 
      status, 
      feedbackNote 
    });
    return response.data;
  },
  
  // Withdraw application (volunteer only)
  withdrawApplication: async (id) => {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  },
};

export default applicationService;