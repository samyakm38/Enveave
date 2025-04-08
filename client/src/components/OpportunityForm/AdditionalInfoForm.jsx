import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { additionalInfoSchema } from './validationSchema';

const AdditionalInfoForm = ({ onSubmit, onPrevious, initialData, isLoading }) => {
  // Set up form with validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: initialData || {
      resources: '',
      consentAgreement: false
    }
  });

  // Handle form submission
  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="additional-info-form">
      <h2>Create a New Opportunity</h2>
      <p className="form-subtitle">Step 4: Additional Information</p>
      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Resources Section */}
        <div className="form-section">
          <h3>Resources</h3>
          <p className="section-description">
            Provide any additional resources or links that might be helpful for volunteers.
          </p>
          
          <div className="form-field">
            <label htmlFor="resources">Additional Resources</label>
            <textarea
              id="resources"
              rows="5"
              placeholder="Enter links to relevant documents, websites, or other resources"
              {...register('resources')}
            />
            <p className="field-help-text">
              This could include links to training materials, websites, documents, or any other resources that would help volunteers prepare.
            </p>
          </div>
        </div>
        
        {/* Consent Agreement */}
        <div className="form-section">
          <h3>Terms and Conditions</h3>
          <p className="section-description">
            Please review and agree to the following terms before creating this opportunity.
          </p>
          
          <div className="terms-container" style={{ 
            backgroundColor: '#f9f9f9', 
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '1rem',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <p>By creating this opportunity, you agree to:</p>
            <ul>
              <li>Accurately represent the details of this volunteer opportunity</li>
              <li>Respond to applicants in a timely manner</li>
              <li>Provide the support indicated in this form</li>
              <li>Adhere to all applicable laws and regulations</li>
              <li>Maintain a safe, respectful, and inclusive environment for all volunteers</li>
              <li>Provide proper training and supervision for volunteers</li>
              <li>Not discriminate based on race, ethnicity, gender, religion, age, or disability</li>
            </ul>
          </div>
          
          <div className="form-field">
            <div className="checkbox-single">
              <input
                id="consentAgreement"
                type="checkbox"
                {...register('consentAgreement')}
                className={errors.consentAgreement ? 'error' : ''}
              />
              <label htmlFor="consentAgreement">
                I agree to the terms and conditions for creating an opportunity *
              </label>
            </div>
            {errors.consentAgreement && <p className="error-message">{errors.consentAgreement.message}</p>}
          </div>
        </div>
        
        {/* Success Message */}
        <div className="form-section" style={{ textAlign: 'center' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#edf7f0', 
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h3 style={{ color: '#236D4E', marginBottom: '0.5rem' }}>
              Almost Done!
            </h3>
            <p>
              Click "Create Opportunity" below to finalize and publish your opportunity.
              It will be visible to volunteers after review.
            </p>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onPrevious}
            disabled={isLoading}
          >
            Previous
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalInfoForm;
