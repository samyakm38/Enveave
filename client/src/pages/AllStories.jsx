import React, { useState, useEffect } from 'react';
import Header from '../components/main components/Header';
import Footer from '../components/main components/Footer';
import StoryCard from '../components/main components/Story-Card';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import { Pagination } from 'flowbite-react';

const AllStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Detect if the screen is mobile
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 641px) and (max-width: 1024px)' });

    // Fetch stories from backend
    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-all-stories`, {
                    params: { page: currentPage, limit: 9 } // Show 9 stories per page
                });                const formattedStories = response.data.stories.map((story) => ({
                    image: story.photo || '/home-story-1.png', // Fallback image
                    title: story.title,
                    description: story.content.length > 150 
                        ? `${story.content.substring(0, 150)}...` 
                        : story.content,
                    storyId: story._id, // Pass the story ID to enable navigation to individual story
                }));
                
                setStories(formattedStories);
                setTotalPages(response.data.pagination.totalPages);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch stories');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [currentPage]);

    // Function to handle page change
    const onPageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    // Calculate grid columns based on screen size
    const getGridClass = () => {
        if (isMobile) return "grid grid-cols-1 gap-6";
        if (isTablet) return "grid grid-cols-2 gap-6";
        return "grid grid-cols-3 gap-8";
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow bg-gray-50 py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Enveave Stories</h1>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Discover inspiring stories from our volunteers and opportunity providers. These stories showcase the impact of community service and the power of giving back.
                    </p>
                    
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                            <p className="mt-2 text-gray-600">Loading stories...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    ) : stories.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">No stories found.</div>
                    ) : (
                        <>
                            <div className={getGridClass()}>
                                {stories.map((story, index) => (
                                    <div key={index} className="h-full">
                                        <StoryCard {...story} />
                                    </div>
                                ))}
                            </div>
                            
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-10">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}
                                        showIcons
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default AllStories;
