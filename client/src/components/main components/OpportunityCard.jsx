// OpportunityCard.jsx
import React from 'react';
import './stylesheet/OpportunityCard.css';

const OpportunityCard = ({ imageSrc, title, organization, location, description, timestamp }) => {
    return (
        <div className="opportunity-card-container">
            {/* Image Section */}
            <img src={imageSrc} alt={title} className="opportunity-card-image" />

            {/* Content Section */}
            <div className="opportunity-card-content">
                <h2 className="opportunity-card-title">{title}</h2>
                <p className="opportunity-card-organization">{organization}</p>
                <div className="opportunity-card-location">
                    <img src='/location-icon.svg' alt='location-icon' className='opportunity-card-location-icon' />
                    <p>{location}</p>
                </div>
                <div className="opportunity-card-description">
                    <img src='/description-icon.svg' alt='description-icon' className='opportunity-card-description-icon' />
                    <p>{description}</p>
                </div>
                <div className="opportunity-card-footer">
                    <p className="opportunity-card-timestamp">{timestamp}</p>
                    <img src='/share-icon.svg' alt='share-icon' className='opportunity-card-share-icon' />
                </div>
            </div>
        </div>
    );
};

export default OpportunityCard;