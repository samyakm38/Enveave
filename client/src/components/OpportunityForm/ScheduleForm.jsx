import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema } from './validationSchema';

const ScheduleForm = ({ onSubmit, onPrevious, initialData, isLoading }) => {
  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d instanceof Date && !isNaN(d) 
      ? d.toISOString().split('T')[0]
      : '';
  };
    // Parse dates from form inputs
  const parseDates = (data) => {
    // Create a copy of the data
    const parsedData = { ...data };
    
    // Convert string dates to proper Date objects with timezone handling
    if (data.startDate) {
      // Add time component to ensure proper date creation
      parsedData.startDate = new Date(`${data.startDate}T12:00:00`);
    }
    
    if (data.endDate) {
      parsedData.endDate = new Date(`${data.endDate}T12:00:00`);
    }
    
    if (data.applicationDeadline) {
      parsedData.applicationDeadline = new Date(`${data.applicationDeadline}T12:00:00`);
    }
    
    return parsedData;
  };

  // Set up form with validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: initialData ? {
      ...initialData,
      startDate: formatDateForInput(initialData.startDate),
      endDate: formatDateForInput(initialData.endDate),
      applicationDeadline: formatDateForInput(initialData.applicationDeadline)
    } : {
      location: '',
      startDate: formatDateForInput(new Date()),
      endDate: formatDateForInput(new Date(new Date().setDate(new Date().getDate() + 7))),
      applicationDeadline: formatDateForInput(new Date()),
      timeCommitment: '',
      contactPerson: {
        name: '',
        email: '',
        phoneNumber: ''
      }
    }
  });

  // Handle form submission
  const onFormSubmit = (data) => {
    // Convert string dates to Date objects
    const formattedData = parseDates(data);
    onSubmit(formattedData);
  };

  return (
    <div className="schedule-form">
      <h2>Create a New Opportunity</h2>
      <p className="form-subtitle">Step 2: Location & Schedule</p>
      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Location */}
        <div className="form-section">
          <h3>Location</h3>
          <div className="form-field">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              placeholder="Enter the location of this opportunity"
              {...register('location')}
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <p className="error-message">{errors.location.message}</p>}
          </div>
        </div>
        
        {/* Schedule */}
        <div className="form-section">
          <h3>Schedule</h3>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                {...register('startDate')}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <p className="error-message">{errors.startDate.message}</p>}
            </div>
            
            <div className="form-field">
              <label htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                type="date"
                {...register('endDate')}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <p className="error-message">{errors.endDate.message}</p>}
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="applicationDeadline">Application Deadline *</label>
            <input
              id="applicationDeadline"
              type="date"
              {...register('applicationDeadline')}
              className={errors.applicationDeadline ? 'error' : ''}
            />
            {errors.applicationDeadline && <p className="error-message">{errors.applicationDeadline.message}</p>}
          </div>
          
          <div className="form-field">
            <label htmlFor="timeCommitment">Time Commitment *</label>
            <select
              id="timeCommitment"
              {...register('timeCommitment')}
              className={errors.timeCommitment ? 'error' : ''}
            >
              <option value="">Select time commitment</option>
              <option value="Few hours per week">Few hours per week</option>
              <option value="1-2 days per week">1-2 days per week</option>
              <option value="3-4 days per week">3-4 days per week</option>
              <option value="Full-time">Full-time</option>
            </select>
            {errors.timeCommitment && <p className="error-message">{errors.timeCommitment.message}</p>}
          </div>
        </div>
        
        {/* Contact Person */}
        <div className="form-section">
          <h3>Contact Person</h3>
          <p className="section-description">
            Please provide contact details for the person responsible for this opportunity.
          </p>
          
          <div className="form-field">
            <label htmlFor="contactPersonName">Contact Person Name *</label>
            <input
              id="contactPersonName"
              type="text"
              placeholder="Full name"
              {...register('contactPerson.name')}
              className={errors.contactPerson?.name ? 'error' : ''}
            />
            {errors.contactPerson?.name && <p className="error-message">{errors.contactPerson.name.message}</p>}
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contactPersonEmail">Email *</label>
              <input
                id="contactPersonEmail"
                type="email"
                placeholder="Email address"
                {...register('contactPerson.email')}
                className={errors.contactPerson?.email ? 'error' : ''}
              />
              {errors.contactPerson?.email && <p className="error-message">{errors.contactPerson.email.message}</p>}
            </div>
            
            <div className="form-field">
              <label htmlFor="contactPersonPhone">Phone Number *</label>
              <input
                id="contactPersonPhone"
                type="tel"
                placeholder="Phone number"
                {...register('contactPerson.phoneNumber')}
                className={errors.contactPerson?.phoneNumber ? 'error' : ''}
              />
              {errors.contactPerson?.phoneNumber && <p className="error-message">{errors.contactPerson.phoneNumber.message}</p>}
            </div>
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
            {isLoading ? 'Saving...' : 'Next: Support & Milestones'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
