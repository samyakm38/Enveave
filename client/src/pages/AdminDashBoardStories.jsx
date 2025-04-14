import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaPlus } from 'react-icons/fa';
import useAdmin from '../redux/hooks/useAdmin';
import AdminDashboardStoryCardComponent from "../components/Dashboard/Admin-DashBoard/AdminDashboardStoryCardComponent.jsx";
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import '../stylesheet/AdminDashBoardStories.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AdminDashBoardStories = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [newStory, setNewStory] = useState({
        title: '',
        content: '',
        imageUrl: '/home-story-3.png' // Default image
    });
    const [showStoryForm, setShowStoryForm] = useState(false);
    
    const { 
        stories, 
        storiesLoading, 
        storiesError, 
        storiesPagination, 
        loadStories, 
        deleteStory,
        createStory,
        createLoading
    } = useAdmin();
    console.log(stories)
    useEffect(() => {
        // Load stories when component mounts or page changes
        loadStories(currentPage);
    }, [loadStories, currentPage]);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    const handleDeleteStory = (id, title) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete the story "${title}"? This action cannot be undone.`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        await deleteStory(id);
                        // Reload stories to reflect the changes
                        loadStories(currentPage);
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStory(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmitStory = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!newStory.title || !newStory.content) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create the story
        const result = await createStory(newStory);
        
        if (result.success) {
            // Reset form and hide it
            setNewStory({
                title: '',
                content: '',
                imageUrl: '/home-story-3.png'
            });
            setShowStoryForm(false);
            
            // Reload stories to show the new one
            loadStories(1);
        }
    };
      return (
        <div className="admin-dashboard-stories-page">
            <Header />
            <div className="admin-dashboard-stories-container">
                <div className="admin-dashboard-stories-back-button-container">
                    <button 
                        className="admin-dashboard-stories-back-button"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        <FaArrowLeft /> <span>Back</span>
                    </button>
                </div>
                
                <div className="admin-dashboard-stories-header">
                    <h1 className="admin-dashboard-stories-title">Stories Management</h1>
                    <div className="admin-dashboard-stories-controls">
                        <button 
                            className="admin-dashboard-stories-button admin-dashboard-stories-button-add"
                            onClick={() => setShowStoryForm(!showStoryForm)}
                        >
                            <FaPlus /> {showStoryForm ? 'Cancel' : 'Add Story'}
                        </button>
                    </div>
                </div>
                  {showStoryForm && (
                    <div className="admin-dashboard-stories-form-container">
                        <form onSubmit={handleSubmitStory}>
                            <h2>Create New Story</h2>
                            
                            <div className="admin-dashboard-stories-form-group">
                                <label htmlFor="title">Story Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newStory.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="admin-dashboard-stories-form-group">
                                <label htmlFor="content">Story Content *</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newStory.content}
                                    onChange={handleInputChange}
                                    rows={5}
                                    required
                                />
                            </div>
                            
                            <div className="admin-dashboard-stories-form-group">
                                <label htmlFor="imageUrl">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={newStory.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="Use default image if left empty"
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="admin-dashboard-stories-submit-btn"
                                disabled={createLoading}
                            >
                                {createLoading ? 'Creating...' : 'Create Story'}
                            </button>
                        </form>
                    </div>
                )}
                  {storiesLoading ? (
                    <div className="admin-dashboard-stories-loading">
                        <p>Loading stories...</p>
                    </div>
                ) : storiesError ? (
                    <div className="admin-dashboard-stories-error">
                        <p>Error: {storiesError}</p>
                        <button onClick={() => loadStories(currentPage)}>Retry</button>
                    </div>
                ) : (
                    <>
                        <div className="admin-dashboard-stories-grid">
                            {stories.length === 0 ? (
                                <div className="admin-dashboard-stories-no-data">
                                    <p>No stories found. Click "Add Story" to create one.</p>
                                </div>
                            ) : (
                                stories.map((story) => (
                                    <AdminDashboardStoryCardComponent
                                        key={story.id}
                                        story={story}
                                        onDelete={() => handleDeleteStory(story.id, story.title)}
                                    />
                                ))
                            )}
                        </div>
                        
                        {/* Pagination */}
                        {storiesPagination.pages > 1 && (
                            <div className="admin-dashboard-stories-pagination">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="admin-dashboard-stories-pagination-btn"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(storiesPagination.pages).keys()].map(page => (
                                    <button
                                        key={page + 1}
                                        className={`admin-dashboard-stories-pagination-btn ${currentPage === page + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    disabled={currentPage === storiesPagination.pages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="admin-dashboard-stories-pagination-btn"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}            </div>
            <Footer />
        </div>
    );
};

export default AdminDashBoardStories;