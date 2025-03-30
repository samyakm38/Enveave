// import React from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import DashBoardHeader from "../components/Dashboard/Common-components/DashBoardHeader.jsx";
import DashBoardCard from "../components/Dashboard/Common-components/DashBoardCard.jsx";
import '../stylesheet/Volunteer-DashBoard.css'
import {useMemo, useState} from "react";
import DashboardTable from "../components/Dashboard/Common-components/DashBoardTable.jsx";


const userData = {
    ProfilePictureURL: '/dashboard-default-user-image.svg', // Use the imported image or a URL string
    userName: 'Sarthak',
    status: 'Active',
    completionPercentage: 75,
    formLink: '/profile/edit' // Example link
};

const cardData = [
    { title: 'Available Opportunities', count: 100, color: '#FD2828' }, // Red
    { title: 'Applied Opportunities', count: 40, color: '#2C66E4' },   // Blue
    { title: 'Completed Opportunities', count: 35, color: '#236D4E' }  // Green
];

const StatusBadge = ({ status }) => {
    let statusClass = 'dashboard-table-status-badge'; // Use base class for potential reuse
    // eslint-disable-next-line react/prop-types
    switch (status?.toLowerCase()) {
        case 'rejected': statusClass += ' status-rejected'; break; // Add specific part
        case 'accepted': statusClass += ' status-accepted'; break;
        case 'in progress': statusClass += ' status-progress'; break;
        case 'open': statusClass += ' status-open'; break;
        case 'completed': statusClass += ' status-completed'; break;
        default: statusClass += ' status-default';
    }
    return <span className={statusClass}>{status || 'N/A'}</span>;
};


const allOpportunities = [
    // Applied Entries
    { id: 1, category: 'Applied', name: 'Beach Cleanup Drive', organization: 'Ocean Guardians', location: 'Mumbai, India', volunteers: 50, duration: '3 Hours', deadline: 'April 10, 2025', status: 'Rejected' },
    { id: 2, category: 'Applied', name: 'Tree Plantation Campaign', organization: 'Green Earth Foundation', location: 'Bangalore, India', volunteers: 100, duration: '1 Day', deadline: 'May 5, 2025', status: 'Accepted' },
    { id: 5, category: 'Applied', name: 'Wildlife Conserve Workshop', organization: 'Save Our Species', location: 'Jaipur, India', volunteers: 30, duration: '2 Days', deadline: 'April 20, 2025', status: 'In progress' },
    // Completed Entries
    { id: 4, category: 'Completed', name: 'Community Recycling Drive', organization: 'Eco Warriors', location: 'Delhi, India', role: 'Team Lead', volunteeringTime: '4 Hours', completionDate: 'March 31, 2025' },
    { id: 7, category: 'Completed', name: 'River Cleanup Expedition', organization: 'Blue Planet Initiative', location: 'Varanasi, India', role: 'Cleanup Member', volunteeringTime: '5 Hours', completionDate: 'April 17, 2025' },
    { id: 8, category: 'Completed', name: 'Air Pollution Awareness Program', organization: 'Clean Air Initiative', location: 'Hyderabad, India', role: 'Social Media Lead', volunteeringTime: '1 Week', completionDate: 'April 28, 2025' },
];



const VolunteerDashboard=() => {

    const [activeTab, setActiveTab] = useState('Applied');
    const tabs = ['Applied', 'Completed'];

    const appliedColumns = [
        { header: 'Opportunity name', accessor: 'name', cellClassName: 'opportunities-cell-name' },
        { header: 'Organization', accessor: 'organization' },
        { header: 'Location', accessor: 'location' },
        { header: 'Total volunteers', accessor: 'volunteers', cellClassName: 'opportunities-cell-number' }, // Adjusted header text
        { header: 'Duration', accessor: 'duration' },
        { header: 'Application Deadline', accessor: 'deadline' }, // Adjusted header text
        {
            header: 'Status',
            accessor: 'status',
            cellRenderer: (statusValue) => <StatusBadge status={statusValue} />,
            cellClassName: 'opportunities-cell-status'
        },
    ];

    // Define Columns for the "Completed" Tab
    const completedColumns = [
        { header: 'Opportunity name', accessor: 'name', cellClassName: 'opportunities-cell-name' },
        { header: 'Organization', accessor: 'organization' },
        { header: 'Location', accessor: 'location' },
        { header: 'Role', accessor: 'role' }, // New column
        { header: 'Volunteering Time', accessor: 'volunteeringTime' }, // New column
        { header: 'Completion Date', accessor: 'completionDate' }, // New column
    ];

    const activeColumns = useMemo(() => {
        if (activeTab === 'Completed') {
            return completedColumns;
        }
        // Default to Applied columns
        return appliedColumns;
    }, [activeTab]);

    const filteredData = useMemo(() => {
        return allOpportunities.filter(opp => opp.category === activeTab);
    }, [activeTab]);



    return (
        <div>
            <Header/>
            <DashBoardHeader
                ProfilePictureURL={userData.ProfilePictureURL}
                userName={userData.userName}
                status={userData.status}
                completionPercentage={userData.completionPercentage}
                formLink={userData.formLink}
            />

            <div className="volunteer-dashboard-card-container">
                {/* Map over the data to render each card */}
                {cardData.map((card, index) => (
                    <DashBoardCard
                        key={index} // Important for list rendering
                        title={card.title}
                        count={card.count}
                        borderColor={card.color}
                    />
                ))}
            </div>

            <h1 className='volunteer-dashboard-heading'>
                Opportunities
            </h1>
            <div className='volunteer-dashboard-table-container'>
                <DashboardTable
                    columns={activeColumns}
                    data={filteredData}
                    tabs={tabs}
                    activeTab={activeTab} // Pass current state
                    onTabChange={setActiveTab} // Pass state setter
                    emptyMessage={`No opportunities found for "${activeTab}".`}
                    // Add a specific wrapper class for CSS targeting
                    className="dashboard-table-opportunities-theme"
                />
            </div>



            <Footer/>
        </div>
    );
};

export default VolunteerDashboard;