import React, { useState, useMemo } from 'react'; // Added useMemo
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx"; // Added Footer import
import DashBoardHeader from "../components/Dashboard/Common-components/DashBoardHeader.jsx";
import DashBoardCard from "../components/Dashboard/Common-components/DashBoardCard.jsx";
import DashboardTable from "../components/Dashboard/Common-components/DashBoardTable.jsx"; // Import the table component
import '../stylesheet/NGO-dashboard.css';
// Optional: Import specific CSS for this table's theme if needed
// import '../stylesheet/NgoOpportunitiesTable.css';
// Assuming Flowbite Button is not needed here unless used inside the table via cellRenderer
// import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

// --- Constants (Keep as is) ---
const userData = {
    ProfilePictureURL: '/NGO-profile-pic.svg',
    userName: 'EcoThreads',
    status: 'Active',
    completionPercentage: 75,
    formLink: '/profile/edit'
};

const cardData = [
    { title: 'Total Campaigns Running', count: 500, color: '#FD2828' },
    { title: 'Total Volunteers', count: 10000, color: '#2C66E4' },
    { title: 'Completed Projects', count: 700, color: '#236D4E' }
];

// --- Sample Data for NGO Opportunities ---
const allNgoOpportunities = [
    // Ongoing Entries (Matching the image structure + an ID for deletion)
    { id: 101, category: 'Ongoing', name: 'Beach Cleanup Drive', organization: 'Ocean Guardians', location: 'Mumbai, India', volunteers: 50, duration: '3 Hours', deadline: 'April 10, 2025' },
    { id: 102, category: 'Ongoing', name: 'Tree Plantation Campaign', organization: 'Green Earth Foundation', location: 'Bangalore, India', volunteers: 100, duration: '1 Day', deadline: 'May 5, 2025' },
    { id: 103, category: 'Ongoing', name: 'Wildlife Conserve Workshop', organization: 'Save Our Species', location: 'Jaipur, India', volunteers: 30, duration: '2 Days', deadline: 'April 20, 2025' },
    { id: 104, category: 'Ongoing', name: 'Community Recycling Drive', organization: 'Eco Warriors', location: 'Delhi, India', volunteers: 70, duration: '4 Hours', deadline: 'March 31, 2025' },
    { id: 105, category: 'Ongoing', name: 'Air Pollution Awareness', organization: 'Clean Air Initiative', location: 'Hyderabad, India', volunteers: 20, duration: '1 Week', deadline: 'May 25, 2025' },
    { id: 106, category: 'Ongoing', name: 'River Cleanup Expedition', organization: 'Blue Planet Initiative', location: 'Varanasi, India', volunteers: 60, duration: '5 Hours', deadline: 'May 15, 2025' },
    { id: 107, category: 'Ongoing', name: 'Urban Gardening Project', organization: 'GrowGreen Community', location: 'Pune, India', volunteers: 40, duration: '3 Weeks', deadline: 'April 10, 2025' },
    { id: 108, category: 'Ongoing', name: 'Sustainable Fashion', organization: 'EcoThreads', location: 'Chennai, India', volunteers: 25, duration: '2 Days', deadline: 'April 30, 2025' },

    // Completed Entries (Example structure)
    { id: 201, category: 'Completed', name: 'Winter Coat Drive 2024', organization: 'Helping Hands', location: 'Citywide', volunteersParticipated: 150, duration: '1 Month', completionDate: 'Jan 31, 2025', outcome: 'Distributed 500+ coats' },
    { id: 202, category: 'Completed', name: 'Park Renovation Project', organization: 'City Parks Dept.', location: 'Central Park', volunteersParticipated: 85, duration: '3 Months', completionDate: 'Dec 15, 2024', outcome: 'New benches, cleaned pathways' },
];


