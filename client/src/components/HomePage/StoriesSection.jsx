import React from 'react';
import './stylesheet/StorySection.css';

const StoriesSection = () => {
    // Data for three cards; update image paths, titles, and descriptions as needed
    const cardData = [
        {
            image: '/home-story-1.png',
            title: 'Planting Hope: A Volunteer’s Journey',
            description:
                'Inspired by Enveave, volunteers came together to plant over 5,000 trees in a barren village, transforming it into a thriving green haven. Their passion proves that small actions lead to big changes.',
            link: '#'
        },
        {
            image: '/home-story-2.png',
            title: 'Clean Shores, Clear Futures',
            description:
                'With support from Enveave, an NGO organized a coastal cleanup drive that removed 10 tons of plastic waste from beaches, restoring marine habitats and raising awareness about plastic pollution.',
            link: '#'
        },
        {
            image: '/home-story-3.png',
            title: 'Greener Workplaces, Greener Planet',
            description:
                'A corporate team partnered with Enveave to set up rooftop solar panels in schools, ensuring clean energy access for 1,000+ students while reducing their carbon footprint.',
            link: '#'
        }
    ];

    return (
        <div className="flex justify-center gap-8 p-4">
            {cardData.map((card, index) => (
                <div
                    key={index}
                    className="max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col"
                >
                    <a href={card.link}>
                        <img
                            className="w-full rounded-t-xl p-4"
                            src={card.image}
                            alt={card.title}
                        />
                    </a>
                    <div className="home-story-card-container">
                        {/* Title in its own div */}
                        <div className="home-story-card-title-container">
                            <a href={card.link}>
                                <h5>
                                    {card.title}
                                </h5>
                            </a>
                        </div>
                        {/* Description in its own div with flex-grow to take up extra space */}
                        <div className="home-story-description-container">
                            <p>
                                {card.description}
                            </p>
                        </div>
                        {/* Button in its own div */}
                        <div className="home-story-button">
                            <a href={card.link}>
                                Read more {">"}
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StoriesSection;
