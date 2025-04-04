import React, { useState } from 'react';
import '../../stylesheet/CompletionModal.css';

const CompletionModal = ({ isOpen, onClose, onSubmit, opportunityName }) => {
    const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);
    const [outcome, setOutcome] = useState('');
    const [error, setError] = useState('');

    // Set the max date as today (cannot complete in the future)
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate the form
        if (!completionDate) {
            setError('Please select a completion date');
            return;
        }
        
        if (!outcome.trim()) {
            setError('Please provide an outcome summary');
            return;
        }
        
        // Call the parent submit handler with the form data
        onSubmit({
            completionDate,
            outcome
        });
    };

    if (!isOpen) return null;

    return (
        <div className="completion-modal-overlay">
            <div className="completion-modal">
                <div className="completion-modal-header">
                    <h2>Mark Opportunity as Completed</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="completion-modal-body">
                    <p className="opportunity-name">
                        Opportunity: <strong>{opportunityName}</strong>
                    </p>
                    
                    {error && <p className="error-message">{error}</p>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="completion-date">Completion Date:</label>
                            <input 
                                type="date" 
                                id="completion-date"
                                max={today}
                                value={completionDate}
                                onChange={(e) => setCompletionDate(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="outcome">Outcome Summary:</label>
                            <textarea 
                                id="outcome"
                                rows="4"
                                placeholder="Describe the outcomes and impact of this opportunity..."
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" className="cancel-button" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="submit-button">
                                Mark as Completed
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompletionModal;