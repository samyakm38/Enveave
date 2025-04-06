import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../redux/hooks';
import { useVolunteer } from '../../redux/hooks/useVolunteer';
import BasicDetailsForm from './BasicDetailsForm';
import InterestsForm from './InterestsForm';
import EngagementForm from './EngagementForm';

const ProfileCompletionForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { volunteerProfile, fetchVolunteerProfile, loading } = useVolunteer();
  
  // State to track current step
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only fetch the volunteer profile if we expect it to exist
    if (user?.profileStatus !== 'NOT_STARTED') {
      fetchVolunteerProfile();
    }
    
    setIsInitialized(true);
  }, [isAuthenticated, navigate, fetchVolunteerProfile, user]);
  
  useEffect(() => {
    // Determine which step to show based on profile status
    if (isInitialized && user) {
      if (user.profileStatus === 'COMPLETED') {
        setCurrentStep(3);
      } else if (user.profileStatus === 'STEP_2') {
        setCurrentStep(3);
      } else if (user.profileStatus === 'STEP_1') {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [isInitialized, volunteerProfile, user]);
  
  // Handlers for step navigation
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Render loading indicator if data is loading and we're not on step 1
  if (loading && currentStep !== 1) {
    return (
      <div className="profile-form-container">
        <div className="loading-container">
          <h2>Loading your profile information...</h2>
        </div>
      </div>
    );
  }
  
  // Render the appropriate step form based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsForm 
                 userData={user} 
                 volunteerData={volunteerProfile} 
                 onSubmitSuccess={nextStep} 
               />;
      case 2:
        return <InterestsForm 
                 volunteerData={volunteerProfile} 
                 onSubmitSuccess={nextStep} 
                 onBack={prevStep} 
               />;
      case 3:
        return <EngagementForm 
                 volunteerData={volunteerProfile} 
                 onSubmitSuccess={() => navigate('/login')} 
                 onBack={prevStep} 
               />;
      default:
        return <BasicDetailsForm 
                 userData={user} 
                 volunteerData={volunteerProfile} 
                 onSubmitSuccess={nextStep} 
               />;
    }
  };
  
  return (
    <div className="profile-form-container">
      <div className="form-progress-indicator">
        <img 
          src={`/forms-progress-indicator-size-3-${currentStep}.svg`} 
          alt={`Step ${currentStep} of 3`}
        />
      </div>
      <div className="form-step-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default ProfileCompletionForm;