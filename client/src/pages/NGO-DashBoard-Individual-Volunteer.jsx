import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import '../stylesheet/NGO-DashBoard-Individual-Volunteer.css';
import { useProviderVolunteer } from '../redux/hooks/useProviderVolunteer';
import { PageLoader } from '../components/ui/LoaderComponents.jsx';

const NgoDashBoardIndividualVolunteer = () => {
    const { id } = useParams(); // Get volunteer ID from URL params
    const { getVolunteerById, volunteer, loading, error } = useProviderVolunteer();
    const [volunteerData, setVolunteerData] = useState({
        name: "",
        imageUrl: "https://via.placeholder.com/80/90EE90/FFFFFF?text=V", // Default placeholder
        about: {
            name: "",
            phone: "",
            email: "",
            gender: "",
            dob: "",
            address: "",
            state: "",
            city: "",
            pincode: "",
        },    skills: [],
    interests: {
        causes: [],
        skills: []
    }
    });    // Fetch volunteer data when component mounts
    useEffect(() => {
        const fetchVolunteerData = async () => {
            if (id) {
                const data = await getVolunteerById(id);
                if (data) {
                    // Format the data for display
                    const formattedData = {
                        name: data.name || "Unknown Volunteer",
                        imageUrl: data.profilePhoto || "https://via.placeholder.com/80/90EE90/FFFFFF?text=V",
                        about: {
                            name: data.name || "Unknown",
                            phone: data.basicDetails?.phoneNumber || "Not provided",
                            email: data.email || "Not provided",
                            gender: data.basicDetails?.gender || "Not specified",
                            dob: data.basicDetails?.dateOfBirth 
                                ? new Date(data.basicDetails.dateOfBirth).toLocaleDateString() 
                                : "Not provided",
                            address: data.basicDetails?.location?.address || "Not provided",
                            state: data.basicDetails?.location?.state || "Not provided",
                            city: data.basicDetails?.location?.city || "Not provided",
                            pincode: data.basicDetails?.location?.pincode || "Not provided"
                        },
                        skills: data.skills || [],
                        interests: {
                            causes: data.interests?.causes || [],
                            skills: data.interests?.skills || []
                        }
                    };
                    setVolunteerData(formattedData);
                }
            }
        };

        fetchVolunteerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Remove getVolunteerById from dependencies

    // Show loading state
    if (loading) {
        return (
            <>
                <Header />
                <div className="ngo-dashboard-individual-volunteer-loading">
                    <PageLoader />
                    <p>Loading volunteer details...</p>
                </div>
                <Footer />
            </>
        );
    }

    // Show error state
    if (error) {
        return (
            <>
                <Header />
                <div className="ngo-dashboard-individual-volunteer-error">
                    <h2>Error Loading Volunteer</h2>
                    <p>{error}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="ngo-dashboard-individual-volunteer-container">
                {/* Back Button */}
                {/*<div className="ngo-dashboard-individual-volunteer-back-link">*/}
                {/*    <Link to='/'>← Back</Link> /!* Use React Router Link in a real app *!/*/}
                {/*</div>*/}

                {/* Profile Header */}
                <div className="ngo-dashboard-individual-volunteer-profile-header">
                    <img
                        src={volunteerData.imageUrl}
                        alt={volunteerData.name}
                        className="ngo-dashboard-individual-volunteer-profile-img"
                    />
                    <div className="ngo-dashboard-individual-volunteer-profile-info">
                        <h1 className="ngo-dashboard-individual-volunteer-name">{volunteerData.name}</h1>
                    </div>
                </div>

                {/* About Section */}
                <div className="ngo-dashboard-individual-volunteer-section ngo-dashboard-individual-volunteer-about-section">
                    <h2 className="ngo-dashboard-individual-volunteer-section-title">About</h2>
                    <div className="ngo-dashboard-individual-volunteer-about-grid">
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Name</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.name}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Address</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.address}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Phone number</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.phone}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">State</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.state}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Email ID</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.email}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">City</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.city}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Gender</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.gender}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Pincode</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.pincode}</span>
                        </div>
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">DOB</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.dob}</span>
                        </div>
                        {/* <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Status</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.status}</span>
                        </div> */}
                    </div>
                </div>                {/* Skills Section */}
                <div className="ngo-dashboard-individual-volunteer-section ngo-dashboard-individual-volunteer-skills-section">
                    <h2 className="ngo-dashboard-individual-volunteer-section-title">Skills</h2>
                    <div className="ngo-dashboard-individual-volunteer-tags-container">
                        {volunteerData.interests.skills.map((skill, index) => (
                            <span key={index} className="ngo-dashboard-individual-volunteer-tag">
                                {skill}
                            </span>
                        ))}
                        {volunteerData.interests.skills.length === 0 && (
                            <span className="ngo-dashboard-individual-volunteer-no-data">No skills specified</span>
                        )}
                    </div>
                </div>                {/* Interests Section */}
                <div className="ngo-dashboard-individual-volunteer-section ngo-dashboard-individual-volunteer-interests-section">
                    <h2 className="ngo-dashboard-individual-volunteer-section-title">Interests</h2>
                    <div className="ngo-dashboard-individual-volunteer-tags-container">
                        {volunteerData.interests.causes.map((cause, index) => (
                            <span key={index} className="ngo-dashboard-individual-volunteer-tag">
                                {cause}
                            </span>
                        ))}
                        {volunteerData.interests.causes.length === 0 && (
                            <span className="ngo-dashboard-individual-volunteer-no-data">No interests specified</span>
                        )}
                    </div>
                </div>

            </div>

            <Footer />
        </>
    );
};

export default NgoDashBoardIndividualVolunteer;

