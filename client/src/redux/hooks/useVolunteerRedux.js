// filepath: d:\Enveave-SDOS\client\src\redux\hooks\useVolunteerRedux.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchVolunteerProfile as fetchProfile,
  updateBasicDetails,
  updateInterests,
  updateEngagement,
  updateProfileStatus as updateStatus
} from '../slices/volunteerSlice';

// Custom hook for volunteer profile management using Redux
export const useVolunteerRedux = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const { volunteerProfile, loading, error } = useSelector(state => state.volunteer);
  
  // Function to fetch the volunteer profile data from the API
  const fetchVolunteerProfile = useCallback(async (force = false) => {
    // Skip fetch if profile is not started
    if (currentUser?.profileStatus === 'NOT_STARTED' && !force) {
      console.log('Volunteer profile not created yet, skipping API call');
      return null;
    }
    
    try {
      const resultAction = await dispatch(fetchProfile());
      if (fetchProfile.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      return null;
    } catch (err) {
      console.error('Error fetching volunteer profile:', err);
      return null;
    }
  }, [currentUser?.profileStatus, dispatch]);

  // Load profile data when hook mounts or currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.profileStatus !== 'NOT_STARTED' && !volunteerProfile && !loading) {
      fetchVolunteerProfile();
    }
  }, [currentUser, volunteerProfile, loading, fetchVolunteerProfile]);
  
  // Function to update basic details
  const updateBasicDetailsAction = async (basicDetailsData) => {
    try {
      const resultAction = await dispatch(updateBasicDetails(basicDetailsData));
      if (updateBasicDetails.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      return null;
    } catch (err) {
      console.error('Error updating basic details:', err);
      return null;
    }
  };
  
  // Function to update interests
  const updateInterestsAction = async (interestsData) => {
    try {
      const resultAction = await dispatch(updateInterests(interestsData));
      if (updateInterests.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      return null;
    } catch (err) {
      console.error('Error updating interests:', err);
      return null;
    }
  };
  
  // Function to update engagement
  const updateEngagementAction = async (engagementData) => {
    try {
      const resultAction = await dispatch(updateEngagement(engagementData));
      if (updateEngagement.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      return null;
    } catch (err) {
      console.error('Error updating engagement:', err);
      return null;
    }
  };
  
  // Function to update profile status
  const updateProfileStatus = async (status) => {
    try {
      const resultAction = await dispatch(updateStatus(status));
      if (updateStatus.fulfilled.match(resultAction)) {
        // Refresh profile after status update
        await fetchVolunteerProfile(true);
        return resultAction.payload;
      }
      return null;
    } catch (err) {
      console.error('Error updating profile status:', err);
      return null;
    }
  };
  
  // Calculate profile completion percentage based on the volunteer profile
  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    
    const profileCompletionData = profile.profileCompletion || {};
    
    const isStep1Completed = profileCompletionData.step1 === true;
    const isStep2Completed = profileCompletionData.step2 === true;
    const isStep3Completed = profileCompletionData.step3 === true;
    
    if (!isStep1Completed) {
      return 0; // 0% if step 1 is not completed
    }
    
    if (!isStep2Completed) {
      return 33; // 33% if only step 1 is completed
    }
    
    if (!isStep3Completed) {
      return 66; // 66% if steps 1 and 2 are completed
    }
    
    // All steps completed
    return 100;
  };
  
  // Return the volunteer profile data and helper functions
  return {
    volunteerProfile,
    loading,
    error,
    fetchVolunteerProfile,
    calculateProfileCompletion,
    updateProfileStatus,
    updateBasicDetails: updateBasicDetailsAction,
    updateInterests: updateInterestsAction,
    updateEngagement: updateEngagementAction
  };
};

export default useVolunteerRedux;
