import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // React Router hooks for routing and linking
import axios from 'axios'; // Library for making HTTP requests
import { formatDistanceToNow, parseISO, startOfDay, isAfter } from 'date-fns'; // Functions for date formatting and comparison
import Header from "../components/main components/Header.jsx"; // Import Header component
import Footer from "../components/main components/Footer.jsx"; // Import Footer component
import { useAuth } from '../redux/hooks/useAuth.js'; // Import useAuth hook for user type checking
import { useApplications } from '../redux/hooks/useApplications.js'; // Import useApplications hook for registration function
// Correct the CSS import path if needed based on your project structure
import '../stylesheet/Individual-opporunity.css'; // Ensure this CSS file exists and is correctly named/pathed

// --- Helper Functions ---

/**
 * Formats a date string into a human-readable format (e.g., "15 Jul 2024").
 * Handles potential ISO strings and invalid dates.
 * @param {string|null} dateString - The date string to format (preferably ISO 8601).
 * @returns {string} - Formatted date string or 'N/A' or 'Invalid Date'.
 */
const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A'; // Return 'N/A' if no date string is provided
    try {
        // Use parseISO to correctly handle ISO 8601 formatted strings, including timezones.
        const date = parseISO(dateString);
        // Format the date to 'DD Mon YYYY' format using British English locale.
        // Adjust locale ('en-US') if mm/dd/yyyy is preferred.
        return date.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Invalid Date'; // Return 'Invalid Date' if parsing/formatting fails
    }
};

/**
 * Calculates and formats the time remaining until a deadline.
 * Returns "Closed" if the deadline day has passed.
 * @param {string|null} dateString - The deadline date string (preferably ISO 8601).
 * @returns {string|null} - Formatted string like "Closes in X days" or "Closed", or null if no date.
 */
const formatClosesIn = (dateString) => {
    if (!dateString) return null; // Return null if no date string provided
    try {
        const deadlineDate = parseISO(dateString); // Parse the ISO date string
        const now = new Date(); // Get the current date and time

        // Check if the current day has started *after* the deadline day has started.
        // This means if the deadline is today, it's not considered 'Closed' yet.
        // It will only be 'Closed' starting the day *after* the deadline.
        if (isAfter(startOfDay(now), startOfDay(deadlineDate))) {
            return "Closed"; // Deadline day has passed
        }

        // Calculate the distance to the deadline from now.
        // addSuffix: false prevents adding "ago" or "in". We add "Closes in" manually.
        const distance = formatDistanceToNow(deadlineDate, { addSuffix: false });
        return `Closes in ${distance}`; // Return the formatted remaining time
    } catch (e) {
        console.error("Error calculating distance to deadline:", dateString, e);
        return "Error calculating deadline"; // Return an error message if calculation fails
    }
};

// --- React Component ---

