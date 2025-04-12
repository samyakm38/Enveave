import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
// Corrected path assuming it's relative to the current file's directory structure
import AdminDashboardTableComponent from "../components/Dashboard/Admin-DashBoard/AdminDashBoardTableComponent.jsx";
import { FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
// Assuming your CSS is in a stylesheet directory
import '../stylesheet/AdminDashBoardOrganization.css';
// Placeholder image - replace with actual image paths or import images
import placeholderImage from '/contact-us-image.png'; // Adjust this path

const AdminDashBoardOrganisation = () => {
    const navigate = useNavigate();

    // Sample data - replace with actual data fetched from your API
    const [organisationsData, setOrganisationsData] = useState([
        { id: 1, imageUrl: placeholderImage, name: 'Green Earth Foundation', description: 'Environmental conservation organization', city: 'Mumbai', country: 'India', email: 'xyz@gmail.com', phone: '99XXXXXXXXXX' },
        { id: 2, imageUrl: placeholderImage, name: 'Ocean Savers', description: 'Marine life protection group', city: 'Chennai', country: 'India', email: 'info@oceans.org', phone: '98XXXXXXXXXX' },
        { id: 3, imageUrl: placeholderImage, name: 'Helping Hands Community', description: 'Local outreach and support', city: 'Delhi', country: 'India', email: 'contact@helping.com', phone: '97XXXXXXXXXX' },
        { id: 4, imageUrl: placeholderImage, name: 'Green Earth Foundation', description: 'Environmental conservation organization', city: 'Mumbai', country: 'India', email: 'xyz@gmail.com', phone: '99XXXXXXXXXX' },
        { id: 5, imageUrl: placeholderImage, name: 'Green Earth Foundation', description: 'Environmental conservation organization', city: 'Mumbai', country: 'India', email: 'xyz@gmail.com', phone: '99XXXXXXXXXX' },
        { id: 6, imageUrl: placeholderImage, name: 'Green Earth Foundation', description: 'Environmental conservation organization', city: 'Mumbai', country: 'India', email: 'xyz@gmail.com', phone: '99XXXXXXXXXX' },
    ]);

    // --- Action Handlers ---
    const handleDelete = (row) => {
        console.log('Deleting organisation:', row.name, row.id);
        // Implement actual delete logic here
        // e.g., setOrganisationsData(prevData => prevData.filter(item => item.id !== row.id));
        alert(`Delete action for "${row.name}" (ID: ${row.id}). Check console.`);
    };

    const handleGoBack = () => {
        navigate(-1); // Navigate back
    };

    // --- Column Definitions ---
    const columns = [
        {
            header: 'NGO Details',
            accessor: 'details', // Keep accessor simple
            render: (row) => (
                <div className="admin-dashboard-organisation-details-cell">
                    <img
                        src={row.imageUrl || placeholderImage} // Use placeholder if no image URL
                        alt={`${row.name} logo`}
                        className="admin-dashboard-organisation-details-img"
                    />
                    <div className="admin-dashboard-organisation-details-text">
                        <span className="admin-dashboard-organisation-details-name">{row.name}</span>
                        <span className="admin-dashboard-organisation-details-desc">{row.description}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            accessor: 'location',
            render: (row) => (
                <div className="admin-dashboard-organisation-location-cell">
                    <span>{row.city},</span>
                    <span>{row.country}</span>
                </div>
            )
        },
        {
            header: 'Contact',
            accessor: 'contact',
            render: (row) => (
                <div className="admin-dashboard-organisation-contact-cell">
                    <span>{row.email}</span>
                    <span>{row.phone}</span>
                </div>
            )
        },
        {
            header: 'Action',
            accessor: 'action',
            render: (row) => (
                <button
                    onClick={() => handleDelete(row)}
                    className="admin-dashboard-table-component-action-button" // Reuse same class for consistency
                    aria-label={`Delete ${row.name}`}
                >
                    <FaTrashAlt />
                </button>
            ),
        },
    ];

    return (
        <div className="admin-dashboard-organisation-page">
            <Header />
            <div className='admin-dashboard-organisation-container'>
                <div className="admin-dashboard-organisation-back-button-container">
                    <button
                        onClick={handleGoBack}
                        className="admin-dashboard-organisation-back-button"
                        aria-label="Go back to previous page"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                <div className="admin-dashboard-organisation-header">
                    <h1 className="admin-dashboard-organisation-title">Organization Management</h1>
                </div>

                {/* Render the reusable table component */}
                <AdminDashboardTableComponent
                    columns={columns}
                    data={organisationsData}
                />
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashBoardOrganisation;