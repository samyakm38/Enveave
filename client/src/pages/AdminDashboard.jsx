import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import '../stylesheet/AdminDashBoard.css'

// Placeholder SVGs - Replace with your actual SVGs or an icon library
const OrganizationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    </svg>
);

const VolunteerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
        <path d="M16.5 12c1.38 0 2.5-1.12 2.5-2.5S17.88 7 16.5 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 3-1.34 3-3S10.66 5 9 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V18h11v-1.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V18h7v-1.5c0-.83.33-2.34 2.37-3.41C10.5 13.1 9.66 13 9 13z"/>
    </svg>
);

// OpportunityIcon Component (using Seedling)
const OpportunityIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="50" // You can keep these or control size via CSS
        height="50" // You can keep these or control size via CSS
        fill="#FFFFFF" // Explicitly set the fill color to white
    >
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
    </svg>
);




const AdminDashboard=() => {
    return (
        <>
            <Header/>
            <div className='admin-dashboard-main-container'>

                <Link to="/admin/dashboard/organizations" className="admin-dashboard-box">
                    <OrganizationIcon/>
                    <span>organization</span>
                </Link>

                <Link to="/admin/dashboard/volunteers" className="admin-dashboard-box">
                    <VolunteerIcon/>
                    <span>volunteer</span>
                </Link>

                <Link to="/admin/dashboard/opportunities" className="admin-dashboard-box">
                    {/*<img src='/admin-dashboard-opp.svg' alt='story icon'*/}
                    {/*     style={{width: '35%', marginBottom: '1.5rem'}}/>*/}
                    <OpportunityIcon/>
                    <span>opportunity</span>
                </Link>

                <Link to="/admin/dashboard/stories" className="admin-dashboard-box">
                    <img src='/admin-dashboard-story-icon.svg' alt='story icon' style={{ width: '35%', marginBottom: '1.5rem' }} />
                    <span>stories</span>
                </Link>

            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard;