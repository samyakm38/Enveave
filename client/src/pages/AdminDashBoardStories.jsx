import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import AdminDashboardStoryCardComponent from "../components/Dashboard/Admin-DashBoard/AdminDashboardStoryCardComponent.jsx"; // Adjust path
import { FaFilter, FaSort, FaPlus, FaArrowLeft } from 'react-icons/fa';
import '../stylesheet/AdminDashBoardStories.css'; // We'll create this CSS file next

// Placeholder images - replace with actual imports or URLs
import storyImg1 from '/home-story-3.png';
import storyImg2 from '/home-story-3.png';
import storyImg3 from '/home-story-3.png';
import storyImg4 from '/home-story-3.png';
import storyImg5 from '/home-story-3.png';
import storyImg6 from '/home-story-3.png';
import authorImg from '/home-story-3.png'; // Use the NGO placeholder or specific author images


const AdminDashBoardStories = () => {
    const navigate = useNavigate();

    // Sample data - replace with API data
    const [storiesData, setStoriesData] = useState([
        { id: 1, storyImage: storyImg1, title: 'Planting Hope: A Volunteer\'s Journey', description: 'Inspired by Enveave, volunteers came together to plant over 5,000 trees in a barren village, transforming it into a thriving green haven. Their passion proves that small actions lead to big changes.',  },
        { id: 2, storyImage: storyImg2, title: 'Planting Hope: A Volunteer\'s Journey', description: 'Inspired by Enveave, volunteers came together to plant over 5,000 trees in a barren village, transforming it into a thriving green haven. Their passion proves that small actions lead to big changes.',  },
        { id: 3, storyImage: storyImg3, title: 'Planting Hope: A Volunteer\'s Journey', description: 'Inspired by Enveave, volunteers came together to plant over 5,000 trees in a barren village, transforming it into a thriving green haven. Their passion proves that small actions lead to big changes.',  },
        { id: 4, storyImage: storyImg4, title: 'Planting Hope: A Volunteer\'s Journey', description: 'Inspired by Enveave, volunteers came together to plant over 5,000 trees in a barren village, transforming it into a thriving green haven. Their passion proves that small actions lead to big changes.',  },
        { id: 5, storyImage: storyImg5, title: 'Planting Hope: A Volunteer\'s Journey', description: 'Inspired by Enveave, volunteers came together to plant over 5,000 trees in a barren village, transforming it into a thriving green haven. Their passion proves that small actions lead to big changes.', },
        { id: 6, storyImage: storyImg6, title: 'Planting Hope: A Volunteer\'s Journey', description: 'Inspired by Enveave, volunteers came together to plant over 5,000 trees in a barren village, transforming it into a thriving green haven. Their passion proves that small actions lead to big changes.',  },
    ]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleAddStory = () => {
        console.log('Navigate to Add Story page');
        // navigate('/admin/stories/add'); // Example navigation
        alert('Navigate to Add Story page.');
    };

    const handleDeleteStory = (storyId) => {
        console.log('Parent received delete request for story ID:', storyId);
        // ** Implement actual deletion logic here **
        // 1. Call your API to delete the story on the backend.
        // 2. If successful, update the local state:
        setStoriesData(prevStories => prevStories.filter(story => story.id !== storyId));
        // Optional: Show a success notification
        alert(`Story ${storyId} deleted (simulated).`);
    };

    return (
        <div className="admin-dashboard-stories-page">
            <Header/>
            <div className='admin-dashboard-stories-container'>
                <div className="admin-dashboard-stories-back-button-container">
                    <button
                        onClick={handleGoBack}
                        className="admin-dashboard-stories-back-button"
                        aria-label="Go back to previous page"
                    >
                        <FaArrowLeft/>
                        <span>Back</span>
                    </button>
                </div>

                <div className="admin-dashboard-stories-header">
                    <h1 className="admin-dashboard-stories-title">Stories Management</h1>
                    <div className="admin-dashboard-stories-controls">
                        <button
                            onClick={handleAddStory}
                            className="admin-dashboard-stories-button admin-dashboard-stories-button-add"
                        >
                            <FaPlus/> Add Story
                        </button>
                    </div>
                </div>

                {/* Grid for Story Cards */}
                <div className="admin-dashboard-stories-grid">
                    {storiesData.length > 0 ? (
                        storiesData.map(story => (
                            <AdminDashboardStoryCardComponent
                                key={story.id}
                                story={story}
                                // Pass the delete handler function as a prop
                                onDelete={handleDeleteStory}
                            />
                        ))
                    ) : (
                        <p className="admin-dashboard-stories-no-data">No stories found.</p>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminDashBoardStories;