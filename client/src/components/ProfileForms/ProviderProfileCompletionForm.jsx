import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../redux/hooks';
import { useProviderProfile } from '../../redux/hooks/useProviderProfile';
import OrganizationDetailsForm from './OrganizationDetailsForm';
import WorkProfileForm from './WorkProfileForm';

const ProviderProfileCompletionForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { profile, loading, getProviderProfile, updateProfile, uploadLogo } = useProviderProfile();
  
  // State to track current step
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only fetch the provider profile if we expect it to exist and haven't fetched it yet
    const fetchData = async () => {
      if (!profileFetched) {
        try {
          await getProviderProfile();
        } catch (error) {
          // If the error is because the profile doesn't exist, we'll create it in the form submission
          if (error.message !== 'profile_not_found') {
            console.error('Error fetching provider profile:', error);
          }
        } finally {
          setProfileFetched(true);
          setIsInitialized(true);
        }
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate, getProviderProfile, profileFetched]);
  
  useEffect(() => {
    // Determine which step to show based on profile status
    if (isInitialized && user) {
      console.log('Current user profile status:', user.profileStatus);
      if (user.profileStatus === 'COMPLETED' || user.profileStatus === 'STEP_1' || user.profileStatus === 'STEP_2') {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [isInitialized, user]);
  
  // Handlers for step navigation
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Render loading indicator if data is loading and not on first step
  if (loading && !profile && currentStep !== 1 && !profileFetched) {
    return (
      <div className="profile-form-container">
        <div className="loading-container">
          <h2>Loading your organization information...</h2>
        </div>
      </div>
    );
  }
  
  // Render the appropriate step form based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OrganizationDetailsForm 
                 userData={user} 
                 providerData={profile} 
                 onSubmitSuccess={nextStep} 
                 uploadLogo={uploadLogo}
               />;
      case 2:
        return <WorkProfileForm 
                 userData={user}
                 providerData={profile} 
                 onSubmitSuccess={() => navigate('/provider/dashboard')} 
                 onBack={prevStep} 
               />;
      default:
        return <OrganizationDetailsForm 
                 userData={user} 
                 providerData={profile} 
                 onSubmitSuccess={nextStep} 
                 uploadLogo={uploadLogo}
               />;
    }
  };

  return (
    <div className="profile-form-container">
      <div className="form-progress-indicator">
        <img 
          src={`/forms-progress-indicator-size-2-${currentStep}.svg`} 
          alt={`Step ${currentStep} of 2`}
        />
      </div>
      <div className="form-step-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default ProviderProfileCompletionForm;