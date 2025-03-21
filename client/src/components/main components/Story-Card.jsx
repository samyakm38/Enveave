import React from 'react';
import './stylesheet/Card.css';

const StoryCard = ({ image, title, description, link }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
        <a href={link}>
            <img className="w-full rounded-t-xl p-4" src={image} alt={title} />
        </a>
        <div className="card-container flex flex-col flex-grow">
            <div className="card-title-container">
                <a href={link}>
                    <h5>{title}</h5>
                </a>
            </div>
            <div className="card-description-container flex-grow">
                <p>{description}</p>
            </div>
            <div className="card-button">
                <a href={link}>Read more {">"}</a>
            </div>
        </div>
    </div>
);

export default StoryCard;