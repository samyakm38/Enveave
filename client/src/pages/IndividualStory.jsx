import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/main components/Header';
import Footer from '../components/main components/Footer';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const IndividualStory = () => {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Default image to use if no image is provided
    const defaultImage = '/home-story-1.png';
    
    useEffect(() => {
        const fetchStory = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-story/${id}`);
                setStory(response.data.story);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch story');
                console.error('Error fetching story:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStory();
        }
    }, [id]);

    // Format the date to relative time (e.g., "2 days ago")
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (e) {
            console.error('Date formatting error:', e);
            return dateString;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow bg-gray-50 py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                            <p>{error}</p>
                        </div>
                    ) : story ? (
                        <article className="bg-white rounded-lg shadow-md overflow-hidden">
                            {story.photo ? (
                                <img 
                                    src={story.photo} 
                                    alt={story.title} 
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                            ) : (
                                <img 
                                    src={defaultImage} 
                                    alt="Default story image" 
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                            )}
                            
                            <div className="p-6 md:p-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {story.title}
                                </h1>
                                
                                <div className="flex items-center text-gray-600 text-sm mb-6">
                                    {/* <span>
                                        {story.creator?.name ? `By ${story.creator.name}` : 'By Anonymous'}
                                    </span> */}
                                    <span className="mx-2">•</span>
                                    <span>
                                        {formatDate(story.publishedAt || story.createdAt)}
                                    </span>
                                </div>                                <div 
                                    className="prose max-w-none" 
                                    dangerouslySetInnerHTML={{ __html: story.content }}
                                />
                            </div>
                        </article>
                    ) : (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                            <p>Story not found.</p>
                        </div>
                    )}
                    
                    <div className="mt-8 flex justify-center">
                        <a 
                            href="/stories" 
                            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Back to All Stories
                        </a>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default IndividualStory;
