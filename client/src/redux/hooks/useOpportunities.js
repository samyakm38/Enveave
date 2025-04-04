import { useSelector, useDispatch } from 'react-redux';
import {
  fetchOpportunitiesStart,
  fetchOpportunitiesSuccess,
  fetchOpportunitiesFailure,
  setCurrentOpportunity,
  addOpportunity,
  updateOpportunity,
  completeOpportunity as completeOpportunityAction,
  cancelOpportunity as cancelOpportunityAction,
  deleteOpportunity as deleteOpportunityAction,
  filterOpportunities,
  clearFilters
} from '../slices/opportunitiesSlice';
import opportunityService from '../services/opportunityService';

// Custom hook for handling opportunity-related state and actions
export const useOpportunities = () => {
  const dispatch = useDispatch();
  const { 
    opportunities, 
    filteredOpportunities, 
    currentOpportunity, 
    loading, 
    error 
  } = useSelector((state) => state.opportunities);

  // Fetch all opportunities
  const getAllOpportunities = async () => {
    try {
      dispatch(fetchOpportunitiesStart());
      const response = await opportunityService.getAllOpportunities();
      // Extract opportunities from the data property of the response
      const opportunities = response.data?.opportunities || [];
      dispatch(fetchOpportunitiesSuccess(opportunities));
      return opportunities;
    } catch (error) {
      dispatch(fetchOpportunitiesFailure(error.response?.data?.message || 'Failed to fetch opportunities'));
      throw error;
    }
  };

  // Fetch latest opportunities
  const getLatestOpportunities = async () => {
    try {
      dispatch(fetchOpportunitiesStart());
      console.log('Before API call to fetch latest opportunities');
      const response = await opportunityService.getLatestOpportunities();
      console.log('API response for latest opportunities:', response);
      
      // Handle different possible API response structures
      let opportunities = [];
      
      if (Array.isArray(response)) {
        // If the response itself is an array
        opportunities = response;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          // If response.data is an array
          opportunities = response.data;
        } else if (response.data && Array.isArray(response.data.latestOpportunities)) {
          // If response.data.latestOpportunities is an array
          opportunities = response.data.latestOpportunities;
        } else if (response.data && typeof response.data === 'object') {
          // If response.data is an object with various properties, look for arrays
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            // Use the first array found
            opportunities = possibleArrays[0];
          }
        }
      }
      
      console.log('Extracted opportunities:', opportunities);
      
      dispatch(fetchOpportunitiesSuccess(opportunities));
      return opportunities;
    } catch (error) {
      console.error('Error in getLatestOpportunities:', error);
      dispatch(fetchOpportunitiesFailure(error.response?.data?.message || 'Failed to fetch latest opportunities'));
      throw error;
    }
  };

  // Get opportunity details by ID
  const getOpportunityById = async (id) => {
    try {
      const response = await opportunityService.getOpportunityById(id);
      // Extract the opportunity data from the response
      const opportunity = response.data || null;
      dispatch(setCurrentOpportunity(opportunity));
      return opportunity;
    } catch (error) {
      throw error;
    }
  };

  // Get provider's own opportunities
  const getProviderOpportunities = async () => {
    try {
      dispatch(fetchOpportunitiesStart());
      const response = await opportunityService.getProviderOpportunities();
      // Extract opportunities from the data property of the response
      const opportunities = response.data || [];
      dispatch(fetchOpportunitiesSuccess(opportunities));
      return opportunities;
    } catch (error) {
      dispatch(fetchOpportunitiesFailure(error.response?.data?.message || 'Failed to fetch your opportunities'));
      throw error;
    }
  };

  // Create a new opportunity
  const createOpportunity = async (opportunityData) => {
    try {
      const response = await opportunityService.createOpportunity(opportunityData);
      const newOpportunity = response.data || null;
      if (newOpportunity) {
        dispatch(addOpportunity(newOpportunity));
      }
      return newOpportunity;
    } catch (error) {
      throw error;
    }
  };

  // Update an existing opportunity
  const editOpportunity = async (id, opportunityData) => {
    try {
      const response = await opportunityService.updateOpportunity(id, opportunityData);
      const updatedOpportunity = response.data || null;
      if (updatedOpportunity) {
        dispatch(updateOpportunity(updatedOpportunity));
      }
      return updatedOpportunity;
    } catch (error) {
      throw error;
    }
  };

  // Mark an opportunity as completed
  const completeOpportunity = async (id, completionData) => {
    try {
      const response = await opportunityService.completeOpportunity(id, completionData);
      const completedOpportunity = response.data || null;
      if (completedOpportunity) {
        dispatch(completeOpportunityAction(completedOpportunity));
      }
      return completedOpportunity;
    } catch (error) {
      throw error;
    }
  };

  // Cancel an opportunity
  const cancelOpportunity = async (id, reason) => {
    try {
      const response = await opportunityService.cancelOpportunity(id, { reason });
      const cancelledOpportunity = response.data || null;
      if (cancelledOpportunity) {
        dispatch(cancelOpportunityAction(cancelledOpportunity));
      }
      return cancelledOpportunity;
    } catch (error) {
      throw error;
    }
  };

  // Delete an opportunity
  const deleteOpportunity = async (id) => {
    try {
      await opportunityService.deleteOpportunity(id);
      dispatch(deleteOpportunityAction(id));
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Filter opportunities
  const applyFilters = (filterData) => {
    dispatch(filterOpportunities(filterData));
  };

  // Reset filters
  const resetFilters = () => {
    dispatch(clearFilters());
  };

  // Set current opportunity (without API call)
  const selectOpportunity = (opportunity) => {
    dispatch(setCurrentOpportunity(opportunity));
  };

  return {
    opportunities,
    filteredOpportunities,
    currentOpportunity,
    loading,
    error,
    getAllOpportunities,
    getLatestOpportunities,
    getOpportunityById,
    getProviderOpportunities,
    createOpportunity,
    editOpportunity,
    completeOpportunity,
    cancelOpportunity,
    deleteOpportunity,
    applyFilters,
    resetFilters,
    selectOpportunity
  };
};

export default useOpportunities;