// OpportunitySection.jsx
import React from 'react';
import OpportunityCard from "../main components/OpportunityCard.jsx";
import './stylesheet/OpportunitySection.css'


const OpportunitySection = () => {
    return (
        <div className="opportunity-section">
            <OpportunityCard
                imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                title="SOLAR ENERGY PROJECT"
                organization="GreenFuture NGO"
                location="Onsite - Delhi"
                description="Join our mission to promote renewable energy and sustainability."
                timestamp="11 days ago"
            />
            <OpportunityCard
                imageSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                title="BEACH CLEANUP DRIVE"
                organization="OceanCare Foundation"
                location="Onsite - Mumbai"
                description="Help us clean up the beaches and protect marine life."
                timestamp="5 days ago"
            />
            <OpportunityCard
                imageSrc="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                title="EDUCATION FOR ALL"
                organization="BrightFuture NGO"
                location="Remote - Bangalore"
                description="Support education initiatives for underprivileged children."
                timestamp="2 days ago"
            />
        </div>
    );
};

export default OpportunitySection;