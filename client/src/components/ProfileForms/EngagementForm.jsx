import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import volunteerService from '../../redux/services/volunteerService';
import { useVolunteer } from '../../redux/hooks/useVolunteer';

const engagementSchema = z.object({
  availability: z.array(z.string())
    .min(1, 'Please select at least one availability option'),
  motivations: z.array(z.string())
    .min(1, 'Please select at least one motivation'),
  hasPreviousExperience: z.boolean(),
  previousExperience: z.string().optional()
}).superRefine((data, ctx) => {
  // Only validate previousExperience if hasPreviousExperience is true
  if (data.hasPreviousExperience && (!data.previousExperience || data.previousExperience.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please describe your previous experience',
      path: ['previousExperience']
    });
  }
});

// Available options from the model
const availabilityOptions = [
  "Yearly",
  "Monthly",
  "Weekly",
  "Daily",
  "On Weekends Only",
  "One Time",
  "Remotely"
];

const motivationOptions = [
  "Civic Responsibility",
  "Family/Societal Expectations",
  "International Norms (e.g. SDGs)",
  "Networking",
  "Personal Interest",
  "Personal or Professional Development",
  "Resume-Building",
  "School, College or Employer Requirement",
  "Other"
];

const EngagementForm = ({ volunteerData, onSubmitSuccess, onBack }) => {
  const { updateProfileStatus } = useVolunteer();
  
  // Initialize form with React Hook Form
  const { control, register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(engagementSchema),
    defaultValues: {
      // Pre-fill with existing data if available
      availability: volunteerData?.engagement?.availability || [],
      motivations: volunteerData?.engagement?.motivations || [],
      hasPreviousExperience: volunteerData?.engagement?.hasPreviousExperience || false,
      previousExperience: volunteerData?.engagement?.previousExperience || ''
    }
  });

  // Watch the hasPreviousExperience field to conditionally render the experience textarea
  const hasPreviousExperience = watch('hasPreviousExperience');

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Format data for API
      const formattedData = {
        engagement: {
          availability: data.availability,
          motivations: data.motivations,
          hasPreviousExperience: data.hasPreviousExperience,
          previousExperience: data.hasPreviousExperience ? data.previousExperience : ''
        }
      };
      console.log("Submitting engagement data:", formattedData);

      // Submit data to the backend
      const response = await volunteerService.updateEngagement(formattedData);
      console.log("Engagement update response:", response);
      
      // Update the profile status to indicate profile is complete
      await updateProfileStatus('COMPLETED');
      console.log("Profile status updated to COMPLETED");
      
      // Call the success callback
      onSubmitSuccess();
    } catch (error) {
      console.error('Error saving engagement info:', error);
      // Add an alert or toast message to notify the user
      alert(`Failed to complete profile: ${error.response?.data?.message || error.message}`);
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
                      onChange(value.filter(val => val !== option));
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
    <div className="engagement-form">
      <h2>Availability and Experience</h2>
      <p className="form-subtitle">Step 3 of 3</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>Availability</h3>
          <p className="section-description">
            How often would you like to volunteer? Select all that apply:
          </p>
          
          <CheckboxGroup
            options={availabilityOptions}
            control={control}
            name="availability"
            error={errors.availability}
          />
        </div>

        <div className="form-section">
          <h3>Motivations</h3>
          <p className="section-description">
            What motivates you to volunteer? Select all that apply:
          </p>
          
          <CheckboxGroup
            options={motivationOptions}
            control={control}
            name="motivations"
            error={errors.motivations}
          />
        </div>

        <div className="form-section">
          <h3>Previous Experience</h3>
          
          <div className="form-field">
            <div className="checkbox-single">
              <input
                type="checkbox"
                id="hasPreviousExperience"
                {...register('hasPreviousExperience')}
              />
              <label htmlFor="hasPreviousExperience">
                I have previous volunteering experience
              </label>
            </div>
          </div>
          
          {hasPreviousExperience && (
            <div className="form-field">
              <label htmlFor="previousExperience">Please describe your previous volunteering experience</label>
              <textarea
                id="previousExperience"
                {...register('previousExperience')}
                className={errors.previousExperience ? 'error' : ''}
                rows={4}
              />
              {errors.previousExperience && (
                <p className="error-message">{errors.previousExperience.message}</p>
              )}
            </div>
          )}
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

export default EngagementForm;