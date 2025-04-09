import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/hooks/useAuth';
import { useOpportunities } from '../redux/hooks/useOpportunities';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import BasicDetailsForm from '../components/OpportunityForm/BasicDetailsForm';
import ScheduleForm from '../components/OpportunityForm/ScheduleForm';
import EvaluationForm from '../components/OpportunityForm/EvaluationForm';
import AdditionalInfoForm from '../components/OpportunityForm/AdditionalInfoForm';
import '../stylesheet/ProfileForms.css';

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { currentUser, userType } = useAuth();
  const { 
    createOpportunity: reduxCreateOpportunity, 
    editOpportunity: reduxUpdateOpportunity,
    loading: opportunityLoading,
    error: opportunityError
  } = useOpportunities();
  
  // Form state management
  const [formData, setFormData] = useState({
    basicDetails: null,
    schedule: null,
    evaluation: null,
    additionalInfo: null
  });
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // State to track if opportunity was created
  const [opportunityId, setOpportunityId] = useState(null);
  
  // Error state (separate from Redux errors)
  const [error, setError] = useState(null);
  // Check if user is authenticated and is a provider
  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      navigate('/login');
    } else if (userType !== 'provider') {
      navigate('/');
    }
  }, [userType, navigate]);

  // Track Redux errors
  useEffect(() => {
    if (opportunityError) {
      setError(opportunityError);
    }
  }, [opportunityError]);

  // Handle form data updates from each step
  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };  // Create opportunity in database after step 1
  const createOpportunity = async (basicDetailsData) => {
    try {
      setError(null);
      
      // Prepare minimum required data for other sections
      const minSchedule = {
        location: "Temporary",
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        applicationDeadline: new Date(),
        timeCommitment: "Few hours per week",
        contactPerson: {
          name: "Temporary",
          email: "temp@example.com",
          phoneNumber: "1234567890"
        }
      };
      
      const minEvaluation = {
        support: [{ name: "Certificate of Participation" }],
        hasMilestones: false
      };
      
      const minAdditionalInfo = {
        resources: "",
        consentAgreement: true
      };
      
      // Extract file if present
      let photoFile = null;
      if (basicDetailsData.photo && basicDetailsData.photo instanceof FileList && basicDetailsData.photo.length > 0) {
        photoFile = basicDetailsData.photo[0];
      }
      
      // Create properly formatted request data
      const requestData = {
        basicDetails: {
          title: basicDetailsData.title,
          description: basicDetailsData.description,
          opportunityType: basicDetailsData.opportunityType,
          category: basicDetailsData.category || [],
          volunteersRequired: basicDetailsData.volunteersRequired,
          isPaid: basicDetailsData.isPaid,
          compensation: basicDetailsData.isPaid ? basicDetailsData.compensation : undefined
        },
        schedule: minSchedule,
        evaluation: minEvaluation,
        additionalInfo: minAdditionalInfo
      };
        let response;
        if (photoFile) {
        // If we have a file, use FormData
        const formDataToSend = new FormData();
        
        // Add the file with correct field name
        formDataToSend.append('photo', photoFile);
        
        // Convert request data to a single JSON string and append it
        formDataToSend.append('data', JSON.stringify(requestData));
        
        // Send with FormData
        console.log('Creating opportunity with file:', requestData);
        console.log('File to send:', photoFile);
        
        // Log FormData contents properly - this will show what's actually in the FormData
        for (let pair of formDataToSend.entries()) {
          console.log(pair[0] + ': ' + (pair[0] === 'photo' ? 'File object' : pair[1]));
        }
        
        response = await reduxCreateOpportunity(formDataToSend);
      } else {
        // No file - send as JSON
        response = await reduxCreateOpportunity(requestData);
      }
        if (response && response._id) {
        setOpportunityId(response._id);
        return response._id;
      } else if (response && response.data && response.data._id) {
        setOpportunityId(response.data._id);
        return response.data._id;
      }
      
      console.log('Response from create opportunity:', response);
      throw new Error('Failed to create opportunity - no ID returned');
    } catch (err) {
      console.error('Error creating opportunity:', err);
      setError(err.message || 'Failed to create opportunity');
      throw err;
    }
  };
  // Update opportunity with data from remaining steps
  const updateOpportunityStep = async (step, data) => {
    try {
      setError(null);
      
      // Need the ID from first step
      if (!opportunityId) {
        throw new Error('Opportunity ID not found');
      }
      
      // Create an update object with just the step data
      const updateData = {
        [step]: data
      };
      
      // For the final step, include profile completion update
      if (step === 'additionalInfo') {
        // Include profile completion status
        updateData.profileCompletion = {
          step1: true,
          step2: true,
          step3: true,
          step4: true
        };
      }
      
      // Update the opportunity with the new data
      const response = await reduxUpdateOpportunity(opportunityId, updateData);
      
      return response && response.data;
    } catch (err) {
      console.error(`Error updating opportunity ${step}:`, err);
      setError(err.message || `Failed to update ${step}`);
      throw err;
    }
  };
  // Handle form submission for each step
  const handleStepSubmit = async (step, data) => {
    try {
      if (step === 'basicDetails') {
        // First step creates the opportunity
        const id = await createOpportunity(data);
        updateFormData(step, data);
        setCurrentStep(2);
      } else if (step === 'schedule') {
        // Second step updates the schedule
        await updateOpportunityStep(step, data);
        updateFormData(step, data);
        setCurrentStep(3);
      } else if (step === 'evaluation') {
        // Third step updates the evaluation
        await updateOpportunityStep(step, data);
        updateFormData(step, data);
        setCurrentStep(4);
      } else if (step === 'additionalInfo') {
        // Final step completes the opportunity
        await updateOpportunityStep(step, data);
        updateFormData(step, data);
        // Navigate to dashboard after successful completion
        navigate('/provider/dashboard');
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err.message || 'An error occurred during form submission');
    }
  };

  // Handle previous step navigation
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Determine which form to show based on current step
  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetailsForm 
            onSubmit={(data) => handleStepSubmit('basicDetails', data)}
            initialData={formData.basicDetails}
            isLoading={opportunityLoading}
          />
        );
      case 2:
        return (
          <ScheduleForm 
            onSubmit={(data) => handleStepSubmit('schedule', data)}
            onPrevious={handlePrevStep}
            initialData={formData.schedule}
            isLoading={opportunityLoading}
          />
        );
      case 3:
        return (
          <EvaluationForm 
            onSubmit={(data) => handleStepSubmit('evaluation', data)}
            onPrevious={handlePrevStep}
            initialData={formData.evaluation}
            isLoading={opportunityLoading}
          />
        );
      case 4:
        return (
          <AdditionalInfoForm 
            onSubmit={(data) => handleStepSubmit('additionalInfo', data)}
            onPrevious={handlePrevStep}
            initialData={formData.additionalInfo}
            isLoading={opportunityLoading}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div>
      <Header />
      <div className="profile-form-container">
        {error && (
          <div className="error-banner" style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}
        
        <div className="form-progress-indicator">
          <img 
            src={`/forms-progress-indicator-size-4-${currentStep}.svg`} 
            alt={`Step ${currentStep} of 4`} 
          />
        </div>
        
        {renderCurrentForm()}
      </div>
      <Footer />
    </div>
  );
};

export default CreateOpportunity;
