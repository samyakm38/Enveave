// import React from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import DashBoardHeader from "../components/Dashboard/Common-components/DashBoardHeader.jsx";
import DashBoardCard from "../components/Dashboard/Common-components/DashBoardCard.jsx";
import '../stylesheet/Volunteer-DashBoard.css'
import {useMemo, useState, useEffect} from "react";
import DashboardTable from "../components/Dashboard/Common-components/DashBoardTable.jsx";
import { useAuth, useApplications, useOpportunities } from '../redux/hooks';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }) => {
    let statusClass = 'dashboard-table-status-badge'; // Use base class for potential reuse
    // eslint-disable-next-line react/prop-types
    switch (status?.toLowerCase()) {
        case 'rejected': statusClass += ' status-rejected'; break; // Add specific part
        case 'accepted': statusClass += ' status-accepted'; break;
        case 'in progress': statusClass += ' status-progress'; break;
        case 'open': statusClass += ' status-open'; break;
        case 'completed': statusClass += ' status-completed'; break;
        case 'pending': statusClass += ' status-open'; break; // Use open styling for pending
        default: statusClass += ' status-default';
    }
    return <span className={statusClass}>{status || 'N/A'}</span>;
};

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { getUserApplications, userApplications, loading: applicationsLoading } = useApplications();
    const { getAllOpportunities, opportunities, loading: opportunitiesLoading } = useOpportunities();
    
    const [activeTab, setActiveTab] = useState('Applied');
    const tabs = ['Applied', 'Completed'];
    const [stats, setStats] = useState({
        availableCount: 0,
        appliedCount: 0,
        completedCount: 0
    });

    // Fetch data when component mounts
    useEffect(() => {
        if (isAuthenticated) {
            // Fetch user's applications
            getUserApplications().catch(err => 
                console.error("Error fetching applications:", err)
            );
            
            // Fetch all opportunities to get total available count
            getAllOpportunities().catch(err => 
                console.error("Error fetching opportunities:", err)
            );
        } else {
            // Redirect to login if not authenticated
            navigate('/login');
        }
    }, [isAuthenticated, navigate]); // Remove dependencies that cause re-fetching

    // Calculate stats when applications or opportunities data changes
    useEffect(() => {
        if (userApplications && opportunities) {
            // Count applied and completed applications
            const appliedCount = userApplications.length;
            const completedCount = userApplications.filter(app => 
                app.status === 'Accepted' && app.isCompleted
            ).length;
            
            // Count available opportunities
            const availableCount = opportunities.length;
            
            setStats({
                availableCount,
                appliedCount,
                completedCount
            });
        }
    }, [userApplications, opportunities]);

    // Prepare card data based on stats
    const cardData = useMemo(() => [
        { title: 'Available Opportunities', count: stats.availableCount, color: '#FD2828' },
        { title: 'Applied Opportunities', count: stats.appliedCount, color: '#2C66E4' },
        { title: 'Completed Opportunities', count: stats.completedCount, color: '#236D4E' }
    ], [stats]);

    // Transform applications data for table display
    const transformedApplications = useMemo(() => {
        if (!userApplications) return [];
        
        return userApplications.map(app => {
            const opp = app.opportunity;
            if (!opp) return null;
            
            const baseData = {
                id: app._id,
                name: opp.basicDetails?.title || 'Unknown Opportunity',
                organization: opp.provider?.auth?.organizationName || 'Unknown Organization',
                location: opp.schedule?.location || 'N/A',
                duration: `${formatDateRange(opp.schedule?.startDate, opp.schedule?.endDate)}`,
                volunteers: opp.basicDetails?.volunteersRequired || 0,
                deadline: formatDate(opp.schedule?.applicationDeadline),
                status: app.status
            };
            
            // Determine which category this application belongs to
            const isCompleted = app.status === 'Accepted' && app.isCompleted;
            
            if (isCompleted) {
                return {
                    ...baseData,
                    category: 'Completed',
                    role: 'Volunteer', // Default role if not specified
                    volunteeringTime: opp.schedule?.timeCommitment || 'N/A',
                    completionDate: formatDate(app.completionDate)
                };
            } else {
                return {
                    ...baseData,
                    category: 'Applied'
                };
            }
        }).filter(Boolean); // Remove any null entries
    }, [userApplications]);

    const appliedColumns = [
        { header: 'Opportunity name', accessor: 'name', cellClassName: 'opportunities-cell-name' },
        { header: 'Organization', accessor: 'organization' },
        { header: 'Location', accessor: 'location' },
        { header: 'Total volunteers', accessor: 'volunteers', cellClassName: 'opportunities-cell-number' },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Application Deadline', accessor: 'deadline' },
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
        { header: 'Role', accessor: 'role' },
        { header: 'Volunteering Time', accessor: 'volunteeringTime' },
        { header: 'Completion Date', accessor: 'completionDate' },
    ];

    const activeColumns = useMemo(() => {
        if (activeTab === 'Completed') {
            return completedColumns;
        }
        // Default to Applied columns
        return appliedColumns;
    }, [activeTab]);

    const filteredData = useMemo(() => {
        return transformedApplications.filter(opp => opp.category === activeTab);
    }, [activeTab, transformedApplications]);

    // Helper functions for date formatting
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            return format(parseISO(dateString), 'MMM d, yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    }

    function formatDateRange(startDateString, endDateString) {
        if (!startDateString || !endDateString) return 'N/A';
        try {
            const startDate = parseISO(startDateString);
            const endDate = parseISO(endDateString);
            const startFormatted = format(startDate, 'MMM d');
            const endFormatted = format(endDate, 'MMM d, yyyy');
            return `${startFormatted} - ${endFormatted}`;
        } catch (error) {
            return 'Invalid date range';
        }
    }

    // Loading state
    if (applicationsLoading || opportunitiesLoading) {
        return (
            <div>
                <Header/>
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <h2>Loading your dashboard...</h2>
                </div>
                <Footer/>
            </div>
        );
    }

    // Display user data from auth state
    const userData = {
        ProfilePictureURL: user?.profilePhoto || '/dashboard-default-user-image.svg',
        userName: user?.name || 'Volunteer',
        status: user?.profileStatus || 'Active',
        completionPercentage: calculateProfileCompletion(user),
        formLink: '/Volunteer-form-1' // Link to complete profile
    };

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
                {cardData.map((card, index) => (
                    <DashBoardCard
                        key={index}
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
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    emptyMessage={`No opportunities found for "${activeTab}".`}
                    className="dashboard-table-opportunities-theme"
                />
            </div>

            <Footer/>
        </div>
    );
};

// Helper function to calculate profile completion percentage
function calculateProfileCompletion(user) {
    if (!user) return 0;
    
    const profileCompletion = user.profileCompletion || {};
    const steps = ['step1', 'step2', 'step3'];
    const completedSteps = steps.filter(step => profileCompletion[step]).length;
    return Math.round((completedSteps / steps.length) * 100);
}

export default VolunteerDashboard;