// OpportunitySection.jsx
import React, { useEffect, useRef } from 'react';
import OpportunityCard from "../main components/OpportunityCard.jsx";
import { useOpportunities } from '../../redux/hooks';
import './stylesheet/OpportunitySection.css';

const OpportunitySection = () => {
    // Use our custom Redux hook for opportunities
    const { getLatestOpportunities, opportunities, loading, error } = useOpportunities();
    
    // Use a ref to track if we've already loaded data
    const dataFetchedRef = useRef(false);

    // Fetch latest opportunities when component mounts, but only once
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        
        getLatestOpportunities()
            .catch(err => console.error('Error fetching opportunities:', err));
            
        // No dependencies array - this effect runs only once when component mounts
    }, []);

    // Render loading state
    if (loading && !opportunities.length) {
        return (
            <div className="opportunity-section loading">
                <p>Loading opportunities...</p>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="opportunity-section error">
                <p>Error loading opportunities: {error}</p>
            </div>
        );
    }

    // If no opportunities or opportunities is not an array
    if (!opportunities || !Array.isArray(opportunities) || opportunities.length === 0) {
        return (
            <div className="opportunity-section empty">
                <p>No opportunities available at the moment. Check back soon!</p>
            </div>
        );
    }

    // Render opportunities
    return (
        <div className="opportunity-section">
            {opportunities.map((opportunity) => (
                <OpportunityCard
                    key={opportunity._id}
                    imageSrc={opportunity.basicDetails?.photo || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"}
                    title={opportunity.basicDetails?.title || "Untitled Opportunity"}
                    organization={opportunity.provider?.auth?.organizationName || "Organization"}
                    location={opportunity.schedule?.location || "Location not specified"}
                    description={opportunity.basicDetails?.description || "No description available"}
                    timestamp={getTimestamp(opportunity.createdAt)}
                />
            ))}
        </div>
    );
};

// Helper function to format timestamp (e.g., "2 days ago", "5 hours ago", etc.)
const getTimestamp = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
        
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        }
        
        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } catch (error) {
        console.error('Error calculating timestamp:', error);
        return 'Recently';
    }
};

export default OpportunitySection;