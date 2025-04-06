import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link might still be useful
import axios from 'axios'; // Import axios
import { formatDistanceToNow, parseISO } from 'date-fns'; // Import date-fns functions
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
// Correct the CSS import path if needed based on your project structure
import '../stylesheet/Individual-opporunity.css'; // Ensure this CSS file exists and is correctly named/pathed

// --- Helper Functions ---
const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Use parseISO to handle potential timezone issues if dates are ISO strings
        return new Date(parseISO(dateString)).toLocaleDateString('en-GB', { // Use en-GB for dd/mm/yyyy or en-US for mm/dd/yyyy
            day: 'numeric', month: 'short', year: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Invalid Date';
    }
};

const formatDateTimeDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(parseISO(dateString));
        const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        // Format time to 12-hour clock with AM/PM
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true
        });
        return `${formattedDate}, ${formattedTime}`;
    } catch (e) {
        console.error("Error formatting date/time:", dateString, e);
        return 'Invalid Date/Time';
    }
};

const formatClosesIn = (dateString) => {
    if (!dateString) return null;
    try {
        const deadline = new Date(parseISO(dateString));
        const now = new Date();
        if (deadline < now) {
            return ""; // Already past
        }
        // addSuffix: true adds "ago" or "in", we want "in"
        return `Closes in ${formatDistanceToNow(deadline, { addSuffix: false })}`;
    } catch (e) {
        console.error("Error calculating distance to deadline:", dateString, e);
        return null;
    }
};

// Placeholder Requirements (defined in frontend, matching the image's placeholder text)
const REQUIREMENTS_PLACEHOLDER = ["Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has", "galley of type and scrambled it to make a type specimen book. It has survived not only five", "popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,"];

// Placeholder Milestones Text (matching image, as schema data is different)
const MILESTONES_PLACEHOLDER = "Orientation → First Event → Final Evaluation";


