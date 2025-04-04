import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProviderStart,
  fetchProviderSuccess,
  fetchProviderStatsSuccess,
  fetchProviderFailure,
  updateProviderProfile,
  resetProviderProfile
} from '../slices/providerProfileSlice';
import providerService from '../services/providerService';
import opportunityService from '../services/opportunityService';

// Custom hook for handling provider profile state and actions
export const useProviderProfile = () => {
  const dispatch = useDispatch();
  const { 
    profile, 
    stats, 
    loading, 
    error 
  } = useSelector((state) => state.providerProfile);

  // Fetch provider profile
  const getProviderProfile = async () => {
    try {
      dispatch(fetchProviderStart());
      const response = await providerService.getProviderProfile();
      dispatch(fetchProviderSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(fetchProviderFailure(error.response?.data?.message || 'Failed to fetch provider profile'));
      throw error;
    }
  };

  // Fetch provider statistics
  const getProviderStats = async () => {
    try {
      dispatch(fetchProviderStart());
      const response = await providerService.getProviderStats();
      dispatch(fetchProviderStatsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(fetchProviderFailure(error.response?.data?.message || 'Failed to fetch provider statistics'));
      throw error;
    }
  };

  // Fetch provider opportunities and calculate statistics
  const getProviderOpportunitiesAndStats = async () => {
    try {
      dispatch(fetchProviderStart());
      
      // First, try to get the provider profile to access the totalVolunteers field
      let profileResponse;
      try {
        profileResponse = await providerService.getProviderProfile();
        dispatch(fetchProviderSuccess(profileResponse.data));
      } catch (error) {
        // If profile doesn't exist, we'll calculate volunteers from opportunities later
        console.log("Couldn't fetch provider profile:", error.message);
      }
      
      const response = await opportunityService.getProviderOpportunities();
      // Check if we got an empty data array due to missing profile
      const opportunities = response.data || [];
      
      // If we received a special message about missing profile, handle it
      if (response.message === 'Provider profile not found') {
        // Set stats to zeros when no profile exists
        const emptyStats = {
          totalOpportunities: 0,
          totalVolunteers: 0,
          completedProjects: 0
        };
        dispatch(fetchProviderStatsSuccess(emptyStats));
        
        // We want to indicate this was a profile error, not a general error
        throw new Error('profile_not_found');
      }
      
      // Calculate statistics
      const completedProjects = opportunities.filter(opp => {
        // Logic to determine if an opportunity is completed
        return opp.status === 'Completed' || 
               (opp.applicants && opp.applicants.some(app => app.isCompleted));
      }).length;
      
      // Get total volunteers - preferably from the provider profile
      let totalVolunteers = 0;
      if (profileResponse && profileResponse.data && profileResponse.data.totalVolunteers !== undefined) {
        // Use the totalVolunteers directly from the provider profile
        totalVolunteers = profileResponse.data.totalVolunteers;
      } else {
        // Fall back to calculating from opportunities if profile doesn't have the field
        opportunities.forEach(opp => {
          if (opp.applicants) {
            totalVolunteers += opp.applicants.filter(app => 
              app.status === 'Accepted'
            ).length;
          }
        });
      }
      
      const stats = {
        totalOpportunities: opportunities.length,
        totalVolunteers: totalVolunteers,
        completedProjects: completedProjects
      };
      
      dispatch(fetchProviderStatsSuccess(stats));
      return { opportunities, stats };
    } catch (error) {
      // Don't update the error state for a known profile_not_found error
      if (error.message !== 'profile_not_found') {
        dispatch(fetchProviderFailure(error.response?.data?.message || 'Failed to fetch provider data'));
      }
      throw error;
    }
  };

  // Update provider profile
  const updateProfile = async (profileData) => {
    try {
      const response = await providerService.updateProviderProfile(profileData);
      dispatch(updateProviderProfile(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Upload provider logo
  const uploadLogo = async (formData) => {
    try {
      const response = await providerService.uploadProviderLogo(formData);
      const logoUrl = response.data.logoUrl;
      
      // Update profile with new logo URL
      dispatch(updateProviderProfile({ 
        organizationDetails: { 
          ...profile.organizationDetails, 
          logo: logoUrl 
        } 
      }));
      
      return logoUrl;
    } catch (error) {
      throw error;
    }
  };

  // Reset provider profile state
  const resetProfile = () => {
    dispatch(resetProviderProfile());
  };

  return {
    profile,
    stats,
    loading,
    error,
    getProviderProfile,
    getProviderStats,
    getProviderOpportunitiesAndStats,
    updateProfile,
    uploadLogo,
    resetProfile
  };
};

export default useProviderProfile;