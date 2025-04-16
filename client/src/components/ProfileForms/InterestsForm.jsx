import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import volunteerService from '../../redux/services/volunteerService';
import { useVolunteerRedux as useVolunteer } from '../../redux/hooks/useVolunteerRedux';

// Zod schema for form validation
const interestsSchema = z.object({
  causes: z.array(z.string())
    .min(1, 'Please select at least one cause'),
  skills: z.array(z.string())
    .min(1, 'Please select at least one skill')
});

// Available causes and skills options from the model
const causeOptions = [
  "Climate Action",
  "Environmental Conservation",
  "Waste Management",
  "Wildlife Protection",
  "Marine Conservation",
  "Forest Conservation",
  "Water Conservation",
  "Air Quality",
  "Environmental Education",
  "Habitat Restoration",
  "Others"
];

const skillOptions = [
  "Environmental Research",
  "Data Collection & Analysis",
  "Environmental Education",
  "Waste Management",
  "Community Outreach",
  "Project Management",
  "Field Work",
  "Social Media Management",
  "Photography",
  "Editorial Writing",
  "Graphic Designing",
  "Sustainable Design",
  "Water Quality Testing",
  "Others"
];

const InterestsForm = ({ volunteerData, onSubmitSuccess, onBack }) => {
  const { updateProfileStatus, updateInterests } = useVolunteer();
  // Initialize form with React Hook Form
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      // Pre-fill with existing data if available
      causes: volunteerData?.interests?.causes || [],
      skills: volunteerData?.interests?.skills || []
    }
  });  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Format data for API
      const formattedData = {
        interests: {
          causes: data.causes,
          skills: data.skills
        },
        // Add profileCompletion.step2=true to match the pattern in BasicDetailsForm
        profileCompletion: {
          step2: true
        }
      };
      console.log("Submitting interests data:", formattedData);
      
      // Submit data to the backend using the Redux action
      const interestsResult = await updateInterests(formattedData);
      console.log("Interests update result:", interestsResult);
      
      if (!interestsResult) {
        throw new Error("Failed to update interests - no response received");
      }
      
      // Update the profile status to indicate Step 2 is complete
      const statusResult = await updateProfileStatus('STEP_2');
      console.log("Profile status update result:", statusResult);
      
      if (!statusResult) {
        throw new Error("Failed to update profile status - no response received");
      }
      
      // IMPORTANT: Use a setTimeout to ensure the state changes have time to propagate
      setTimeout(() => {
        // Call the success callback to move to next step
        console.log("Calling onSubmitSuccess to move to next step");
        onSubmitSuccess();
      }, 100);
    } catch (error) {
      console.error('Error saving interests:', error);
      alert(`Failed to save your interests: ${error?.message || 'Unknown error'}`);
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
    <div className="interests-form">
      <h2>Interests and Skills</h2>
      <p className="form-subtitle">Step 2 of 3</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>Environmental Causes</h3>
          <p className="section-description">
            Select the environmental causes you are passionate about and would like to volunteer for:
          </p>
          
          <CheckboxGroup
            options={causeOptions}
            control={control}
            name="causes"
            error={errors.causes}
          />
        </div>

        <div className="form-section">
          <h3>Skills & Expertise</h3>
          <p className="section-description">
            Select the skills and expertise you can contribute:
          </p>
          
          <CheckboxGroup
            options={skillOptions}
            control={control}
            name="skills"
            error={errors.skills}
          />
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
            {isSubmitting ? 'Saving...' : 'Next Step'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterestsForm;