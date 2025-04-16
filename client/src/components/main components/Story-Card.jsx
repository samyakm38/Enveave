import React from 'react';
import './stylesheet/Card.css';

const StoryCard = ({ image, title, description, link, storyId }) => {
    // Default image if none is provided
    const defaultImage = '/home-story-1.png';
    
    // Use the storyId to create a link to the individual story page
    const storyLink = storyId ? `/stories/${storyId}` : link || '#';
    
    return (
    <div className="story-card bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
        <a href={storyLink}>
            <img className="w-full rounded-t-xl p-4" src={ image || defaultImage} alt={title} />
        </a>
        <div className="card-container flex flex-col flex-grow">
            <div className="card-title-container">
                <a href={storyLink}>
                    <h5>{title}</h5>
                </a>
            </div>
            <div className="card-description-container flex-grow">
                <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className="card-button">
                <a href={storyLink}>Read more {">"}</a>
            </div>
        </div>
    </div>
  );
};

export default StoryCard;