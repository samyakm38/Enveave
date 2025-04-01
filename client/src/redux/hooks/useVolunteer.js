import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import volunteerService from '../services/volunteerService';

// Custom hook for volunteer profile management
export const useVolunteer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  
  // Get the auth user ID from Redux state
  const { currentUser } = useSelector(state => state.auth);
  
  // Function to fetch the current volunteer's profile
  const fetchVolunteerProfile = async () => {
    setLoading(true);
    setError(null);
    
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
    calculateProfileCompletion
  };
};

export default useVolunteer;