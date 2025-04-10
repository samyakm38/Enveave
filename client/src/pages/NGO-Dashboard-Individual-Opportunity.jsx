import React, { useState } from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import DashboardTable from "../components/Dashboard/Common-components/DashBoardTable.jsx";
import '../stylesheet/NGO-Dashboard-Individual-Opportunity.css'
import {Link} from "react-router-dom";



// --- Mock Data based on the image ---
// Replace placeholder image URLs with actual paths or URLs
const volunteerData = [
    { id: 1, name: 'Emily Johnson', img: 'https://via.placeholder.com/30/FF7F7F/FFFFFF?text=EJ', gender: 'Female', contact: 'xyz@gmail.com\n99XXXXXXXX', skills: 'Event Coordination\nPublic Speaking', status: 'Pending' },
    { id: 2, name: 'Michael Smith', img: 'https://via.placeholder.com/30/7F7FFF/FFFFFF?text=MS', gender: 'Male', contact: 'xyz@gmail.com\n87XXXXXXXX', skills: 'Fundraising\nSocial Media Management', status: 'Accepted' },
    { id: 3, name: 'Jessica Brown', img: 'https://via.placeholder.com/30/FFBF7F/FFFFFF?text=JB', gender: 'Female', contact: 'xyz@gmail.com\n92XXXXXXXX', skills: 'Graphic Design\nCommunity Outreach', status: 'Rejected' },
    { id: 4, name: 'David Miller', img: 'https://via.placeholder.com/30/7FFF7F/FFFFFF?text=DM', gender: 'Male', contact: 'xyz@gmail.com\n61XXXXXXXX', skills: 'Teaching\nEnvironmentalist', status: 'Pending' },
    { id: 5, name: 'Sarah Wilson', img: 'https://via.placeholder.com/30/FF7FFF/FFFFFF?text=SW', gender: 'Female', contact: 'xyz@gmail.com\n85XXXXXXXX', skills: 'Data Analysis\nVolunteer Training', status: 'Accepted' },
    { id: 6, name: 'James Anderson', img: 'https://via.placeholder.com/30/7FFFFF/FFFFFF?text=JA', gender: 'Male', contact: 'xyz@gmail.com\n72XXXXXXXX', skills: 'Project Management\nFirst Aid', status: 'Accepted' },
    { id: 7, name: 'Olivia Martinez', img: 'https://via.placeholder.com/30/BF7FFF/FFFFFF?text=OM', gender: 'Female', contact: 'xyz@gmail.com\n85XXXXXXXX', skills: 'Content Writing\nPhotography', status: 'Rejected' }
];