const IndividualOpportunity = () => {
    const { id } = useParams();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchOpportunityDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- Use axios ---
                const response = await axios.get(`${apiBaseUrl}/opportunities/${id}`);
                setOpportunity(response.data); // Access data directly
                console.log(response)
            } catch (err) {
                console.error("Failed to fetch opportunity:", err);
                let errorMessage = 'Failed to load opportunity details.';
                // --- Axios error handling ---
                if (err.response) {
                    // Server responded with a status code outside the 2xx range
                    console.error("Error Response:", err.response);
                    if (err.response.status === 404) {
                        errorMessage = 'Opportunity not found.';
                    } else {
                        errorMessage = `Error: ${err.response.status} - ${err.response.data?.message || err.message}`;
                    }
                } else if (err.request) {
                    // Request was made but no response received
                    errorMessage = 'No response from server. Please check your connection.';
                    console.error("Error Request:", err.request);
                } else {
                    // Something else happened in setting up the request
                    errorMessage = err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOpportunityDetails();
        } else {
            setError("No Opportunity ID provided.");
            setLoading(false);
        }
    }, [id, apiBaseUrl]); // Dependency array

    // --- Updated Render Helper Functions to match image style ---
    const renderCategories = (categories) => {
        if (!categories || categories.length === 0) return null;
        // Find specific categories if needed, or just display all
        // Filter for specific tags seen in image if they exist in data, otherwise show all
        const displayCategories = categories.filter(cat => ['Field Work', 'Conservation'].includes(cat.name));
        const categoriesToRender = displayCategories.length > 0 ? displayCategories : categories; // Fallback to all if specific not found

        return categoriesToRender.map((cat, index) => (
            <span key={index} className="individual-opportunity-tag">
                {cat.name === 'Other' ? cat.customCategory : cat.name}
            </span>
        ));
    };

    // Render support as comma-separated string
    const renderSupportAsString = (supportItems) => {
        if (!supportItems || supportItems.length === 0) return "N/A";
        return supportItems.map(item => item.name === 'Other' ? item.customSupport : item.name).join(', ');
    };

    // --- Handle Registration Button Click ---
    const handleRegisterClick = () => {
        console.log("Register Now clicked for opportunity:", id);
        alert("Registration functionality placeholder.");
    };

    // --- Loading and Error States (remain the same) ---
    if (loading) {
        return (<>
            <Header />
            <div className="individual-opportunity-loading">Loading opportunity details...</div>
            <Footer />
        </>);
    }

    if (error) {
        return (<>
            <Header />
            <div className="individual-opportunity-error">
                <h2>Error Loading Opportunity</h2>
                <p>{error}</p>
                <Link to="/opportunities">← Back to Opportunities</Link>
            </div>
            <Footer />
        </>);
    }

    if (!opportunity) {
        return (<>
            <Header />
            <div className="individual-opportunity-error">
                <h2>Opportunity Data Unavailable</h2>
                <p>Could not load the details for this opportunity.</p>
                <Link to="/opportunities">← Back to Opportunities</Link>
            </div>
            <Footer />
        </>);
    }

    // --- Destructure and Prepare Data ---
    const {
        basicDetails, schedule, evaluation, additionalInfo, provider, authOpportunityProvider
    } = opportunity;
    const defaultImage = '/individual-opp-page-default.png'; // Define fallback

    const organizationName = authOpportunityProvider?.organizationName || 'The Organization';
    const aboutNgoText = provider?.organizationDetails?.description || `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`; // Placeholder from image
    const imageUrl = basicDetails?.photo || provider?.organizationDetails?.logo || defaultImage;
    const isClosed = schedule.applicationDeadline && new Date(parseISO(schedule.applicationDeadline)) < new Date();
    const closesInText = formatClosesIn(schedule?.applicationDeadline);
    const compensationText = basicDetails?.isPaid ? `₹${basicDetails?.compensation || 'N/A'}` : (basicDetails?.compensation === 0 ? 'unpaid' : 'NA'); // Handle different compensation cases


    return (
        <>
            <Header />
            <div className="individual-opportunity-main-container">
                <div className="individual-opportunity-top-container">
                    <div className="individual-opportunity-top-title-bar">
                        <h1>{organizationName}</h1>
                        <div className="individual-opportunity-top-title-toggle">
                            {isClosed ? <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20"
                                             fill="none">
                                <ellipse cx="10.5" cy="10" rx="10.5" ry="10" fill="#FF0606" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20"
                                          fill="none">
                                <ellipse cx="10.5" cy="10" rx="10.5" ry="10" fill="#52C735" />
                            </svg>}
                            <span>
                                {isClosed || closesInText === 'Closed' ? 'Closed' : 'Active'}
                            </span>
                        </div>
                    </div>
                    <div className="individual-opportunity-sub-title-bar">
                        <div className="individual-opportunity-tags-container">
                            {basicDetails?.category?.map((category, index) => (
                                <div key={index} className="individual-opportunity-tags">{category.name}</div>))}
                        </div>
                        {closesInText && (<p className="individual-opportunity-closes-in">{closesInText}</p>)}
                    </div>
                    <div className="individual-opportunity-basic-section">
                        <img src='/individual-opp-page-default.png' alt='opportunity-image'
                             className="individual-opportunity-image" />
                        <div className="individual-opportunity-basic-section-details">
                            <div className="individual-opportunity-basic-section-upper">
                                <span className="individual-opportunity-basic-icons-details">
                                    <img src='/individual-opp-org-icon.svg' alt="icon" />
                                    <p>{organizationName}</p>
                                </span>
                                <span className="individual-opportunity-basic-icons-details">
                                    <img src='/individual-opp-calender-icon.svg' alt="icon" />
                                    <p>{schedule?.startDate ? formatDateDisplay(schedule.startDate) : 'N/A'} - {schedule?.endDate ? formatDateDisplay(schedule.endDate) : 'N/A'}</p>
                                </span>
                                <span className="individual-opportunity-basic-icons-details">
                                    <img src='/individual-opp-location-icon.svg' alt="icon" />
                                    <p>{schedule?.location}</p>
                                </span>
                            </div>
                            <div className="individual-opportunity-basic-section-bottom">
                                <span className="individual-opportunity-basic-lower-details">
                                    <h5>Openings:</h5>
                                    <p>{basicDetails?.volunteersRequired}</p>
                                </span>
                                <span className="individual-opportunity-basic-lower-details">
                                    <h5>Compensation:</h5>
                                    <p>{compensationText}</p>
                                </span>
                                <span className="individual-opportunity-basic-lower-details">
                                    <h5>Application Deadline:</h5>
                                    <p>{schedule?.applicationDeadline ? formatDateDisplay(schedule.applicationDeadline) : 'N/A'}</p>
                                </span>
                            </div>
                            <Link to="/">
                                <div className="individual-opportunity-apply-button">Register Now →</div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="individual-opportunity-POC-section">
                    <h1>POC Contact Detail</h1>
                    <span className="individual-opportunity-POC-content">
                        <h4>Name:</h4>
                        <p>{schedule?.contactPerson?.name}</p>
                    </span>
                    <span className="individual-opportunity-POC-content">
                        <h4>Email:</h4>
                        <p>{schedule?.contactPerson?.email}</p>
                    </span>
                </div>
                <div className="individual-opportunity-bottom-container">
                    <div className="individual-opportunity-bottom-sub-containers">
                        <h1>About Opportunity</h1>
                        <p>{basicDetails.description}</p>
                        <span className="individual-opportunity-bullet-content">
                            <h4>Support Provided:</h4>
                            <ul>
                                {evaluation?.support?.length > 0 ? evaluation.support.map((item, index) => (
                                    <li key={index}>{item.name === "Other" ? item.customSupport : item.name}</li>
                                )) : <li>No support provided</li>}
                            </ul>
                        </span>
                    </div>

                    {evaluation?.hasMilestones && (
                        <div className="individual-opportunity-bottom-sub-containers">
                            <h1>Milestones</h1>
                            {evaluation.milestones?.length > 0 ? (
                                <ul>
                                    {evaluation.milestones.map((milestone) => (
                                        <li key={milestone._id}>{milestone.question}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No milestones specified</p>
                            )}
                        </div>
                    )}

                    <div className="individual-opportunity-bottom-sub-containers">
                        <h1>About Organization</h1>
                        <p>{provider.organizationDetails.description}</p>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default IndividualOpportunity;
