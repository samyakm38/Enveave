import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import volunteerService from '../services/volunteerService';

// Custom hook for volunteer profile management
export const useVolunteer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);
  const isMountedRef = useRef(false);
  const isLoadingRef = useRef(false);
  
  // Get the auth user ID from Redux state
  const { currentUser } = useSelector(state => state.auth);
  
  // Function to fetch the current volunteer's profile - memoized with useCallback
  const fetchVolunteerProfile = useCallback(async (force = false) => {
    // Prevent double-fetching or excessive fetches
    if (isLoadingRef.current) {
      console.log('Already fetching profile, skipping duplicate request');
      return null;
    }

    // Prevent excessive API calls by limiting to 3 attempts unless forced
    if (!force && fetchCount > 3) {
      console.log('Too many fetch attempts, skipping to prevent excessive API calls');
      return volunteerProfile;
    }

    if (currentUser?.profileStatus === 'NOT_STARTED') {
      console.log('Volunteer profile not created yet, skipping API call');
      return null;
    }
    
    setLoading(true);
    isLoadingRef.current = true;
    setError(null);
    setFetchCount(prev => prev + 1);
    
    try {
      const response = await volunteerService.getCurrentVolunteerProfile();
      setVolunteerProfile(response.data); // Store the full volunteer profile
      return response.data;
    } catch (err) {
      console.error('Error fetching volunteer profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch volunteer profile');
      return null;
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentUser?.profileStatus, fetchCount]); // Removed volunteerProfile from dependencies
  
  // Load profile data only when hook first mounts or currentUser changes
  useEffect(() => {
    // Skip initial fetch if already loaded or loading
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      if (currentUser && currentUser.profileStatus !== 'NOT_STARTED' && !volunteerProfile && !isLoadingRef.current) {
        fetchVolunteerProfile();
      }
    }
  }, [currentUser, fetchVolunteerProfile]);
  
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

  // Function to update profile status
  const updateProfileStatus = async (status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await volunteerService.updateProfileStatus(status);
      // Force-refresh profile data after update
      await fetchVolunteerProfile(true); 
      return response.data;
    } catch (err) {
      console.error('Error updating profile status:', err);
      setError(err.response?.data?.message || 'Failed to update profile status');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset fetch counter when component unmounts or currentUser changes
  useEffect(() => {
    return () => setFetchCount(0);
  }, [currentUser]);
  
  // Return the volunteer profile data and helper functions
  return {
    volunteerProfile,
    loading,
    error,
    fetchVolunteerProfile,
    calculateProfileCompletion,
    updateProfileStatus
  };
};

export default useVolunteer;