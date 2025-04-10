import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import DashboardTable from "../components/Dashboard/Common-components/DashBoardTable.jsx";
import '../stylesheet/NGO-Dashboard-Individual-Opportunity.css';
import { Link } from "react-router-dom";
import { useOpportunities } from '../redux/hooks/useOpportunities.js';
import { useAuth } from '../redux/hooks/useAuth';
import { PageLoader } from '../components/ui/LoaderComponents.jsx';

// --- Component Definition ---
const NgoDashboardIndividualOpportunity = () => {
    // Get the 'id' parameter from the URL
    const { id } = useParams();
    const { currentUser } = useAuth();
    const { getOpportunityWithApplicants, currentOpportunity, loading, error } = useOpportunities();
    
    // State to manage the active tab in the DashboardTable
    const [activeTab, setActiveTab] = useState('Applied');
    // State to store formatted volunteer data
    const [volunteerData, setVolunteerData] = useState([]);    // Fetch opportunity details with applicants when component mounts
    useEffect(() => {
        const fetchOpportunityDetails = async () => {
            try {
                await getOpportunityWithApplicants(id);
            } catch (err) {
                console.error("Error fetching opportunity details:", err);
            }
        };

        if (id) {
            fetchOpportunityDetails();
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Only depend on id, not the function that might change on every render

    // Process applicants data when currentOpportunity changes
    useEffect(() => {
        if (currentOpportunity?.applicants) {
            const formattedData = currentOpportunity.applicants.map(app => {
                // Format skills as a string with line breaks
                const skillsString = Array.isArray(app.skills) 
                    ? app.skills.slice(0, 2).join('\\n') + (app.skills.length > 2 ? '\\n...' : '')
                    : 'Not specified';
                
                // Format contact information
                const contactInfo = `${app.email || 'No email'}\\n${app.phoneNumber || 'No phone'}`;
                
                return {
                    id: app.id,
                    volunteerId: app.volunteerId,
                    name: app.name,
                    img: app.profilePhoto || `https://via.placeholder.com/30/7F7FFF/FFFFFF?text=${app.name.substring(0, 2).toUpperCase()}`,
                    gender: app.gender || 'Not specified',
                    contact: contactInfo,
                    skills: skillsString,
                    status: app.status,
                    appliedAt: new Date(app.appliedAt).toLocaleDateString()
                };
            });
            
            setVolunteerData(formattedData);
        }
    }, [currentOpportunity]);

    // Handler for changing tabs
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    // Handler for updating volunteer status
    const handleStatusUpdate = async (volunteerId, newStatus) => {
        try {
            // You can implement the status update logic here using the application API
            console.log(`Updating volunteer ${volunteerId} status to ${newStatus}`);
            // After updating, refresh the data
            await getOpportunityWithApplicants(id);
        } catch (err) {
            console.error("Error updating volunteer status:", err);
        }
    };

    // Define columns configuration for the DashboardTable
    const tableColumns = [
        {
            header: 'Volunteer name',
            accessor: 'name',
            cellClassName: 'ngo-dashboard-individual-opp-col-volunteer-name',
            cellRenderer: (name, row) => (
                <Link to={`/provider/dashboard/volunteer/${row.volunteerId}`} title={`View details for ${name}`}>
                    <div className="ngo-dashboard-individual-opp-volunteer-name-cell-content">
                        <img src={row.img} alt={name} className="ngo-dashboard-individual-opp-volunteer-img" />
                        <span className="ngo-dashboard-individual-opp-volunteer-text">{name}</span>
                    </div>
                </Link>
            ),
        },
        {
            header: 'Gender',
            accessor: 'gender',
            cellClassName: 'ngo-dashboard-individual-opp-col-gender',
        },
        {
            header: 'Contact',
            accessor: 'contact',
            cellClassName: 'ngo-dashboard-individual-opp-col-contact',
            cellRenderer: (contact) => (
                <span style={{ whiteSpace: 'pre-wrap' }}>{contact}</span>
            ),
        },
        {
            header: 'Skills',
            accessor: 'skills',
            cellClassName: 'ngo-dashboard-individual-opp-col-skills',
            cellRenderer: (skills) => (
                <span style={{ whiteSpace: 'pre-wrap' }}>{skills}</span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            cellClassName: 'ngo-dashboard-individual-opp-col-status',
            cellRenderer: (status) => {
                let statusClass = '';
                switch (status?.toLowerCase()) {
                    case 'pending':
                        statusClass = 'ngo-dashboard-individual-opp-status-pending';
                        break;
                    case 'accepted':
                        statusClass = 'ngo-dashboard-individual-opp-status-accepted';
                        break;
                    case 'rejected':
                        statusClass = 'ngo-dashboard-individual-opp-status-rejected';
                        break;
                    default:
                        statusClass = 'ngo-dashboard-individual-opp-status-default';
                }
                return <span className={`ngo-dashboard-individual-opp-status-badge ${statusClass}`}>{status}</span>;
            },
        },
        {
            header: 'Action',
            accessor: 'action',
            cellClassName: 'ngo-dashboard-individual-opp-col-action',
            cellRenderer: (value, row) => {
                return (
                    <div className="ngo-dashboard-individual-opp-action-buttons">
                        {row.status === 'Pending' && (
                            <>
                                <button 
                                    className="ngo-dashboard-individual-opp-action-accept" 
                                    title="Accept"
                                    onClick={() => handleStatusUpdate(row.volunteerId, 'Accepted')}
                                >
                                    ✓
                                </button>
                                <button 
                                    className="ngo-dashboard-individual-opp-action-reject" 
                                    title="Reject"
                                    onClick={() => handleStatusUpdate(row.volunteerId, 'Rejected')}
                                >
                                    ✕
                                </button>
                            </>
                        )}
                        {row.status === 'Accepted' && (
                            <button 
                                className="ngo-dashboard-individual-opp-action-reject" 
                                title="Reject"
                                onClick={() => handleStatusUpdate(row.volunteerId, 'Rejected')}
                            >
                                ✕
                            </button>
                        )}
                        {row.status === 'Rejected' && (
                            <button 
                                className="ngo-dashboard-individual-opp-action-accept" 
                                title="Accept"
                                onClick={() => handleStatusUpdate(row.volunteerId, 'Accepted')}
                            >
                                ✓
                            </button>
                        )}
                    </div>
                );
            },
        }
    ];

    // Filter data based on active tab
    const displayedData = activeTab === 'Applied'
        ? volunteerData
        : volunteerData.filter(v =>
            (activeTab === 'Shortlisted' && v.status === 'Accepted') ||
            (activeTab === 'Rejected' && v.status === 'Rejected')
        );    // Show loading state - only if we're loading AND don't have opportunity data yet
    if (loading && !currentOpportunity) {
        return (
            <>
                <Header />
                <div className="ngo-dashboard-individual-opp-loading">
                    <PageLoader />
                    <p>Loading opportunity details...</p>
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
                <div className="ngo-dashboard-individual-opp-error">
                    <h2>Error Loading Opportunity</h2>
                    <p>{error}</p>
                    <Link to="/provider/dashboard" className="ngo-dashboard-individual-opp-back-link">
                        Return to Dashboard
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    // Helper function to extract basic opportunity details
    const getOpportunityDetails = () => {
        if (!currentOpportunity) return { title: 'Opportunity', organization: 'Organization', location: 'Location', duration: 'N/A' };
        
        const basicDetails = currentOpportunity.basicDetails || {};
        const schedule = currentOpportunity.schedule || {};
        
        // Calculate duration
        let duration = schedule.timeCommitment || 'N/A';
        if (schedule.startDate && schedule.endDate) {
            const start = new Date(schedule.startDate);
            const end = new Date(schedule.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) duration = `${schedule.timeCommitment}`;
            else if (diffDays === 1) duration = '1 Day';
            else if (diffDays < 7) duration = `${diffDays} Days`;
            else if (diffDays < 30) duration = `${Math.ceil(diffDays/7)} Weeks`;
            else if (diffDays < 365) duration = `${Math.ceil(diffDays/30)} Months`;
            else duration = `${Math.ceil(diffDays/365)} Years`;
        }
        
        return {
            title: basicDetails.title || 'Unnamed Opportunity',
            organization: currentUser?.organizationName || 'Your Organization',
            location: schedule.location || 'No location specified',
            duration: duration
        };
    };

    const opportunityDetails = getOpportunityDetails();

    return (
        <>
            <Header />
            <div className="ngo-dashboard-individual-opp-page-container">
                <div className="ngo-dashboard-individual-opp-header-section">
                    <img
                        src={currentOpportunity?.basicDetails?.photo || "https://via.placeholder.com/80x80/236D4E/FFFFFF?text=NGO"}
                        alt={opportunityDetails.title}
                        className="ngo-dashboard-individual-opp-campaign-image"
                    />
                    <div className="ngo-dashboard-individual-opp-header-info">
                        <h1 className="ngo-dashboard-individual-opp-title">{opportunityDetails.title}</h1>
                        <div className="ngo-dashboard-individual-opp-sub-details">
                            <span className="ngo-dashboard-individual-opp-detail-item">
                                <span className='ngo-dashboard-individual-opp-icon'>
                                    <img src='/ngo-dashboard-individual-opp-building-icon.svg' alt='icon'/>
                                </span>
                                {opportunityDetails.organization}
                            </span>
                            <span className="ngo-dashboard-individual-opp-detail-item">
                                <span className='ngo-dashboard-individual-opp-icon'>
                                    <img src='/ngo-dashboard-individual-opp-location-icon.svg' alt='icon'/>
                                </span>
                                {opportunityDetails.location}
                            </span>
                            <span className="ngo-dashboard-individual-opp-detail-item">
                                <span className='ngo-dashboard-individual-opp-icon'>
                                    <img src='/ngo-dashboard-individual-opp-time-icon.svg' alt='icon'/>
                                </span>
                                {opportunityDetails.duration}
                            </span>
                        </div>
                    </div>
                    <Link to={`/opportunities/${id}`} className="ngo-dashboard-individual-opp-view-opportunity-btn">
                        View Opportunity
                    </Link>
                </div>

                <div className="ngo-dashboard-individual-opp-volunteers-section">
                    <div className="ngo-dashboard-individual-opp-volunteers-header">
                        <h2 className="ngo-dashboard-individual-opp-volunteers-title">
                            Volunteers {volunteerData.length ? `(${volunteerData.length})` : ''}
                        </h2>
                    </div>

                    <DashboardTable
                        columns={tableColumns}
                        data={displayedData}
                        tabs={['Applied', 'Shortlisted', 'Rejected']}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        className="ngo-dashboard-individual-opp-table-component"
                        emptyMessage="No volunteers match the current criteria."
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NgoDashboardIndividualOpportunity;

