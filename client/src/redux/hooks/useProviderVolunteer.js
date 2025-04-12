import { useState } from 'react';
import providerVolunteerService from '../services/providerVolunteerService';

// Custom hook for provider to manage volunteer data
export const useProviderVolunteer = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get volunteer by ID
  const getVolunteerById = async (volunteerId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await providerVolunteerService.getVolunteerById(volunteerId);
      setVolunteer(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching volunteer:', err);
      setError(err.response?.data?.message || 'Failed to fetch volunteer data');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    volunteer,
    loading,
    error,
    getVolunteerById
  };
};

export default useProviderVolunteer;