// --- Component Definition ---
const NgoDashboardIndividualOpportunity = () => {
    // State to manage the active tab in the DashboardTable
    const [activeTab, setActiveTab] = useState('Applied');

    // Handler for changing tabs
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        // In a real application, you might filter the data here based on the tab
        // For now, we display the same data regardless of the tab, as shown in the image
        console.log("Switched to tab:", tabName);
    };

    // Define columns configuration for the DashboardTable
    const tableColumns = [
        {
            header: 'Volunteer name',
            accessor: 'name',
            cellClassName: 'ngo-dashboard-individual-opp-col-volunteer-name', // Class for the TD element
            // Custom renderer for the volunteer name cell (Image + Name)
            cellRenderer: (name, row) => (
                <Link to={`/provider/dashboard/volunteer/${row.id}`} title={`View details for ${name}`}>
                    <div className="ngo-dashboard-individual-opp-volunteer-name-cell-content">
                        <img src={row.img} alt={name} className="ngo-dashboard-individual-opp-volunteer-img" />
                        <span className="ngo-dashboard-individual-opp-volunteer-text">{name}</span>
                    </div>
                    {name}
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
            // Render contact info preserving line breaks
            cellRenderer: (contact) => (
                <span style={{ whiteSpace: 'pre-wrap' }}>{contact}</span>
            ),
        },
        {
            header: 'Skills',
            accessor: 'skills',
            cellClassName: 'ngo-dashboard-individual-opp-col-skills',
            // Render skills preserving line breaks
            cellRenderer: (skills) => (
                <span style={{ whiteSpace: 'pre-wrap' }}>{skills}</span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            cellClassName: 'ngo-dashboard-individual-opp-col-status',
            // Custom renderer for status badges
            cellRenderer: (status) => {
                // Determine the class based on the status value
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
                        statusClass = 'ngo-dashboard-individual-opp-status-default'; // Fallback style
                }
                // Return a span with base badge class and specific status class
                return <span className={`ngo-dashboard-individual-opp-status-badge ${statusClass}`}>{status}</span>;
            },
        },
        {
            header: 'Action',
            accessor: 'action', // No specific data field, used for rendering buttons
            cellClassName: 'ngo-dashboard-individual-opp-col-action',
            // Custom renderer for action buttons based on the row's status
            cellRenderer: (value, row) => {
                return (
                    <div className="ngo-dashboard-individual-opp-action-buttons">
                        {/* Show Accept(✓) and Reject(✕) if status is Pending */}
                        {row.status === 'Pending' && (
                            <>
                                <button className="ngo-dashboard-individual-opp-action-accept" title="Accept">
                                    ✓
                                </button>
                                <button className="ngo-dashboard-individual-opp-action-reject" title="Reject">
                                    ✕
                                </button>
                            </>
                        )}
                        {/* Show only Reject(✕) if status is Accepted */}
                        {row.status === 'Accepted' && (
                            <button className="ngo-dashboard-individual-opp-action-reject" title="Reject">
                                ✕
                            </button>
                        )}
                        {/* Show only Accept(✓) if status is Rejected */}
                        {row.status === 'Rejected' && (
                            <button className="ngo-dashboard-individual-opp-action-accept" title="Accept">
                                ✓
                            </button>
                        )}
                    </div>
                );
            },
        }
    ];

    // Data to be displayed in the table.
    // Currently shows all data regardless of the active tab, mirroring the image.
    // const displayedData = volunteerData;
    // Example: If you wanted to filter based on tab/status:
    const displayedData = activeTab === 'Applied'
      ? volunteerData // Show all as per image
      : volunteerData.filter(v =>
          (activeTab === 'Shortlisted' && v.status === 'Accepted') ||
          (activeTab === 'Rejected' && v.status === 'Rejected')
        );

    return (
        <>
            <Header />
            {/* Main container for the page content */}
            <div className="ngo-dashboard-individual-opp-page-container">

                {/* Top section with Opportunity details */}
                <div className="ngo-dashboard-individual-opp-header-section">
                    {/* Campaign Image */}
                    <img
                        src="https://via.placeholder.com/80x80/cccccc/FFFFFF?text=NGO" /* Placeholder */
                        alt="Tree Plantation Campaign"
                        className="ngo-dashboard-individual-opp-campaign-image"
                    />
                    {/* Campaign Info Text */}
                    <div className="ngo-dashboard-individual-opp-header-info">
                        <h1 className="ngo-dashboard-individual-opp-title">Tree Plantation Campaign</h1>
                        <div className="ngo-dashboard-individual-opp-sub-details">
                            {/* Using spans with simple icons/emojis as placeholders */}
                            <span className="ngo-dashboard-individual-opp-detail-item">
                                <span className='ngo-dashboard-individual-opp-icon'>
                                    <img src='/ngo-dashboard-individual-opp-building-icon.svg' alt='icon'/>
                                </span> {/* Building icon */}
                                Green Earth Foundation
                            </span>
                            <span className="ngo-dashboard-individual-opp-detail-item">
                                <span className='ngo-dashboard-individual-opp-icon'>
                                    <img src='/ngo-dashboard-individual-opp-location-icon.svg' alt='icon'/>
                                </span> {/* Location icon */}
                                Bangalore, India
                            </span>
                            <span className="ngo-dashboard-individual-opp-detail-item">
                                <span className='ngo-dashboard-individual-opp-icon'>
                                    <img src='/ngo-dashboard-individual-opp-time-icon.svg' alt='icon'/>
                                </span> {/* Clock icon */}
                                1 Day
                            </span>
                        </div>
                    </div>
                    {/* View Opportunity Button */}
                    <button className="ngo-dashboard-individual-opp-view-opportunity-btn">
                        View Opportunity
                    </button>
                </div>

                {/* Volunteers section */}
                <div className="ngo-dashboard-individual-opp-volunteers-section">
                    {/* Header for the volunteers table */}
                    <div className="ngo-dashboard-individual-opp-volunteers-header">
                        <h2 className="ngo-dashboard-individual-opp-volunteers-title">Volunteers</h2>
                    </div>

                    {/* The DashboardTable component */}
                    <DashboardTable
                        columns={tableColumns}
                        data={displayedData}
                        tabs={['Applied', 'Shortlisted', 'Rejected']}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        // Add a specific class to the container div rendered by DashboardTable
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

