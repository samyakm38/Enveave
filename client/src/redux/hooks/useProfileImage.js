import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import volunteerService from '../services/volunteerService';
import providerService from '../services/providerService';

/**
 * Custom hook to fetch the user's profile image based on their user type
 */
export const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState('/dashboard-default-user-image.svg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get the current auth state
  const { currentUser, userType } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProfileImage = async () => {
      // Don't fetch if there's no user or the profile hasn't been started
      if (!currentUser || currentUser.profileStatus === 'NOT_STARTED') {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (userType === 'volunteer') {
          // Fetch volunteer profile to get the profile photo URL
          const response = await volunteerService.getCurrentVolunteerProfile();
          if (response?.data?.profilePhoto) {
            setProfileImage(response.data.profilePhoto);
          }
        } else if (userType === 'provider') {
          // Fetch provider profile to get the logo URL
          const response = await providerService.getProviderProfile();
          if (response?.data?.organizationDetails?.logo) {
            setProfileImage(response.data.organizationDetails.logo);
          }
        }
      } catch (err) {
        console.error('Error fetching profile image:', err);
        setError(err.message || 'Failed to fetch profile image');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [currentUser, userType]);

  return { profileImage, loading, error };
};

export default useProfileImage;
