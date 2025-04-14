import React, { useState, useEffect, useRef } from 'react'; // Import hooks
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // For View Story navigation
import { FaEllipsisH } from 'react-icons/fa';
import './stylesheet/AdminDashboardStoryCardComponent.css';

// Component receives onDelete prop from parent
const AdminDashboardStoryCardComponent = ({ story, onDelete }) => {
    const { id, storyImage, title, description } = story;
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref for the dropdown menu
    const buttonRef = useRef(null); // Ref for the ellipsis button

    // Toggle menu visibility
    const toggleMenu = (event) => {
        event.stopPropagation(); // Prevent triggering click outside listener
        setIsMenuOpen(!isMenuOpen);
    };

    // --- Dropdown Action Handlers ---
    const handleViewStory = (event) => {
        event.stopPropagation();
        console.log(`View story ID: ${id}`);
        // Example navigation (adjust path as needed)
        navigate(`/stories/${id}`);
        setIsMenuOpen(false); // Close menu after action
    };

    const handleDeleteStory = (event) => {
        event.stopPropagation();
        console.log(`Attempting delete story ID: ${id}`);
        // Call the onDelete function passed from the parent
        onDelete(id);
        setIsMenuOpen(false); // Close menu after action
    };

    // --- Click Outside Handler ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close if clicked outside the menu and not on the button itself
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        // Add listener if menu is open
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup listener on component unmount or when menu closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]); // Re-run effect when isMenuOpen changes

    return (
        <div className="admin-dashboard-story-card-component">
            <div className="admin-dashboard-story-card-component-image-wrapper">
                <img
                    src={storyImage}
                    alt={title}
                    className="admin-dashboard-story-card-component-image"
                    loading="lazy"
                />
                {/* Assign ref to the button */}
                <button
                    ref={buttonRef}
                    className="admin-dashboard-story-card-component-menu-button"
                    onClick={toggleMenu}
                    aria-haspopup="true" // Indicate it triggers a menu
                    aria-expanded={isMenuOpen} // Indicate if menu is open
                    aria-label={`More options for ${title}`}
                >
                    <FaEllipsisH />
                </button>

                {/* --- Dropdown Menu --- */}
                {isMenuOpen && (
                    // Assign ref to the menu container
                    <div ref={menuRef} className="admin-dashboard-story-card-dropdown">
                        <button
                            className="admin-dashboard-story-card-dropdown-item"
                            onClick={handleViewStory}
                        >
                            View Story
                        </button>
                        <button
                            className="admin-dashboard-story-card-dropdown-item admin-dashboard-story-card-dropdown-item-delete"
                            onClick={handleDeleteStory}
                        >
                            Delete
                        </button>
                    </div>
                )}
                {/* --- End Dropdown Menu --- */}
            </div>
            <div className="admin-dashboard-story-card-component-content">
                <h3 className="admin-dashboard-story-card-component-title">{title}</h3>
                <p className="admin-dashboard-story-card-component-description">{description}</p>
            </div>
        </div>
    );
};

AdminDashboardStoryCardComponent.propTypes = {
    story: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        storyImage: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired, // Add onDelete to prop types
};

export default AdminDashboardStoryCardComponent;