import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
// Adjust path as needed
import AdminDashboardTableComponent from "../components/Dashboard/Admin-DashBoard/AdminDashBoardTableComponent.jsx";
import { FaTrashAlt, FaFilter, FaSort, FaArrowLeft } from 'react-icons/fa';
// Create or ensure this CSS file exists and adjust the path
import '../stylesheet/AdminDashBoardVolunteer.css';

// Placeholder images - replace with actual imports or URLs
import avatar1 from '/contact-us-image.png';
import avatar2 from '/contact-us-image.png';
import avatar3 from '/contact-us-image.png';
import avatar4 from '/contact-us-image.png';
import avatar5 from '/contact-us-image.png';
import avatar6 from '/contact-us-image.png';
import avatar7 from '/contact-us-image.png';


const AdminDashBoardVolunteer = () => {
    const navigate = useNavigate();

    // Sample data - replace with actual data from your API
    const [volunteersData, setVolunteersData] = useState([
        { id: 1, imageUrl: avatar1, name: 'David Miller', gender: 'Male', city: 'Bangalore', country: 'India', email: 'xyz@gmail.com', phone: '61XXXXXXXXXX', skills: ['Project Management', 'First Aid'] },
        { id: 2, imageUrl: avatar2, name: 'James Anderson', gender: 'Male', city: 'Delhi', country: 'India', email: 'xyz@gmail.com', phone: '87XXXXXXXXXX', skills: ['Graphic Design', 'Community Outreach'] },
        { id: 3, imageUrl: avatar3, name: 'Olivia Martinez', gender: 'Female', city: 'Bangalore', country: 'India', email: 'xyz@gmail.com', phone: '75XXXXXXXXXX', skills: ['Teaching', 'Environmentalist'] },
        { id: 4, imageUrl: avatar4, name: 'Jessica Brown', gender: 'Female', city: 'Assam', country: 'India', email: 'xyz@gmail.com', phone: '65XXXXXXXXXX', skills: ['Content Writing', 'Photography'] },
        { id: 5, imageUrl: avatar5, name: 'Emily Johnson', gender: 'Female', city: 'Maharashtra', country: 'India', email: 'xyz@gmail.com', phone: '92XXXXXXXXXX', skills: ['Fundraising', 'Social Media Manager'] },
        { id: 6, imageUrl: avatar6, name: 'Sarah Wilson', gender: 'Female', city: 'Gujarat', country: 'India', email: 'xyz@gmail.com', phone: '72XXXXXXXXXX', skills: ['Project Management', 'First Aid'] },
        { id: 7, imageUrl: avatar7, name: 'Michael Smith', gender: 'Male', city: 'Jammu', country: 'India', email: 'xyz@gmail.com', phone: '85XXXXXXXXXX', skills: ['Data Analysis', 'Volunteer Training'] },
    ]);

    // --- Action Handlers ---
    const handleDelete = (row) => {
        console.log('Deleting volunteer:', row.name, row.id);
        // Implement actual delete logic here (API call, then update state)
        // e.g., setVolunteersData(prevData => prevData.filter(item => item.id !== row.id));
        alert(`Delete action for "${row.name}" (ID: ${row.id}). Check console.`);
    };

    const handleGoBack = () => {
        navigate(-1); // Navigate back
    };

    // --- Column Definitions ---
    const columns = [
        {
            header: 'Volunteer Name',
            accessor: 'name',
            render: (row) => (
                <div className="admin-dashboard-volunteer-name-cell">
                    <img
                        src={row.imageUrl || avatar1} // Default placeholder
                        alt={`${row.name}`}
                        className="admin-dashboard-volunteer-name-img"
                    />
                    <span className="admin-dashboard-volunteer-name-text">{row.name}</span>
                </div>
            )
        },
        {
            header: 'Gender',
            accessor: 'gender', // Simple accessor is fine here
        },
        {
            header: 'Location',
            accessor: 'location',
            render: (row) => (
                <div className="admin-dashboard-volunteer-location-cell">
                    <span>{row.city},</span>
                    <span>{row.country}</span>
                </div>
            )
        },
        {
            header: 'Contact',
            accessor: 'contact',
            render: (row) => (
                <div className="admin-dashboard-volunteer-contact-cell">
                    <span>{row.email}</span>
                    <span>{row.phone}</span>
                </div>
            )
        },
        {
            header: 'Skills',
            accessor: 'skills',
            render: (row) => (
                <div className="admin-dashboard-volunteer-skills-cell">
                    {/* Check if skills is an array and map, otherwise display directly */}
                    {Array.isArray(row.skills) ? row.skills.join(', ') : row.skills}
                    {/* Or map to separate lines if needed: */}
                    {/* {Array.isArray(row.skills) ? row.skills.map(skill => <span key={skill}>{skill}</span>) : <span>{row.skills}</span>} */}
                </div>
            )
        },
        {
            header: 'Action',
            accessor: 'action',
            render: (row) => (
                <button
                    onClick={() => handleDelete(row)}
                    className="admin-dashboard-table-component-action-button" // Reuse class
                    aria-label={`Delete ${row.name}`}
                >
                    <FaTrashAlt />
                </button>
            ),
        },
    ];

    return (
        <div className="admin-dashboard-volunteer-page">
            <Header />
            <div className='admin-dashboard-volunteer-container'>
                <div className="admin-dashboard-volunteer-back-button-container">
                    <button
                        onClick={handleGoBack}
                        className="admin-dashboard-volunteer-back-button"
                        aria-label="Go back to previous page"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                <div className="admin-dashboard-volunteer-header">
                    <h1 className="admin-dashboard-volunteer-title">Volunteers Management</h1>
                </div>

                {/* Render the reusable table component */}
                <AdminDashboardTableComponent
                    columns={columns}
                    data={volunteersData}
                />
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashBoardVolunteer;