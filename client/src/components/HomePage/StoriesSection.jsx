import React, { useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios'; // Import axios
import StoryCard from '../main components/Story-Card.jsx'; // Adjust the import path as needed

const StoriesSection = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Detect if the screen is mobile (max-width: 640px)
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

    // Fetch stories from backend using axios with env variable
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-stories`);
                const formattedStories = response.data.stories.map((story) => ({
                    image: story.photo || '/home-story-1.png', // Use actual photo or fallback
                    title: story.title,
                    description: story.content.length > 150 
                        ? `${story.content.substring(0, 150)}...` 
                        : story.content,
                    storyId: story._id, // Pass the story ID to the StoryCard
                }));
                setStories(formattedStories);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch stories');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    // Loading state
    if (loading) {
        return <div className="p-4 text-center">Loading stories...</div>;
    }

    // Error state
    if (error) {
        return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            {/* Conditional Rendering */}
            {isMobile ? (
                <div className="carousel-container px-8">
                    <Carousel indicators={true} controls={true}>
                        {stories.map((card, index) => (
                            <StoryCard key={index} {...card} />
                        ))}
                    </Carousel>
                </div>
            ) : (
                <div className="flex justify-center gap-8">
                    {stories.map((card, index) => (
                        <div key={index} className="max-w-sm">
                            <StoryCard {...card} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoriesSection;