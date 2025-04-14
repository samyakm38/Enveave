import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
// Adjust path as needed
import AdminDashboardTableComponent from "../components/Dashboard/Admin-DashBoard/AdminDashBoardTableComponent.jsx";
import { FaTrashAlt, FaFilter, FaSort, FaArrowLeft } from 'react-icons/fa';
// Added useAdmin hook for backend data
import useAdmin from '../redux/hooks/useAdmin';
// Added confirmAlert for delete confirmation
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// Create or ensure this CSS file exists and adjust the path
import '../stylesheet/AdminDashBoardVolunteer.css';

const AdminDashBoardVolunteer = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    
    // Get volunteers data and functions from the admin hook
    const { 
        volunteers, 
        volunteersLoading, 
        volunteersError, 
        volunteersPagination, 
        loadVolunteers, 
        deleteVolunteer 
    } = useAdmin();
    
    useEffect(() => {
        // Load volunteers when component mounts or page changes
        loadVolunteers(currentPage);
    }, [loadVolunteers, currentPage]);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    // --- Action Handlers ---
    const handleDelete = (row) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete volunteer "${row.name}"? This action cannot be undone.`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        await deleteVolunteer(row.id);
                        // Reload volunteers to reflect the changes
                        loadVolunteers(currentPage);
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    const handleGoBack = () => {
        navigate('/admin/dashboard'); // Navigate back to admin dashboard
    };
      // --- Column Definitions ---
    const columns = [
        {
            header: 'Volunteer Name',
            accessor: 'name',
            render: (row) => (
                <div className="admin-dashboard-volunteer-name-cell">
                    <img
                        src={row.imageUrl || '/dashboard-default-user-image.svg'} 
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
                    {/* Display skills with proper formatting */}
                    {Array.isArray(row.skills) && row.skills.length > 0 
                        ? row.skills.slice(0, 3).join(', ') + (row.skills.length > 3 ? ` +${row.skills.length - 3} more` : '')
                        : 'No skills listed'}
                </div>
            )
        },
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
                {volunteersLoading ? (
                    <div className="admin-dashboard-volunteer-loading">
                        <p>Loading volunteers...</p>
                    </div>
                ) : volunteersError ? (
                    <div className="admin-dashboard-volunteer-error">
                        <p>Error: {volunteersError}</p>
                        <button onClick={() => loadVolunteers(currentPage)} className="admin-dashboard-volunteer-retry-button">
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Render the reusable table component */}
                        <AdminDashboardTableComponent
                            columns={columns}
                            data={volunteers}
                            isLoading={volunteersLoading}
                        />
                        
                        {/* Pagination */}
                        {volunteersPagination && volunteersPagination.pages > 1 && (
                            <div className="admin-dashboard-volunteer-pagination">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="admin-dashboard-volunteer-pagination-button"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(volunteersPagination.pages).keys()].map(page => (
                                    <button
                                        key={page + 1}
                                        className={`admin-dashboard-volunteer-pagination-button ${currentPage === page + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    disabled={currentPage === volunteersPagination.pages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="admin-dashboard-volunteer-pagination-button"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashBoardVolunteer;