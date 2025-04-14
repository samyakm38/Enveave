import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
// Corrected path assuming it's relative to the current file's directory structure
import AdminDashboardTableComponent from "../components/Dashboard/Admin-DashBoard/AdminDashBoardTableComponent.jsx";
import { FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
// For backend integration
import useAdmin from '../redux/hooks/useAdmin';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// Assuming your CSS is in a stylesheet directory
import '../stylesheet/AdminDashBoardOrganization.css';

const AdminDashBoardOrganisation = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    
    // Get organizations data and functions from the admin hook
    const { 
        organizations, 
        organizationsLoading, 
        organizationsError, 
        organizationsPagination, 
        loadOrganizations, 
        deleteOrganization 
    } = useAdmin();
    
    useEffect(() => {
        // Load organizations when component mounts or page changes
        loadOrganizations(currentPage);
    }, [loadOrganizations, currentPage]);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    // --- Action Handlers ---
    const handleDelete = (row) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete "${row.name}"? This action cannot be undone.`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        await deleteOrganization(row.id);
                        // Reload organizations to reflect the changes
                        loadOrganizations(currentPage);
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
            header: 'NGO Details',
            accessor: 'details',
            render: (row) => (
                <div className="admin-dashboard-organisation-details-cell">
                    <img
                        src={row.imageUrl || '/dashboard-default-user-image.svg'}
                        alt={`${row.name} logo`}
                        className="admin-dashboard-organisation-details-img"
                    />
                    <div className="admin-dashboard-organisation-details-text">
                        <span className="admin-dashboard-organisation-details-name">{row.name}</span>
                        <span className="admin-dashboard-organisation-details-desc">
                            {row.description?.length > 100 
                                ? `${row.description.substring(0, 100)}...` 
                                : row.description}
                        </span>
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
                    className="admin-dashboard-table-component-action-button"
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

                {organizationsLoading ? (
                    <div className="admin-dashboard-organisation-loading">
                        <p>Loading organizations...</p>
                    </div>
                ) : organizationsError ? (
                    <div className="admin-dashboard-organisation-error">
                        <p>Error: {organizationsError}</p>
                        <button onClick={() => loadOrganizations(currentPage)} className="admin-dashboard-organisation-retry-button">
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Render the reusable table component */}
                        <AdminDashboardTableComponent
                            columns={columns}
                            data={organizations}
                            isLoading={organizationsLoading}
                        />
                        
                        {/* Pagination */}
                        {organizationsPagination && organizationsPagination.pages > 1 && (
                            <div className="admin-dashboard-organisation-pagination">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="admin-dashboard-organisation-pagination-button"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(organizationsPagination.pages).keys()].map(page => (
                                    <button
                                        key={page + 1}
                                        className={`admin-dashboard-organisation-pagination-button ${currentPage === page + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    disabled={currentPage === organizationsPagination.pages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="admin-dashboard-organisation-pagination-button"
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

export default AdminDashBoardOrganisation;