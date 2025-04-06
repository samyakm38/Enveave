import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProviderProfile } from '../../redux/hooks/useProviderProfile';
import { useAuth } from '../../redux/hooks';
import '../../stylesheet/ProfileForms.css'; // Import shared form styling

// Zod schema for form validation
const organizationDetailsSchema = z.object({
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(500, 'Description must not exceed 500 characters'),
  website: z.string()
    .url('Please enter a valid URL')
    .min(5, 'Website URL is required'),
  address: z.string()
    .min(5, 'Address is required'),
  city: z.string()
    .min(2, 'City is required'),
  state: z.string()
    .min(2, 'State is required'),
  pincode: z.string()
    .min(5, 'Pincode must have at least 5 characters')
    .max(10, 'Pincode must not exceed 10 characters')
    .regex(/^\d+$/, 'Pincode must contain only digits')
});

const OrganizationDetailsForm = ({ userData, providerData, onSubmitSuccess, uploadLogo }) => {
  const { updateProfile } = useProviderProfile();
  const { updateProfile: updateAuthProfile } = useAuth();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(
    providerData?.organizationDetails?.logo || null
  );
  
  // Initialize form with React Hook Form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(organizationDetailsSchema),
    defaultValues: {
      // Pre-fill with existing data if available
      description: providerData?.organizationDetails?.description || '',
      website: providerData?.organizationDetails?.website || '',
      address: providerData?.organizationDetails?.location?.address || '',
      city: providerData?.organizationDetails?.location?.city || '',
      state: providerData?.organizationDetails?.location?.state || '',
      pincode: providerData?.organizationDetails?.location?.pincode || ''
    }
  });

  // Handle logo file change
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // First, upload the logo if a new one was selected
      let logoUrl = providerData?.organizationDetails?.logo || null;
      
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        logoUrl = await uploadLogo(formData);
      }
      
      if (!logoUrl) {
        alert('Please upload an organization logo');
        return;
      }
      
      // Format data for API
      const formattedData = {
        organizationName: userData?.organizationName || providerData?.organizationName,
        description: data.description,
        website: data.website,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        },
        logo: logoUrl
      };

      // Submit data to the backend
      await updateProfile(formattedData);
      
      // Update auth profile status - fixed function name here
      await updateAuthProfile({ profileStatus: 'STEP_1' });
      
      // Call the success callback to proceed to next step
      onSubmitSuccess();
    } catch (error) {
      console.error('Error saving organization details:', error);
      alert(`Failed to save your information: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="profile-form-container organization-details-form">
      <h2>Organization Details</h2>
      <p className="form-subtitle">Step 1 of 2</p>
      
      <div className="user-info-readonly">
        <div className="form-field">
          <label>Organization Name</label>
          <input 
            type="text" 
            value={userData?.organizationName || ''} 
            disabled 
          />
        </div>
        <div className="form-field">
          <label>Contact Person Name</label>
          <input 
            type="text" 
            value={userData?.contactPerson?.name || ''} 
            disabled 
          />
        </div>
        <div className="form-field">
          <label>Contact Email</label>
          <input 
            type="email" 
            value={userData?.contactPerson?.email || ''} 
            disabled 
          />
        </div>
        <div className="form-field">
          <label>Contact Phone Number</label>
          <input 
            type="tel" 
            value={userData?.contactPerson?.phoneNumber || ''} 
            disabled 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="form-field logo-upload">
          <label>Organization Logo*</label>
          <div className="logo-container">
            {logoPreview && (
              <div className="logo-preview">
                <img src={logoPreview} alt="Organization Logo Preview" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="file-input"
            />
            <p className="field-hint">Upload a square logo or image for best results</p>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="description">Organization Description*</label>
          <textarea
            id="description"
            {...register('description')}
            className={errors.description ? 'error' : ''}
            rows={5}
            placeholder="Describe your organization's mission, vision, and environmental work"
          />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="website">Organization Website*</label>
          <input
            id="website"
            type="url"
            {...register('website')}
            className={errors.website ? 'error' : ''}
            placeholder="https://www.example.org"
          />
          {errors.website && <p className="error-message">{errors.website.message}</p>}
        </div>

        <div className="form-section">
          <h3>Office Location</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pincode">Pincode*</label>
              <input 
                id="pincode"
                type="text" 
                {...register('pincode')} 
                className={errors.pincode ? 'error' : ''}
              />
              {errors.pincode && <p className="error-message">{errors.pincode.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="state">State*</label>
              <input 
                id="state"
                type="text" 
                {...register('state')} 
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <p className="error-message">{errors.state.message}</p>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="city">City*</label>
            <input 
              id="city"
              type="text" 
              {...register('city')} 
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <p className="error-message">{errors.city.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="address">Complete Address*</label>
            <textarea 
              id="address"
              {...register('address')} 
              className={errors.address ? 'error' : ''}
              rows={3}
            />
            {errors.address && <p className="error-message">{errors.address.message}</p>}
          </div>
        </div>

        <div className="form-actions">
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

export default OrganizationDetailsForm;