const IndividualOpportunity = () => {
    // Get the 'id' parameter from the URL using React Router's useParams hook
    const { id } = useParams();    // State to hold the fetched opportunity data
    const [opportunity, setOpportunity] = useState(null);
    // State to manage the loading status
    const [loading, setLoading] = useState(true);
    // State for registration loading
    const [registering, setRegistering] = useState(false);
    // State to store any error messages during fetching
    const [error, setError] = useState(null);
    // State to store registration errors/messages
    const [registrationMessage, setRegistrationMessage] = useState(null);
    // State to track if the volunteer has already applied
    const [hasApplied, setHasApplied] = useState(false);
    // Get the API base URL from environment variables (Vite specific)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    // Get auth state including user type using custom hook
    const { isAuthenticated, isVolunteer } = useAuth();
    // Get applications hook for registration function
    const { registerForOpportunity, getUserApplications } = useApplications();
    // Navigation hook for redirecting after registration
    const navigate = useNavigate();

    // useEffect hook to fetch opportunity details when the component mounts or 'id'/'apiBaseUrl' changes
    useEffect(() => {
        const fetchOpportunityDetails = async () => {
            setLoading(true); // Set loading state to true before fetching
            setError(null); // Clear any previous errors
            try {
                // Make GET request to the API endpoint for the specific opportunity ID
                const response = await axios.get(`${apiBaseUrl}/opportunities/${id}`);
                setOpportunity(response.data); // Store the fetched data in state
                console.log("Fetched Opportunity Data:", response.data); // Log the response for debugging
            } catch (err) {
                console.error("Failed to fetch opportunity:", err); // Log the error details
                let errorMessage = 'Failed to load opportunity details.'; // Default error message

                // --- Axios specific error handling ---
                if (err.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error("Error Response Status:", err.response.status);
                    console.error("Error Response Data:", err.response.data);
                    if (err.response.status === 404) {
                        errorMessage = 'Opportunity not found.'; // Specific message for 404
                    } else {
                        // Use server's error message if available, otherwise use Axios error message
                        errorMessage = `Error: ${err.response.status} - ${err.response.data?.message || err.message}`;
                    }
                } else if (err.request) {
                    // The request was made but no response was received
                    errorMessage = 'No response from server. Please check your network connection.';
                    console.error("Error Request:", err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    errorMessage = err.message;
                }
                setError(errorMessage); // Set the error state with the detailed message
            } finally {
                setLoading(false); // Set loading state to false after fetching (success or failure)
            }
        };

        // Only fetch if an 'id' is present
        if (id) {
            fetchOpportunityDetails();
        } else {
            setError("No Opportunity ID provided in the URL."); // Set error if no ID
            setLoading(false); // Stop loading
        }
    }, [id, apiBaseUrl]); // Dependencies: re-run effect if 'id' or 'apiBaseUrl' changes
      // Check if the volunteer has already applied for this opportunity
    useEffect(() => {
        const checkApplicationStatus = async () => {
            // Only check if user is authenticated and is a volunteer
            if (isAuthenticated && isVolunteer && id) {
                try {
                    // Fetch the volunteer's applications
                    const applications = await getUserApplications();
                    
                    // Check if any application matches the current opportunity ID
                    const alreadyApplied = applications.some(
                        app => app.opportunity && app.opportunity._id === id
                    );
                    
                    setHasApplied(alreadyApplied);
                } catch (error) {
                    console.error("Error checking application status:", error);
                    // Default to not applied if there's an error
                    setHasApplied(false);
                }
            }
        };
        
        checkApplicationStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isAuthenticated, isVolunteer]);
    
    // --- Handle Registration Button Click ---
    // Actual function to register for an opportunity
    const handleRegisterClick = async (e) => {
        e.preventDefault();
        
        // Clear any previous registration messages
        setRegistrationMessage(null);
        
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { redirectTo: `/opportunity/${id}` } });
            return;
        }
        
        if (!isVolunteer) {
            setRegistrationMessage({ 
                type: 'error', 
                text: 'Only volunteers can register for opportunities' 
            });
            return;
        }
        
        try {
            // Set registering state to true to show loading indicator
            setRegistering(true);
            
            // Call the registerForOpportunity function from our hook
            const response = await registerForOpportunity(id);
            
            // Show success message
            setRegistrationMessage({ 
                type: 'success', 
                text: 'Successfully registered for this opportunity!' 
            });
            
            // Wait 1.5 seconds and then redirect to the user's applications page
            setTimeout(() => {
                navigate('/volunteer/dashboard');
            }, 1500);
            
        } catch (error) {
            console.error("Registration error:", error);
            
            // Extract the error message and code
            const errorMessage = error.response?.data?.message || 'Failed to register for opportunity';
            const errorCode = error.response?.data?.code;
            
            // Handle different error types with appropriate messages
            if (errorCode === 'PROFILE_INCOMPLETE') {
                setRegistrationMessage({ 
                    type: 'error', 
                    text: errorMessage,
                    actionText: 'Complete Profile',
                    actionPath: '/profile-completion'
                });
            } else if (errorCode === 'ALREADY_REGISTERED') {
                setRegistrationMessage({ 
                    type: 'error', 
                    text: errorMessage,
                    actionText: 'View Applications',
                    actionPath: '/volunteer/dashboard'
                });
            } else {
                setRegistrationMessage({ 
                    type: 'error', 
                    text: errorMessage 
                });
            }
        } finally {
            setRegistering(false);
        }
    };

    // --- Conditional Rendering for Loading State ---
    if (loading) {
        return (
            <>
                <Header />
                <div className="individual-opportunity-loading">Loading opportunity details...</div>
                <Footer />
            </>
        );
    }

    // --- Conditional Rendering for Error State ---
    if (error) {
        return (
            <>
                <Header />
                <div className="individual-opportunity-error">
                    <h2>Error Loading Opportunity</h2>
                    <p>{error}</p>
                    {/* Link back to the main opportunities list */}
                    <Link to="/opportunities">← Back to Opportunities</Link>
                </div>
                <Footer />
            </>
        );
    }

    // --- Conditional Rendering if Opportunity Data is Missing (after loading and no error) ---
    if (!opportunity) {
        return (
            <>
                <Header />
                <div className="individual-opportunity-error">
                    <h2>Opportunity Data Unavailable</h2>
                    <p>Could not load the details for this opportunity, or the data is invalid.</p>
                    <Link to="/opportunities">← Back to Opportunities</Link>
                </div>
                <Footer />
            </>
        );
    }

    // --- Data Destructuring and Preparation ---
    // Destructure nested properties from the opportunity object for easier access
    // Use optional chaining (?.) and nullish coalescing (??) for safety if properties might be missing
    const {
        basicDetails = {}, // Default to empty object if missing
        schedule = {},
        evaluation = {},
        additionalInfo = {}, // Keep even if unused for potential future use
        provider = { organizationDetails: {} }, // Ensure provider and organizationDetails exist
        authOpportunityProvider = {} // Default to empty object if missing
    } = opportunity;

    // Define a fallback image URL
    const defaultImage = '/individual-opp-page-default.png'; // Path relative to the 'public' folder usually

    // Determine the organization name, using fallback
    const organizationName = authOpportunityProvider?.organizationName || provider?.organizationDetails?.name || 'The Organization';
    // Determine the image URL, using multiple fallbacks
    const imageUrl = basicDetails?.photo || provider?.organizationDetails?.logo || defaultImage;

    // Calculate if the opportunity application deadline has passed using the same logic as formatClosesIn
    let isClosed = false;
    if (schedule.applicationDeadline) {
        try {
            const deadlineDate = parseISO(schedule.applicationDeadline);
            const now = new Date();
            // Opportunity is closed if the current day starts *after* the deadline day starts
            isClosed = isAfter(startOfDay(now), startOfDay(deadlineDate));
        } catch (e) {
            console.error("Error parsing deadline for isClosed check:", schedule.applicationDeadline, e);
            // Decide how to handle invalid deadline for status - maybe default to closed or show error?
            // For now, let's assume not closed if date is invalid
        }
    } else {
        // If no deadline, maybe it's always open? Or should be treated as closed/invalid?
        // Let's assume it's not 'closed' in the typical sense if no deadline is specified.
        isClosed = false;
    }

    // Get the "Closes in X days" or "Closed" text
    const closesInText = formatClosesIn(schedule?.applicationDeadline);

    // Determine the compensation text based on isPaid and compensation value
    const compensationText = basicDetails?.isPaid
        ? `₹${basicDetails?.compensation ?? 'N/A'}` // If paid, show amount or N/A
        : (basicDetails?.compensation === 0 ? 'Unpaid' : 'N/A'); // If not paid, check if explicitly 0 (Unpaid) or N/A

    // --- Component JSX ---
    return (
        <>
            {/* Render the Header */}
            <Header />
            {/* Main container for the individual opportunity page */}
            <div className="individual-opportunity-main-container">

                {/* Top section containing title, status, basic details */}
                <div className="individual-opportunity-top-container">
                    {/* Title bar with organization name and active/closed status */}                <div className="individual-opportunity-top-title-bar">
                        <h1>{basicDetails?.title || 'Opportunity Details'}</h1>
                        {/* Status indicator (Green=Active, Red=Closed) */}
                        <div className="individual-opportunity-top-title-toggle">
                            {isClosed ? (
                                // Red circle SVG for 'Closed'
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <ellipse cx="10.5" cy="10" rx="10.5" ry="10" fill="#FF0606" />
                                </svg>
                            ) : (
                                // Green circle SVG for 'Active'
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <ellipse cx="10.5" cy="10" rx="10.5" ry="10" fill="#52C735" />
                                </svg>
                            )}
                            {/* Display "Active" or "Closed" text based on the isClosed flag */}
                            <span>{isClosed ? 'Closed' : 'Active'}</span>
                        </div>
                    </div>

                    {/* Sub-title bar with tags and deadline information */}
                    <div className="individual-opportunity-sub-title-bar">
                        {/* Container for category tags */}
                        <div className="individual-opportunity-tags-container">
                            {basicDetails?.category?.map((category, index) => (
                                <div key={index} className="individual-opportunity-tags">{category.name}</div>
                            ))}
                        </div>
                        {/* Display "Closes in..." or "Closed" text if available */}
                        {closesInText && closesInText !== "Closed" && ( // Only show "Closes in..." if it's not already closed
                            <p className="individual-opportunity-closes-in">{closesInText}</p>
                        )}
                    </div>

                    {/* Section with image and key details */}
                    <div className="individual-opportunity-basic-section">
                        {/* Opportunity or Organization Image */}
                        <img src={imageUrl} alt={`${organizationName} opportunity`}
                             className="individual-opportunity-image"
                             onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }} // Fallback if image fails to load
                        />
                        {/* Container for textual details */}
                        <div className="individual-opportunity-basic-section-details">
                            {/* Upper part with icon-based details */}
                            <div className="individual-opportunity-basic-section-upper">
                                <span className="individual-opportunity-basic-icons-details">
                                    <img src='/individual-opp-org-icon.svg' alt="organization icon" />
                                    <p>{organizationName}</p>
                                </span>
                                <span className="individual-opportunity-basic-icons-details">
                                    <img src='/individual-opp-calender-icon.svg' alt="calendar icon" />
                                    {/* Format start and end dates */}
                                    <p>{formatDateDisplay(schedule?.startDate)} - {formatDateDisplay(schedule?.endDate)}</p>
                                </span>
                                <span className="individual-opportunity-basic-icons-details">
                                    <img src='/individual-opp-location-icon.svg' alt="location icon" />
                                    <p>{schedule?.location ?? 'N/A'}</p>
                                </span>
                            </div>
                            {/* Lower part with specific details */}
                            <div className="individual-opportunity-basic-section-bottom">
                                <span className="individual-opportunity-basic-lower-details">
                                    <h5>Openings:</h5>
                                    <p>{basicDetails?.volunteersRequired ?? 'N/A'}</p>
                                </span>
                                <span className="individual-opportunity-basic-lower-details">
                                    <h5>Compensation:</h5>
                                    <p>{compensationText}</p>
                                </span>
                                <span className="individual-opportunity-basic-lower-details">
                                    <h5>Application Deadline:</h5>
                                    {/* Format application deadline date */}
                                    <p>{formatDateDisplay(schedule?.applicationDeadline)}</p>
                                </span>                            </div>                            {/* Registration Message/Alert */}
                            {registrationMessage && (
                                <div className={`individual-opportunity-message ${registrationMessage.type}`}>
                                    <p>{registrationMessage.text}</p>
                                    {registrationMessage.actionText && registrationMessage.actionPath && (
                                        <Link to={registrationMessage.actionPath} className="message-action-link">
                                            {registrationMessage.actionText}
                                        </Link>
                                    )}
                                </div>
                            )}
                              {/* Registration Button - only show for volunteers and conditionally disable if closed */}
                            {isAuthenticated && isVolunteer && (
                                hasApplied ? (
                                    <button 
                                        className="individual-opportunity-apply-button already-registered"
                                        disabled
                                    >
                                        Already Registered
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleRegisterClick} 
                                        className={`individual-opportunity-apply-button ${isClosed || registering ? 'disabled' : ''}`}
                                        disabled={isClosed || registering}
                                    >
                                        {isClosed ? 'Registration Closed' : 
                                         registering ? 'Registering...' : 'Register Now →'}
                                    </button>
                                )
                            )}
                            
                            {/* Login prompt for non-authenticated users */}
                            {!isAuthenticated && !isClosed && (
                                <div className="individual-opportunity-login-prompt">
                                    <Link to={`/login?redirect=/opportunity/${id}`} className="individual-opportunity-login-link">
                                        Login
                                    </Link> or <Link to="/register/volunteer" className="individual-opportunity-register-link">
                                        Create an account
                                    </Link> to register for this opportunity
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Point of Contact (POC) Details Section */}
                {schedule?.contactPerson && ( // Only render if contact person details exist
                    <div className="individual-opportunity-POC-section">
                        <h1>POC Contact Detail</h1>
                        <span className="individual-opportunity-POC-content">
                            <h4>Name:</h4>
                            <p>{schedule.contactPerson.name ?? 'N/A'}</p>
                        </span>
                        <span className="individual-opportunity-POC-content">
                            <h4>Email:</h4>
                            <p>{schedule.contactPerson.email ?? 'N/A'}</p>
                        </span>
                        {/* Add Phone if available:
                         schedule.contactPerson.phone && (
                           <span className="individual-opportunity-POC-content">
                               <h4>Phone:</h4>
                               <p>{schedule.contactPerson.phone}</p>
                           </span>
                         )*/}
                    </div>
                )}


                {/* Bottom section with detailed descriptions */}
                <div className="individual-opportunity-bottom-container">
                    {/* About the Opportunity */}
                    <div className="individual-opportunity-bottom-sub-containers">
                        <h1>About Opportunity</h1>
                        {/* Display opportunity description using dangerouslySetInnerHTML if it contains HTML, otherwise just render */}
                        {/* Be cautious with dangerouslySetInnerHTML if the source isn't trusted */}
                        <p>{basicDetails?.description ?? 'No description provided.'}</p>

                        {/* Support Provided section */}
                        <span className="individual-opportunity-bullet-content">
                            <h4>Support Provided:</h4>
                            {evaluation?.support?.length > 0 ? (
                                <ul>
                                    {evaluation.support.map((item, index) => (
                                        // Display custom support text if name is "Other", otherwise display name
                                        <li key={index}>{item.name === "Other" && item.customSupport ? item.customSupport : item.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No specific support details provided.</p> // Message if no support listed
                            )}
                        </span>
                    </div>

                    {/* Milestones Section - Render only if milestones exist */}
                    {evaluation?.hasMilestones && evaluation?.milestones?.length > 0 && (
                        <div className="individual-opportunity-bottom-sub-containers">
                            <h1>Milestones</h1>
                            <ul>
                                {evaluation.milestones.map((milestone) => (
                                    <li key={milestone._id ?? milestone.question}>{milestone.question}</li> // Use _id or question as key
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Optional: Show message if hasMilestones is true but array is empty */}
                    {evaluation?.hasMilestones && evaluation?.milestones?.length === 0 && (
                        <div className="individual-opportunity-bottom-sub-containers">
                            <h1>Milestones</h1>
                            <p>Milestones are expected but none are listed currently.</p>
                        </div>
                    )}


                    {/* About the Organization */}
                    {provider?.organizationDetails?.description && ( // Only render if description exists
                        <div className="individual-opportunity-bottom-sub-containers">
                            <h1>About Organization</h1>
                            <p>{provider.organizationDetails.description}</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Render the Footer */}
            <Footer />
        </>
    );
};

export default IndividualOpportunity;