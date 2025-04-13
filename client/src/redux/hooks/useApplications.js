import { useSelector, useDispatch } from 'react-redux';
import {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchUserApplicationsSuccess,
  fetchOpportunityApplicationsSuccess,
  fetchApplicationsFailure,
  setCurrentApplication,
  addApplication,
  updateApplication,
  deleteApplication
} from '../slices/applicationsSlice';
import applicationService from '../services/applicationService';

// Custom hook for handling application-related state and actions
export const useApplications = () => {
  const dispatch = useDispatch();
  const {
    applications,
    userApplications,
    opportunityApplications,
    currentApplication,
    loading,
    error
  } = useSelector((state) => state.applications);

  // Get all applications (admin/provider)
  const getAllApplications = async () => {
    try {
      dispatch(fetchApplicationsStart());
      const data = await applicationService.getAllApplications();
      dispatch(fetchApplicationsSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchApplicationsFailure(error.response?.data?.message || 'Failed to fetch applications'));
      throw error;
    }
  };

  // Get applications for a specific opportunity (provider)
  const getOpportunityApplications = async (opportunityId) => {
    try {
      dispatch(fetchApplicationsStart());
      const data = await applicationService.getOpportunityApplications(opportunityId);
      dispatch(fetchOpportunityApplicationsSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchApplicationsFailure(error.response?.data?.message || 'Failed to fetch opportunity applications'));
      throw error;
    }
  };

  // Get volunteer's own applications
  const getUserApplications = async () => {
    try {
      dispatch(fetchApplicationsStart());
      const response = await applicationService.getUserApplications();
      
      // Extract the applications array from the response
      // The API returns { message: string, data: array } format
      const applications = response.data || [];
      
      dispatch(fetchUserApplicationsSuccess(applications));
      return applications;
    } catch (error) {
      dispatch(fetchApplicationsFailure(error.response?.data?.message || 'Failed to fetch your applications'));
      throw error;
    }
  };

  // Get application by ID
  const getApplicationById = async (id) => {
    try {
      const data = await applicationService.getApplicationById(id);
      dispatch(setCurrentApplication(data));
      return data;
    } catch (error) {
      throw error;
    }
  };
  // Submit new application (volunteer)
  const submitApplication = async (applicationData) => {
    try {
      const data = await applicationService.submitApplication(applicationData);
      dispatch(addApplication(data));
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  // Register for an opportunity (volunteer)
  const registerForOpportunity = async (opportunityId) => {
    try {
      const data = await applicationService.registerForOpportunity(opportunityId);
      dispatch(addApplication(data.data)); // The API returns { message, data } format
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update application (volunteer)
  const editApplication = async (id, applicationData) => {
    try {
      const data = await applicationService.updateApplication(id, applicationData);
      dispatch(updateApplication(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update application status (provider)
  const updateApplicationStatus = async (id, status, feedbackNote) => {
    try {
      const data = await applicationService.updateApplicationStatus(id, status, feedbackNote);
      dispatch(updateApplication(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Withdraw application (volunteer)
  const withdrawApplication = async (id) => {
    try {
      await applicationService.withdrawApplication(id);
      dispatch(deleteApplication(id));
    } catch (error) {
      throw error;
    }
  };

  // Set current application (without API call)
  const selectApplication = (application) => {
    dispatch(setCurrentApplication(application));
  };
  return {
    applications,
    userApplications,
    opportunityApplications,
    currentApplication,
    loading,
    error,
    getAllApplications,
    getOpportunityApplications,
    getUserApplications,
    getApplicationById,
    submitApplication,
    editApplication,
    updateApplicationStatus,
    withdrawApplication,
    selectApplication,
    registerForOpportunity
  };
};

export default useApplications;