import { useSelector, useDispatch } from 'react-redux';
import {
  fetchOpportunitiesStart,
  fetchOpportunitiesSuccess,
  fetchOpportunitiesFailure,
  setCurrentOpportunity,
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
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
      const data = await opportunityService.getAllOpportunities();
      dispatch(fetchOpportunitiesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchOpportunitiesFailure(error.response?.data?.message || 'Failed to fetch opportunities'));
      throw error;
    }
  };

  // Fetch latest opportunities
  const getLatestOpportunities = async () => {
    try {
      dispatch(fetchOpportunitiesStart());
      const data = await opportunityService.getLatestOpportunities();
      dispatch(fetchOpportunitiesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchOpportunitiesFailure(error.response?.data?.message || 'Failed to fetch latest opportunities'));
      throw error;
    }
  };

  // Get opportunity details by ID
  const getOpportunityById = async (id) => {
    try {
      const data = await opportunityService.getOpportunityById(id);
      dispatch(setCurrentOpportunity(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Get provider's own opportunities
  const getProviderOpportunities = async () => {
    try {
      dispatch(fetchOpportunitiesStart());
      const data = await opportunityService.getProviderOpportunities();
      dispatch(fetchOpportunitiesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchOpportunitiesFailure(error.response?.data?.message || 'Failed to fetch your opportunities'));
      throw error;
    }
  };

  // Create a new opportunity
  const createOpportunity = async (opportunityData) => {
    try {
      const data = await opportunityService.createOpportunity(opportunityData);
      dispatch(addOpportunity(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update an existing opportunity
  const editOpportunity = async (id, opportunityData) => {
    try {
      const data = await opportunityService.updateOpportunity(id, opportunityData);
      dispatch(updateOpportunity(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Delete an opportunity
  const removeOpportunity = async (id) => {
    try {
      await opportunityService.deleteOpportunity(id);
      dispatch(deleteOpportunity(id));
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
    removeOpportunity,
    applyFilters,
    resetFilters,
    selectOpportunity
  };
};

export default useOpportunities;