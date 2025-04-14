import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import AdminDashboardTableComponent from "../components/Dashboard/Admin-DashBoard/AdminDashBoardTableComponent.jsx";
import { FaTrashAlt, FaFilter, FaSort, FaArrowLeft, FaEye } from 'react-icons/fa';
import '../stylesheet/AdminDashBoardOpportunity.css';
import useAdmin from '../redux/hooks/useAdmin';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AdminDashBoardOpportunity = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    
    // Get admin hooks and state
    const { 
        opportunities,
        opportunitiesLoading, 
        opportunitiesError, 
        opportunitiesPagination, 
        loadOpportunities, 
        deleteOpportunity 
    } = useAdmin();

    // Load opportunities when component mounts or page changes
    useEffect(() => {
        loadOpportunities(currentPage, limit);
    }, [loadOpportunities, currentPage, limit]);

    // --- Action Handler ---
    const handleDelete = (row) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete the opportunity "${row.name}"? This action cannot be undone.`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        await deleteOpportunity(row.id);
                        // Reload opportunities to reflect the changes
                        loadOpportunities(currentPage, limit);
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    // View opportunity details
    const handleView = (id) => {
        window.open(`/opportunities/${id}`, '_blank');
    };

    // --- Go Back Handler ---
    const handleGoBack = () => {
        navigate('/admin/dashboard'); 
    };

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };    // --- Column Definitions ---
    const columns = [
        { 
            header: 'Opportunity Name', 
            accessor: 'name',
            render: (row) => (
                <a 
                    href={`/opportunities/${row.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="admin-dashboard-opportunity-name-link"
                >
                    {row.name}
                </a>
            )
        },
        { header: 'Organization', accessor: 'org' },
        { header: 'Location', accessor: 'location' },
        { header: 'Total Volunteers', accessor: 'volunteers' },
        { header: 'Time Commitment', accessor: 'hours' },
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

    // Show placeholder data if API hasn't loaded yet
    const placeholderData = [
        { id: 1, name: 'Beach Cleanup Drive', org: 'Ocean Guardians', location: 'Mumbai, India', volunteers: 50, hours: '3 Hours', deadline: 'April 10, 2025' },
        { id: 2, name: 'Tree Plantation Campaign', org: 'Green Earth Found.', location: 'Bangalore, India', volunteers: 100, hours: '1 Day', deadline: 'May 5, 2025' },
        { id: 3, name: 'Wildlife Conservation', org: 'Save Our Species', location: 'Jaipur, India', volunteers: 30, hours: '2 Days', deadline: 'April 20, 2025' },
        { id: 4, name: 'Community Recycling', org: 'Eco Warriors', location: 'Delhi, India', volunteers: 70, hours: '4 Hours', deadline: 'March 31, 2025' },
        { id: 5, name: 'Air Pollution Awareness', org: 'Clean Air Initiative', location: 'Hyderabad, India', volunteers: 20, hours: '1 Week', deadline: 'May 25, 2025' },
        { id: 6, name: 'River Cleanup Expedition', org: 'Blue Planet Initiative', location: 'Varanasi, India', volunteers: 60, hours: '5 Hours', deadline: 'May 15, 2025' },
        { id: 7, name: 'Urban Gardening Project', org: 'Grow Green', location: 'Pune, India', volunteers: 40, hours: '3 Week', deadline: 'April 10, 2025' },
        { id: 8, name: 'Sustainable Fashion', org: 'EcoThreads', location: 'Chennai, India', volunteers: 25, hours: '2 Days', deadline: 'April 30, 2025' },
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
                </div>

                {opportunitiesLoading ? (
                    <div className="admin-dashboard-opportunity-loading">
                        <p>Loading opportunities...</p>
                    </div>
                ) : opportunitiesError ? (
                    <div className="admin-dashboard-opportunity-error">
                        <p>Error: {opportunitiesError}</p>
                        <button 
                            onClick={() => loadOpportunities(currentPage, limit)}
                            className="admin-dashboard-opportunity-retry-button"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <AdminDashboardTableComponent
                            columns={columns}
                            data={opportunities && opportunities.length > 0 ? opportunities : placeholderData}
                        />
                        
                        {/* Pagination */}
                        {opportunitiesPagination && opportunitiesPagination.pages > 1 && (
                            <div className="admin-dashboard-opportunity-pagination">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="admin-dashboard-opportunity-pagination-button"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(opportunitiesPagination.pages).keys()].map(page => (
                                    <button
                                        key={page + 1}
                                        className={`admin-dashboard-opportunity-pagination-button ${currentPage === page + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    disabled={currentPage === opportunitiesPagination.pages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="admin-dashboard-opportunity-pagination-button"
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

export default AdminDashBoardOpportunity;