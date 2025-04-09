import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicDetailsSchema } from './validationSchema';

const BasicDetailsForm = ({ onSubmit, initialData, isLoading }) => {
  const [selectedCategories, setSelectedCategories] = useState(initialData?.category || []);
  const [showCustomCategory, setShowCustomCategory] = useState(
    initialData?.category?.some(cat => cat.name === 'Other') || false
  );
  
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      opportunityType: '',
      category: [],
      volunteersRequired: 1,
      isPaid: false,
      compensation: 0
    },
  });
  
  const isPaid = watch('isPaid');
    // Handle category selection
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    
    let updatedCategories;
    if (checked) {
      // Add category
      const newCategory = { name: value };
      updatedCategories = [...selectedCategories, newCategory];
      
      // Show custom category input if "Other" is selected
      if (value === 'Other') {
        setShowCustomCategory(true);
      }
    } else {
      // Remove category
      updatedCategories = selectedCategories.filter(cat => cat.name !== value);
      
      // Hide custom category input if "Other" is unchecked
      if (value === 'Other') {
        setShowCustomCategory(false);
      }
    }
    
    setSelectedCategories(updatedCategories);
    // This is crucial - update the form's internal state with React Hook Form
    control._formValues.category = updatedCategories;
  };
  
  // Handle custom category input
  const handleCustomCategoryChange = (e) => {
    const customValue = e.target.value;
    setSelectedCategories(selectedCategories.map(cat => 
      cat.name === 'Other' ? { ...cat, customCategory: customValue } : cat
    ));
  };
  
  // Prepare data for submission
  const onFormSubmit = (data) => {
    // Add selected categories to form data
    const formData = {
      ...data,
      category: selectedCategories
    };
    
    onSubmit(formData);
  };
  
  // Category options
  const categoryOptions = [
    'Content Creation & Communication',
    'Field Work & Conservation',
    'Research & Data Collection',
    'Education & Awareness',
    'Administrative Support',
    'Event Management',
    'Technical & IT Support',
    'Fundraising & Grant Writing',
    'Community Outreach',
    'Project Coordination',
    'Waste Management',
    'Sustainability Planning',
    'Wildlife Protection',
    'Climate Action',
    'Other'
  ];
  
  // Opportunity type options
  const opportunityTypes = [
    'One-time Event',
    'Short-term Volunteering (1-4 weeks)',
    'Medium-term Volunteering (1-6 months)',
    'Long-term Volunteering (6+ months)',
    'Other'
  ];

  return (
    <div className="basic-details-form">
      <h2>Create a New Opportunity</h2>
      <p className="form-subtitle">Step 1: Basic Details</p>
      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Title */}
        <div className="form-section">
          <div className="form-field">
            <label htmlFor="title">Opportunity Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter a descriptive title"
              {...register('title')}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <p className="error-message">{errors.title.message}</p>}
          </div>
          
          {/* Description */}
          <div className="form-field">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              rows="5"
              placeholder="Describe the opportunity in detail"
              {...register('description')}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>
          
          {/* Photo Upload */}
          <div className="form-field">
            <label htmlFor="photo">Opportunity Photo</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              {...register('photo')}
            />
            <p className="field-help-text">Upload an image that represents this opportunity (optional)</p>
          </div>
        </div>
        
        {/* Opportunity Type */}
        <div className="form-section">
          <h3>Opportunity Details</h3>
          
          <div className="form-field">
            <label htmlFor="opportunityType">Opportunity Type *</label>
            <select
              id="opportunityType"
              {...register('opportunityType')}
              className={errors.opportunityType ? 'error' : ''}
            >
              <option value="">Select an opportunity type</option>
              {opportunityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.opportunityType && <p className="error-message">{errors.opportunityType.message}</p>}
          </div>
          
          {/* Categories */}
          <div className="form-field">
            <label>Categories *</label>
            <div className="checkbox-options">
              {categoryOptions.map(category => (
                <div key={category} className="checkbox-option">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    value={category}
                    onChange={handleCategoryChange}
                    defaultChecked={selectedCategories.some(cat => cat.name === category)}
                  />
                  <label htmlFor={`category-${category}`}>{category}</label>
                </div>
              ))}
            </div>
            {errors.category && <p className="error-message">{errors.category.message}</p>}
            
            {/* Custom Category Input */}
            {showCustomCategory && (
              <div className="form-field" style={{ marginTop: '1rem' }}>
                <label htmlFor="customCategory">Custom Category *</label>
                <input
                  id="customCategory"
                  type="text"
                  placeholder="Enter custom category"
                  onChange={handleCustomCategoryChange}
                  defaultValue={selectedCategories.find(cat => cat.name === 'Other')?.customCategory || ''}
                />
              </div>
            )}
          </div>
          
          {/* Volunteers Required */}
          <div className="form-field">
            <label htmlFor="volunteersRequired">Number of Volunteers Required *</label>
            <Controller
              name="volunteersRequired"
              control={control}
              render={({ field }) => (
                <input
                  id="volunteersRequired"
                  type="number"
                  min="1"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                  className={errors.volunteersRequired ? 'error' : ''}
                />
              )}
            />
            {errors.volunteersRequired && <p className="error-message">{errors.volunteersRequired.message}</p>}
          </div>
          
          {/* Is Paid */}
          <div className="form-field">
            <div className="checkbox-single">
              <input
                id="isPaid"
                type="checkbox"
                {...register('isPaid')}
              />
              <label htmlFor="isPaid">This is a paid opportunity</label>
            </div>
            
            {/* Compensation (shown only if isPaid is checked) */}
            {isPaid && (
              <div className="form-field" style={{ marginTop: '1rem' }}>
                <label htmlFor="compensation">Compensation Amount (in local currency) *</label>
                <Controller
                  name="compensation"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="compensation"
                      type="number"
                      min="0"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      className={errors.compensation ? 'error' : ''}
                    />
                  )}
                />
                {errors.compensation && <p className="error-message">{errors.compensation.message}</p>}
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="form-actions">
          <div></div> {/* Empty div for flex spacing */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Next: Location & Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicDetailsForm;