// --- NGO Dashboard Component ---
const NgoDashboard = () => {
    const [activeTab, setActiveTab] = useState('Ongoing'); // Default to Ongoing
    const tabs = ['Ongoing', 'Completed'];

    // --- Delete Handler (Placeholder) ---
    // In a real app, this would likely update state and call an API
    const handleDeleteOpportunity = (opportunityId, opportunityName) => {
        console.log(`Attempting to delete opportunity ID: ${opportunityId}, Name: ${opportunityName}`);
        alert(`Delete action triggered for: ${opportunityName} (ID: ${opportunityId})\n(Implement actual deletion logic)`);
        // Example: setData(currentData => currentData.filter(item => item.id !== opportunityId));
        // Example: api.deleteOpportunity(opportunityId).then(...);
    };

    // --- Column Definitions ---
    const ongoingColumns = [
        { header: 'Opportunity name', accessor: 'name', cellClassName: 'ngo-cell-name' },
        { header: 'Organization', accessor: 'organization' }, // Or maybe 'Lead Contact'?
        { header: 'Location', accessor: 'location' },
        { header: 'Total volunteers', accessor: 'volunteers', cellClassName: 'ngo-cell-number' },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Application Deadline', accessor: 'deadline' },
        {
            header: 'Action',
            accessor: 'id', // Need an accessor, ID is good for actions
            cellClassName: 'ngo-cell-action', // Specific class for styling
            cellRenderer: (id, row) => ( // Use cellRenderer to create the button
                <button
                    onClick={() => handleDeleteOpportunity(id, row.name)}
                    className="ngo-delete-button" // Add a class for styling
                    title={`Delete ${row.name}`} // Tooltip for accessibility
                    aria-label={`Delete ${row.name}`}
                >
                    {/* Simple SVG Trash Icon (replace with library icon if preferred) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                </button>
            )
        },
    ];

    const completedColumns = [
        { header: 'Opportunity name', accessor: 'name', cellClassName: 'ngo-cell-name' },
        { header: 'Location', accessor: 'location' },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Completion Date', accessor: 'completionDate'},
        { header: 'Volunteers Participated', accessor: 'volunteersParticipated', cellClassName: 'ngo-cell-number' },
        { header: 'Outcome / Impact', accessor: 'outcome', cellClassName: 'ngo-cell-outcome'}, // Example specific class
    ];

    // --- Dynamic Selection ---
    const activeColumns = useMemo(() => {
        return activeTab === 'Completed' ? completedColumns : ongoingColumns;
    }, [activeTab]);

    const filteredData = useMemo(() => {
        return allNgoOpportunities.filter(opp => opp.category === activeTab);
    }, [activeTab]);

    return (
        <div>
            <Header />
            <DashBoardHeader
                ProfilePictureURL={userData.ProfilePictureURL}
                userName={userData.userName}
                status={userData.status}
                completionPercentage={userData.completionPercentage}
                formLink={userData.formLink}
            />

            {/* Cards Section */}
            <div className="NGO-dashboard-card-container">
                {cardData.map((card, index) => (
                    <DashBoardCard
                        key={index}
                        title={card.title}
                        count={card.count}
                        borderColor={card.color}
                    />
                ))}
            </div>

            {/* Heading and Add Button Section */}
            <div className='NGO-dashboard-heading-container'>
                <h1>
                    My Opportunities {/* Changed from "Opportunities" */}
                </h1>
                <Link to='/create-opportunity'> {/* Changed link to be more specific */}
                    <div className='NGO-dashboard-button-container'>
                        <p>
                            + Add Opportunity
                        </p>
                    </div>
                </Link>
            </div>

            {/* Table Section */}
            <div className='NGO-dashboard-table-container'>
                <DashboardTable
                    columns={activeColumns}
                    data={filteredData}
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    emptyMessage={`No ${activeTab.toLowerCase()} opportunities found.`}
                    // Add specific theme class for CSS targeting
                    className="dashboard-table-ngo-theme"
                />
            </div>

            <Footer /> {/* Added Footer */}
        </div>
    );
};

export default NgoDashboard;