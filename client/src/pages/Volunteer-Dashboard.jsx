// import React from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import DashBoardHeader from "../components/Dashboard/Common-components/DashBoardHeader.jsx";
import DashBoardCard from "../components/Dashboard/Common-components/DashBoardCard.jsx";
import '../stylesheet/Volunteer-DashBoard.css'
import {useMemo, useState, useEffect, useRef} from "react";
import DashboardTable from "../components/Dashboard/Common-components/DashBoardTable.jsx";
import { useAuth, useApplications, useOpportunities } from '../redux/hooks';
import { useVolunteer } from '../redux/hooks/useVolunteer'; // Import the new hook
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
// Import our custom loaders
import { PageLoader, CardSkeleton, TableSkeleton } from '../components/ui/LoaderComponents.jsx';
// Import Skeleton directly from react-loading-skeleton
import Skeleton from 'react-loading-skeleton';

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
    // Use the new volunteer hook
    const { fetchVolunteerProfile, volunteerProfile, loading: volunteerLoading, calculateProfileCompletion } = useVolunteer();
    
    const [activeTab, setActiveTab] = useState('Applied');
    const tabs = ['Applied', 'Completed'];
    const [stats, setStats] = useState({
        availableCount: 0,
        appliedCount: 0,
        completedCount: 0
    });
    
    // Fetch data when component mounts
    useEffect(() => {
        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        // Create a single async function to load all data
        const loadAllData = async () => {
            try {
                console.log("Loading dashboard data...");
                
                // Fetch applications and opportunities in parallel
                await Promise.all([
                    getUserApplications(),
                    getAllOpportunities()
                ]);
                
                // Only fetch profile if needed (and not in a NOT_STARTED state)
                if (user?.profileStatus !== 'NOT_STARTED') {
                    await fetchVolunteerProfile();
                }
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            }
        };
        
        // Execute the data loading
        loadAllData();
        
    // This effect should only run once when the component mounts, 
    // when the user authenticates, or when any of these functions change
    }, [isAuthenticated, navigate]);

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
                opportunityId: opp._id, // Add opportunityId for navigation
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
    }, [userApplications]);    // Handle navigation to the individual opportunity page
    const handleOpportunityClick = (row) => {
        // Extract opportunityId from the application data
        const opportunityId = row.opportunityId;
        if (opportunityId) {
            navigate(`/opportunities/${opportunityId}`);
        }
    };

    const appliedColumns = [
        { 
            header: 'Opportunity name', 
            accessor: 'name', 
            cellClassName: 'opportunities-cell-name',
            isClickable: true,
            onCellClick: handleOpportunityClick
        },
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
        { 
            header: 'Opportunity name', 
            accessor: 'name', 
            cellClassName: 'opportunities-cell-name',
            isClickable: true,
            onCellClick: handleOpportunityClick
        },
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

    // Display user data from auth state and volunteer profile - MOVED BEFORE CONDITIONAL RETURN
    const userData = useMemo(() => ({
        ProfilePictureURL: volunteerProfile?.profilePhoto || user?.profilePhoto || '/dashboard-default-user-image.svg',
        userName: user?.name || 'Volunteer',
        status: volunteerProfile?.status || user?.profileStatus || 'Active',
        completionPercentage: calculateProfileCompletion(volunteerProfile),
        formLink: '/profile-completion' // Updated to use the new form
    }), [volunteerProfile, user, calculateProfileCompletion]);    // Loading state - NOW AFTER ALL HOOKS HAVE BEEN CALLED
    if (applicationsLoading || opportunitiesLoading || volunteerLoading) {
        return (
            <div>
                <Header/>
                <div className="volunteer-dashboard-container">
                    {/* Skeleton for dashboard header */}
                    <div className="dashboard-header-skeleton p-6 bg-white rounded-lg shadow mb-6">
                        <div className="flex items-center">
                            <Skeleton circle width={80} height={80} baseColor="#e9eaec" highlightColor="#f6f67d33" />
                            <div className="ml-4 flex-1">
                                <Skeleton height={30} width="40%" baseColor="#e9eaec" highlightColor="#f6f67d33" />
                                <Skeleton height={20} width="20%" className="mt-2" baseColor="#e9eaec" highlightColor="#f6f67d33" />
                            </div>
                            <div>
                                <Skeleton height={40} width={120} baseColor="#e9eaec" highlightColor="#f6f67d33" />
                            </div>
                        </div>
                    </div>

                    {/* Skeleton for card section */}
                    <div className="volunteer-dashboard-card-container mb-8">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <Skeleton height={20} width="60%" baseColor="#e9eaec" highlightColor="#f6f67d33" />
                                <Skeleton height={40} width="30%" className="mt-4" baseColor="#e9eaec" highlightColor="#f6f67d33" />
                            </div>
                        ))}
                    </div>

                    {/* Skeleton for table section */}
                    <h1 className="volunteer-dashboard-heading">
                        <Skeleton height={30} width={200} baseColor="#e9eaec" highlightColor="#f6f67d33" />
                    </h1>
                    <div className="volunteer-dashboard-table-container">
                        <div className="mb-4">
                            <div className="flex mb-4">
                                {["Applied", "Completed"].map((_, index) => (
                                    <div key={index} className="mr-4">
                                        <Skeleton height={40} width={100} baseColor="#e9eaec" highlightColor="#f6f67d33" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <TableSkeleton rows={5} />
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

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

export default VolunteerDashboard;