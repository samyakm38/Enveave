import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import AdminDashboardTableComponent from "../components/Dashboard/Admin-DashBoard/AdminDashBoardTableComponent.jsx";
// Import a suitable back icon, e.g., FaArrowLeft
import { FaTrashAlt, FaFilter, FaSort, FaArrowLeft } from 'react-icons/fa';
import '../stylesheet/AdminDashBoardOpportunity.css';

const AdminDashBoardOpportunity = () => {
    const navigate = useNavigate(); // Initialize navigate hook

    const [opportunitiesData, setOpportunitiesData] = useState([
        // ... (your data remains the same)
        { id: 1, name: 'Beach Cleanup Drive', org: 'Ocean Guardians', location: 'Mumbai, India', volunteers: 50, hours: '3 Hours', deadline: 'April 10, 2025' },
        { id: 2, name: 'Tree Plantation Campaign', org: 'Green Earth Found.', location: 'Bangalore, India', volunteers: 100, hours: '1 Day', deadline: 'May 5, 2025' },
        { id: 3, name: 'Wildlife Conservation', org: 'Save Our Species', location: 'Jaipur, India', volunteers: 30, hours: '2 Days', deadline: 'April 20, 2025' },
        { id: 4, name: 'Community Recycling', org: 'Eco Warriors', location: 'Delhi, India', volunteers: 70, hours: '4 Hours', deadline: 'March 31, 2025' },
        { id: 5, name: 'Air Pollution Awareness', org: 'Clean Air Initiative', location: 'Hyderabad, India', volunteers: 20, hours: '1 Week', deadline: 'May 25, 2025' },
        { id: 6, name: 'River Cleanup Expedition', org: 'Blue Planet Initiative', location: 'Varanasi, India', volunteers: 60, hours: '5 Hours', deadline: 'May 15, 2025' },
        { id: 7, name: 'Urban Gardening Project', org: 'Grow Green', location: 'Pune, India', volunteers: 40, hours: '3 Week', deadline: 'April 10, 2025' },
        { id: 8, name: 'Sustainable Fashion', org: 'EcoThreads', location: 'Chennai, India', volunteers: 25, hours: '2 Days', deadline: 'April 30, 2025' },
    ]);

    // --- Action Handler ---
    const handleDelete = (row) => {
        console.log('Deleting opportunity:', row.name, row.id);
        alert(`Delete action for "${row.name}" (ID: ${row.id}). Check console.`); // Placeholder
    };

    // --- Go Back Handler ---
    const handleGoBack = () => {
        navigate(-1); // Navigates to the previous entry in the history stack
    };

    // --- Column Definitions ---
    const columns = [
        { header: 'Opportunity Name', accessor: 'name' },
        { header: 'Organization', accessor: 'org' },
        { header: 'Location', accessor: 'location' },
        { header: 'Total Volunteers', accessor: 'volunteers' },
        { header: 'Hours', accessor: 'hours' },
        { header: 'Application Deadline', accessor: 'deadline' },
        {
            header: 'Action',
            accessor: 'action',
            render: (row) => (
                <button
                    onClick={() => handleDelete(row)}
                    className="admin-dashboard-table-component-action-button"
                    aria-label={`Delete ${row.name}`}
                >
                    <FaTrashAlt />
                </button>
            ),
        },
    ];

    return (
        <div className="admin-dashboard-opportunity-page">
            <Header />
            <div className='admin-dashboard-opportunity-container'>
                {/* Add the back button container */}
                <div className="admin-dashboard-opportunity-back-button-container">
                    <button
                        onClick={handleGoBack}
                        className="admin-dashboard-opportunity-back-button"
                        aria-label="Go back to previous page"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                <div className="admin-dashboard-opportunity-header">
                    <h1 className="admin-dashboard-opportunity-title">Opportunities Management</h1>
                    {/* Removed Filter/Sort buttons as they were not in the latest code snippet */}
                    {/*
                    <div className="admin-dashboard-opportunity-controls">
                        <button className="admin-dashboard-opportunity-button admin-dashboard-opportunity-button-filter">
                            <FaFilter /> Filters
                        </button>
                        <button className="admin-dashboard-opportunity-button admin-dashboard-opportunity-button-sort">
                            <FaSort /> Sort
                        </button>
                    </div>
                    */}
                </div>

                <AdminDashboardTableComponent
                    columns={columns}
                    data={opportunitiesData}
                />
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashBoardOpportunity;