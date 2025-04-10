import React from 'react';
import Header from "../components/main components/Header.jsx"; // Assuming path is correct
import Footer from "../components/main components/Footer.jsx"; // Assuming path is correct
// import './NgoDashboardIndividualVolunteer.css'; // Import the CSS file
import '../stylesheet/NGO-DashBoard-Individual-Volunteer.css'
import {Link} from "react-router-dom";

// Mock data based on the image
const volunteerData = {
    name: "James Anderson",
    imageUrl: "https://via.placeholder.com/80/90EE90/FFFFFF?text=JA", // Placeholder image
    currentStatus: "Available",
    about: {
        name: "James Anderson",
        phone: "72XXXXXXXX",
        email: "xyz@gmail.com",
        gender: "Male",
        dob: "12-03-02",
        address: "56 Green Valley Apartment, MG Road",
        state: "Karnataka",
        city: "Bengaluru",
        pincode: "560001",
        status: "Available"
    },
    skills: [
        "Project Management", "First Aid", "Risk Assessment", "Emergency Response", "Crisis Management",
        "Task Coordination", "Resource Planning", "Team Leadership", "Incident Reporting", "Quick Decision-Making"
    ],
    interests: [
        "Climate Action", "Community Health", "Sustainable Development", "Habitat Restoration", "Wildlife Protection",
        "Eco-Friendly Technologies", "Energy Conservation", "Climate Resilience", "Volunteer Coordination", "Forest Conservation"
    ],
    experience: [
        {
            id: 1,
            logoUrl: "https://via.placeholder.com/40/87CEFA/FFFFFF?text=EW", // Placeholder
            organization: "Eco Warriors",
            title: "Community Recycling Drive",
            role: "Project Coordinator",
            location: "Delhi, India",
            hours: "100 Hours",
            startDate: "March 2025",
            endDate: "April 2025",
            duration: "2 months",
            description: "I managed a team of volunteers to organize and execute local recycling initiatives, where my responsibilities included overseeing logistics, coordinating volunteer schedules, and ensuring the smooth operation of the program. I led educational sessions to educate community members on waste segregation, recycling practices, and the environmental benefits of reducing waste. Additionally, I worked closely with local authorities to establish multiple collection points for recyclable materials, ensuring efficient sorting, collection, and distribution. Through these efforts, I helped foster community involvement, raised awareness about the importance of recycling, and contributed to the overall reduction of waste in the area."
        },
        {
            id: 2,
            logoUrl: "https://via.placeholder.com/40/FFD700/FFFFFF?text=SO", // Placeholder
            organization: "Save Our Species",
            title: "Wildlife Conservation Awareness Campaign",
            role: "Campaign Leader",
            location: "Ranthambore, Rajasthan",
            hours: "75 Hours",
            startDate: "June 2024",
            endDate: "July 2024",
            duration: "2 months",
            description: "As the Campaign Leader for the Wildlife Conservation Awareness Campaign, I led a team of volunteers in educating local communities about the importance of wildlife protection and conservation. I organized and facilitated educational sessions that focused on endangered species and their habitats, helping participants understand the vital role they play in maintaining ecological balance. In addition to the educational component, I assisted in the monitoring and tracking of endangered species, ensuring accurate data collection for conservation efforts. I also played a key role in developing and executing social media campaigns to raise awareness about wildlife conservation, reaching a broader audience and engaging people to take action."
        }
    ]
};


const NgoDashBoardIndividualVolunteer = () => {
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
                        <div className="ngo-dashboard-individual-volunteer-about-item">
                            <span className="ngo-dashboard-individual-volunteer-about-label">Status</span>
                            <span className="ngo-dashboard-individual-volunteer-about-value">{volunteerData.about.status}</span>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="ngo-dashboard-individual-volunteer-section ngo-dashboard-individual-volunteer-skills-section">
                    <h2 className="ngo-dashboard-individual-volunteer-section-title">Skills</h2>
                    <div className="ngo-dashboard-individual-volunteer-tags-container">
                        {volunteerData.skills.map((skill, index) => (
                            <span key={index} className="ngo-dashboard-individual-volunteer-tag">
                {skill}
              </span>
                        ))}
                    </div>
                </div>

                {/* Interests Section */}
                <div className="ngo-dashboard-individual-volunteer-section ngo-dashboard-individual-volunteer-interests-section">
                    <h2 className="ngo-dashboard-individual-volunteer-section-title">Interests</h2>
                    <div className="ngo-dashboard-individual-volunteer-tags-container">
                        {volunteerData.interests.map((interest, index) => (
                            <span key={index} className="ngo-dashboard-individual-volunteer-tag">
                {interest}
              </span>
                        ))}
                    </div>
                </div>

                {/* Experience Section */}
                {/*<div className="ngo-dashboard-individual-volunteer-section ngo-dashboard-individual-volunteer-experience-section">*/}
                {/*    <h2 className="ngo-dashboard-individual-volunteer-section-title">Experience</h2>*/}
                {/*    <div className="ngo-dashboard-individual-volunteer-experience-list">*/}
                {/*        {volunteerData.experience.map((exp) => (*/}
                {/*            <div key={exp.id} className="ngo-dashboard-individual-volunteer-experience-item">*/}
                {/*                <div className="ngo-dashboard-individual-volunteer-experience-header">*/}
                {/*                    <img*/}
                {/*                        src={exp.logoUrl}*/}
                {/*                        alt={`${exp.organization} logo`}*/}
                {/*                        className="ngo-dashboard-individual-volunteer-experience-logo"*/}
                {/*                    />*/}
                {/*                    <div className="ngo-dashboard-individual-volunteer-experience-details">*/}
                {/*                        <h3 className="ngo-dashboard-individual-volunteer-experience-org">{exp.organization}</h3>*/}
                {/*                        <p className="ngo-dashboard-individual-volunteer-experience-title">{exp.title}</p>*/}
                {/*                        <p className="ngo-dashboard-individual-volunteer-experience-meta">*/}
                {/*                            {exp.role} · {exp.location} · {exp.hours}*/}
                {/*                        </p>*/}
                {/*                    </div>*/}
                {/*                    <div className="ngo-dashboard-individual-volunteer-experience-dates">*/}
                {/*                        <p className="ngo-dashboard-individual-volunteer-experience-date-range">*/}
                {/*                            {exp.startDate} – {exp.endDate}*/}
                {/*                        </p>*/}
                {/*                        <p className="ngo-dashboard-individual-volunteer-experience-duration">*/}
                {/*                            {exp.duration}*/}
                {/*                        </p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="ngo-dashboard-individual-volunteer-experience-description">*/}
                {/*                    {exp.description}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>

            <Footer />
        </>
    );
};

export default NgoDashBoardIndividualVolunteer;

