import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProviderProfile } from '../../redux/hooks/useProviderProfile';
import { useAuth } from '../../redux/hooks';
import '../../stylesheet/ProfileForms.css'; // Import shared form styling

// Zod schema for form validation
const workProfileSchema = z.object({
  geographicalAreaOfWork: z.array(z.string())
    .min(1, 'Please select at least one geographical area'),
  thematicAreaOfWork: z.array(z.string())
    .min(1, 'Please select at least one thematic area'),
  otherThematicArea: z.string().optional(),
  previousVolunteeringLink: z.string().optional()
});

// Available options from the model
const geographicalAreaOptions = [
  'Urban',
  'Rural',
  'Peri-urban'
];

const thematicAreaOptions = [
  'Climate Change Mitigation',
  'Waste Management & Recycling',
  'Renewable Energy',
  'Environmental Education',
  'Water Conservation',
  'Forest Conservation',
  'Wildlife Protection',
  'Marine Conservation',
  'Sustainable Agriculture',
  'Air Quality Management',
  'Biodiversity Conservation',
  'Green Technology',
  'Environmental Research',
  'Sustainable Urban Development',
  'Other'
];

const WorkProfileForm = ({ providerData, onSubmitSuccess, onBack }) => {
  const { updateProfile: updateProviderProfile } = useProviderProfile();
  const { updateProfile } = useAuth();
  
  // Initialize form with React Hook Form
  const { control, register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(workProfileSchema),
    defaultValues: {
      // Pre-fill with existing data if available
      geographicalAreaOfWork: providerData?.workProfile?.geographicalAreaOfWork || [],
      thematicAreaOfWork: providerData?.workProfile?.thematicAreaOfWork?.map(area => area.name) || [],
      otherThematicArea: providerData?.workProfile?.thematicAreaOfWork?.find(area => area.name === 'Other')?.customArea || '',
      previousVolunteeringLink: providerData?.workProfile?.previousVolunteeringLink || ''
    }
  });

  // Watch thematic areas to check if "Other" is selected
  const thematicAreas = watch('thematicAreaOfWork');
  const hasOtherThematicArea = thematicAreas.includes('Other');

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Format thematic areas data to match the model structure
      const formattedThematicAreas = data.thematicAreaOfWork.map(areaName => {
        if (areaName === 'Other') {
          return {
            name: areaName,
            customArea: data.otherThematicArea
          };
        }
        return { name: areaName };
      });

      // Format data for API
      const formattedData = {
        workProfile: {
          geographicalAreaOfWork: data.geographicalAreaOfWork,
          thematicAreaOfWork: formattedThematicAreas,
          previousVolunteeringLink: data.previousVolunteeringLink
        },
        profileCompletion: {
          step1: true,
          step2: true
        }
      };

      // Submit data to the backend
      await updateProviderProfile(formattedData);
      
      // Update auth profile status to indicate profile is complete
      await updateProfile({ profileStatus: 'COMPLETED' });
      
      // Call the success callback to navigate to dashboard
      onSubmitSuccess();
    } catch (error) {
      console.error('Error saving work profile:', error);
      alert(`Failed to save your information: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  // Helper component for checkbox groups
  const CheckboxGroup = ({ options, control, name, error }) => (
    <div className="checkbox-group">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value = [] } }) => (
          <div className="checkbox-options">
            {options.map(option => (
              <div key={option} className="checkbox-option">
                <input
                  type="checkbox"
                  id={`${name}-${option}`}
                  checked={value.includes(option)}
                  onChange={e => {
                    const checked = e.target.checked;
                    if (checked) {
                      onChange([...value, option]);
                    } else {
                      onChange(value.filter(item => item !== option));
                    }
                  }}
                />
                <label htmlFor={`${name}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        )}
      />
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );

  return (
    <div className="profile-form-container work-profile-form">
      <h2>Work Profile</h2>
      <p className="form-subtitle">Step 2 of 2</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="form-section">
          <h3>Geographical Area of Work</h3>
          <p className="section-description">
            Where does your organization work? Select all that apply:
          </p>
          
          <CheckboxGroup
            options={geographicalAreaOptions}
            control={control}
            name="geographicalAreaOfWork"
            error={errors.geographicalAreaOfWork}
          />
        </div>

        <div className="form-section">
          <h3>Thematic Area of Work</h3>
          <p className="section-description">
            What environmental causes does your organization focus on? Select all that apply:
          </p>
          
          <CheckboxGroup
            options={thematicAreaOptions}
            control={control}
            name="thematicAreaOfWork"
            error={errors.thematicAreaOfWork}
          />
          
          {hasOtherThematicArea && (
            <div className="form-field">
              <label htmlFor="otherThematicArea">Please specify other thematic area</label>
              <input
                id="otherThematicArea"
                type="text"
                {...register('otherThematicArea')}
                className={errors.otherThematicArea ? 'error' : ''}
              />
              {errors.otherThematicArea && (
                <p className="error-message">{errors.otherThematicArea.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Previous Volunteering Programs</h3>
          <div className="form-field">
            <label htmlFor="previousVolunteeringLink">
              If you have previous volunteer programs or initiatives, please provide a link to them:
            </label>
            <input
              id="previousVolunteeringLink"
              type="url"
              {...register('previousVolunteeringLink')}
              className={errors.previousVolunteeringLink ? 'error' : ''}
              placeholder="https://example.org/our-programs"
            />
            {errors.previousVolunteeringLink && (
              <p className="error-message">{errors.previousVolunteeringLink.message}</p>
            )}
            <p className="field-hint">This helps volunteers understand your experience and track record</p>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onBack}
          >
            Back
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Completing Profile...' : 'Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkProfileForm;