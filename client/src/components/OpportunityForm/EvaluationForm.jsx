import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { evaluationSchema } from './validationSchema';

const EvaluationForm = ({ onSubmit, onPrevious, initialData, isLoading }) => {
  const [selectedSupport, setSelectedSupport] = useState(initialData?.support || []);
  const [showCustomSupport, setShowCustomSupport] = useState(
    initialData?.support?.some(item => item.name === 'Other') || false
  );
  const [hasMilestones, setHasMilestones] = useState(initialData?.hasMilestones || false);
  const [milestones, setMilestones] = useState(initialData?.milestones || [{ question: '', expectedAnswer: true }]);
  
  // Set up form with validation
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(evaluationSchema),
    defaultValues: initialData || {
      support: [],
      hasMilestones: false,
      milestones: []
    }
  });
  
  // Watch for hasMilestones changes
  const watchHasMilestones = watch('hasMilestones');
  
  // Handle support selection
  const handleSupportChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add support
      const newSupport = { name: value };
      setSelectedSupport([...selectedSupport, newSupport]);
      
      // Show custom support input if "Other" is selected
      if (value === 'Other') {
        setShowCustomSupport(true);
      }
    } else {
      // Remove support
      setSelectedSupport(selectedSupport.filter(item => item.name !== value));
      
      // Hide custom support input if "Other" is unchecked
      if (value === 'Other') {
        setShowCustomSupport(false);
      }
    }
    
    // Update form value
    setValue('support', selectedSupport);
  };
  
  // Handle custom support input
  const handleCustomSupportChange = (e) => {
    const customValue = e.target.value;
    const updatedSupport = selectedSupport.map(item => 
      item.name === 'Other' ? { ...item, customSupport: customValue } : item
    );
    setSelectedSupport(updatedSupport);
    
    // Update form value
    setValue('support', updatedSupport);
  };
  
  // Handle milestone toggle
  const handleMilestoneToggle = (e) => {
    const { checked } = e.target;
    setHasMilestones(checked);
    
    // Initialize milestones array if enabling
    if (checked && milestones.length === 0) {
      const initialMilestone = { question: '', expectedAnswer: true };
      setMilestones([initialMilestone]);
    }
    
    // Update form value
    setValue('hasMilestones', checked);
    if (checked) {
      setValue('milestones', milestones);
    }
  };
  
  // Add a new milestone
  const handleAddMilestone = () => {
    const newMilestone = { question: '', expectedAnswer: true };
    setMilestones([...milestones, newMilestone]);
    
    // Update form value
    setValue('milestones', [...milestones, newMilestone]);
  };
  
  // Remove a milestone
  const handleRemoveMilestone = (index) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
    
    // Update form value
    setValue('milestones', updatedMilestones);
  };
  
  // Update milestone question
  const handleMilestoneQuestionChange = (index, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index].question = value;
    setMilestones(updatedMilestones);
    
    // Update form value
    setValue('milestones', updatedMilestones);
  };
  
  // Update milestone expected answer
  const handleMilestoneAnswerChange = (index, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index].expectedAnswer = value;
    setMilestones(updatedMilestones);
    
    // Update form value
    setValue('milestones', updatedMilestones);
  };
  
  // Handle form submission
  const onFormSubmit = (data) => {
    // Add selected support to form data
    const formData = {
      ...data,
      support: selectedSupport,
      milestones: hasMilestones ? milestones : []
    };
    
    onSubmit(formData);
  };
  
  // Support options
  const supportOptions = [
    'Travel Reimbursement',
    'Food & Accommodation',
    'Certificate of Participation',
    'Letter of Recommendation',
    'Stipend/Monetary Incentive',
    'Learning/Training Sessions',
    'Networking Opportunities',
    'Other'
  ];

  return (
    <div className="evaluation-form">
      <h2>Create a New Opportunity</h2>
      <p className="form-subtitle">Step 3: Support & Milestones</p>
      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Support Options */}
        <div className="form-section">
          <h3>Support Provided to Volunteers</h3>
          <p className="section-description">
            Select what support or benefits will be provided to volunteers.
          </p>
          
          <div className="form-field">
            <label>Support Options *</label>
            <div className="checkbox-options">
              {supportOptions.map(option => (
                <div key={option} className="checkbox-option">
                  <input
                    type="checkbox"
                    id={`support-${option}`}
                    value={option}
                    onChange={handleSupportChange}
                    defaultChecked={selectedSupport.some(item => item.name === option)}
                  />
                  <label htmlFor={`support-${option}`}>{option}</label>
                </div>
              ))}
            </div>
            {errors.support && <p className="error-message">{errors.support.message}</p>}
            
            {/* Custom Support Input */}
            {showCustomSupport && (
              <div className="form-field" style={{ marginTop: '1rem' }}>
                <label htmlFor="customSupport">Custom Support *</label>
                <input
                  id="customSupport"
                  type="text"
                  placeholder="Enter custom support"
                  onChange={handleCustomSupportChange}
                  defaultValue={selectedSupport.find(item => item.name === 'Other')?.customSupport || ''}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Milestones */}
        <div className="form-section">
          <h3>Success Milestones</h3>
          <p className="section-description">
            Define milestones to track volunteer performance and project success.
          </p>
          
          <div className="form-field">
            <div className="checkbox-single">
              <input
                id="hasMilestones"
                type="checkbox"
                {...register('hasMilestones')}
                onChange={handleMilestoneToggle}
                checked={hasMilestones}
              />
              <label htmlFor="hasMilestones">This opportunity has specific milestones or success criteria</label>
            </div>
          </div>
          
          {watchHasMilestones && (
            <div className="milestones-container">
              <p className="milestone-instructions">
                Add questions that will be used to evaluate the success of this opportunity.
                Each question can have a "Yes" or "No" expected answer.
              </p>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="milestone-item">
                  <div className="form-field">
                    <label htmlFor={`milestone-${index}`}>Milestone Question {index + 1} *</label>
                    <input
                      id={`milestone-${index}`}
                      type="text"
                      placeholder="e.g., Did the volunteer complete all assigned tasks?"
                      value={milestone.question}
                      onChange={(e) => handleMilestoneQuestionChange(index, e.target.value)}
                      className={errors.milestones?.[index]?.question ? 'error' : ''}
                    />
                  </div>
                  
                  <div className="form-field expected-answer">
                    <label>Expected Answer:</label>
                    <div className="radio-options">
                      <div className="radio-option">
                        <input
                          type="radio"
                          id={`answer-yes-${index}`}
                          name={`expectedAnswer-${index}`}
                          checked={milestone.expectedAnswer === true}
                          onChange={() => handleMilestoneAnswerChange(index, true)}
                        />
                        <label htmlFor={`answer-yes-${index}`}>Yes</label>
                      </div>
                      <div className="radio-option">
                        <input
                          type="radio"
                          id={`answer-no-${index}`}
                          name={`expectedAnswer-${index}`}
                          checked={milestone.expectedAnswer === false}
                          onChange={() => handleMilestoneAnswerChange(index, false)}
                        />
                        <label htmlFor={`answer-no-${index}`}>No</label>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="remove-milestone-btn"
                    onClick={() => handleRemoveMilestone(index)}
                    disabled={milestones.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                className="add-milestone-btn"
                onClick={handleAddMilestone}
              >
                + Add Another Milestone
              </button>
              
              {errors.milestones && <p className="error-message">{errors.milestones.message}</p>}
            </div>
          )}
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
            {isLoading ? 'Saving...' : 'Next: Additional Information'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
