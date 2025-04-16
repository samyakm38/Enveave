import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import volunteerService from '../../redux/services/volunteerService';
import { useVolunteerRedux as useVolunteer } from '../../redux/hooks/useVolunteerRedux';

// Zod schema for form validation
const basicDetailsSchema = z.object({
  phoneNumber: z.string()
    .min(10, 'Phone number must have at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  dateOfBirth: z.string()
    .refine(date => !isNaN(new Date(date).getTime()), {
      message: 'Please enter a valid date'
    })
    .refine(date => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 13; // Minimum age requirement
    }, {
      message: 'You must be at least 13 years old'
    }),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  pincode: z.string()
    .min(5, 'Pincode must have at least 5 characters')
    .max(10, 'Pincode must not exceed 10 characters'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Please provide your complete address')
});

const BasicDetailsForm = ({ userData, volunteerData, onSubmitSuccess }) => {
  const { updateProfileStatus, updateBasicDetails } = useVolunteer();
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(volunteerData?.profilePhoto || null);
  
  // Initialize form with React Hook Form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      // Pre-fill with existing data if available
      phoneNumber: volunteerData?.basicDetails?.phoneNumber || '',
      dateOfBirth: volunteerData?.basicDetails?.dateOfBirth 
        ? new Date(volunteerData.basicDetails.dateOfBirth).toISOString().split('T')[0] 
        : '',
      gender: volunteerData?.basicDetails?.gender || '',
      pincode: volunteerData?.basicDetails?.location?.pincode || '',
      state: volunteerData?.basicDetails?.location?.state || '',
      city: volunteerData?.basicDetails?.location?.city || '',
      address: volunteerData?.basicDetails?.location?.address || ''
    }
  });
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Format data for API
      const formattedData = {
        basicDetails: {
          phoneNumber: data.phoneNumber,
          dateOfBirth: new Date(data.dateOfBirth).toISOString(),
          gender: data.gender,
          location: {
            pincode: data.pincode,
            state: data.state,
            city: data.city,
            address: data.address
          }
        },
        // Set profileCompletion.step1 to true
        profileCompletion: {
          step1: true
        }
      };      console.log("Submitting basic details data:", formattedData);

      // Submit data to the backend using the Redux action
      await updateBasicDetails(formattedData);
      
      // If a profile image was selected, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append('profilePhoto', imageFile);
        
        try {
          const imageResponse = await volunteerService.uploadProfilePhoto(formData);
          console.log("Profile photo uploaded successfully:", imageResponse);
        } catch (imageError) {
          console.error("Error uploading profile photo:", imageError);
          // Continue with form submission even if image upload fails
        }
      }
      
      // Update the profile status to indicate Step 1 is complete
      await updateProfileStatus('STEP_1');
      
      // Call the success callback
      onSubmitSuccess();
    } catch (error) {
      console.error('Error saving basic details:', error);
      // You could add error state and display to user here
      alert(`Failed to save your information: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };
  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="basic-details-form">
      <h2>Basic Details</h2>
      <p className="form-subtitle">Step 1 of 3</p>
      
      <div className="user-info-readonly">
        <div className="form-field">
          <label>Full Name</label>
          <input type="text" value={userData?.name || ''} disabled />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input type="email" value={userData?.email || ''} disabled />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number*</label>
          <input 
            id="phoneNumber"
            type="tel" 
            {...register('phoneNumber')} 
            className={errors.phoneNumber ? 'error' : ''}
          />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="dateOfBirth">Date of Birth*</label>
          <input 
            id="dateOfBirth"
            type="date" 
            {...register('dateOfBirth')} 
            className={errors.dateOfBirth ? 'error' : ''}
          />
          {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="gender">Gender*</label>
          <select 
            id="gender"
            {...register('gender')} 
            className={errors.gender ? 'error' : ''}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.gender && <p className="error-message">{errors.gender.message}</p>}
        </div>

        <div className="form-section">
          <h3>Location</h3>
          
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

          <div className="form-row">
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
        </div>        <div className="form-field">
          <label htmlFor="profileImage">Profile Image (Optional)</label>
          <input 
            id="profileImage"
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="profile-image-preview">
              <img src={imagePreview} alt="Profile Preview" className="profile-preview" style={{maxWidth: '150px', marginTop: '10px'}} />
            </div>
          )}
          <p className="field-hint">Upload a profile photo to personalize your volunteer profile (optional)</p>
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

export default BasicDetailsForm;