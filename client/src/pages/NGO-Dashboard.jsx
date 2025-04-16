import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import DashBoardHeader from "../components/Dashboard/Common-components/DashBoardHeader.jsx";
import DashBoardCard from "../components/Dashboard/Common-components/DashBoardCard.jsx";
import DashboardTable from "../components/Dashboard/Common-components/DashBoardTable.jsx";
import '../stylesheet/NGO-dashboard.css';
import { Link } from "react-router-dom";
import { useProviderProfile } from '../redux/hooks/useProviderProfile';
import { useOpportunities } from '../redux/hooks/useOpportunities';
import { useAuth } from '../redux/hooks/useAuth';
// Import our custom loaders
import { PageLoader, CardSkeleton, FormSkeleton, TableSkeleton } from '../components/ui/LoaderComponents.jsx';
// Import Skeleton directly from react-loading-skeleton
import Skeleton from 'react-loading-skeleton';

// --- NGO Dashboard Component ---
const NgoDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, userType } = useAuth();
    const { profile, stats, loading: profileLoading, getProviderOpportunitiesAndStats } = useProviderProfile();
    const { 
        opportunities, 
        loading: opportunitiesLoading, 
        getProviderOpportunities,
        deleteOpportunity,
    } = useOpportunities();
    
    const [activeTab, setActiveTab] = useState('Ongoing');
    const [opportunitiesList, setOpportunitiesList] = useState([]);
    // const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    // const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [profileError, setProfileError] = useState(null);
    const tabs = ['Ongoing', 'Completed'];

    // Check if user is authenticated and is a provider
    useEffect(() => {
        console.log("Dashboard auth check - currentUser:", currentUser, "userType:", userType);
        
        // Only redirect if we know the user isn't a provider
        // Allow access if token exists even if userType not loaded yet
        if (!localStorage.getItem('auth_token')) {
            navigate('/login');
        }
    }, [currentUser, userType, navigate]);

    // Fetch provider profile and opportunities data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Skip API calls if profile status is NOT_STARTED
                if (currentUser?.profileStatus === 'NOT_STARTED') {
                    console.log('Provider profile not created yet, showing setup prompt');
                    // setProfileError('profile_not_found');
                    return;
                }
                
                // Try to fetch provider data, but handle 404 errors gracefully
                try {
                    await getProviderOpportunitiesAndStats();
                    setProfileError(null);
                } catch (error) {
                    // Check if the error is because the provider profile doesn't exist
                    if (error.response && error.response.status === 404 && 
                        error.response.data.message === 'Opportunity provider profile not found') {
                        setProfileError('profile_not_found');
                    } else {
                        console.error('Error fetching provider profile data:', error);
                    }
                }
                
                // Only try to get opportunities if we didn't have a profile error
                if (!profileError) {
                    try {
                        await getProviderOpportunities();
                    } catch (error) {
                        // If this fails with the same error, we already have our profile_not_found state set
                        console.error('Error fetching provider opportunities:', error);
                    }
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
            }
        };

        // Only fetch data once when the component mounts
        fetchData();
        
        // Empty dependency array means this effect runs once on mount
    }, []);

    // Transform opportunities data for the table
    useEffect(() => {
        if (opportunities) {
            // Transform opportunities into the format expected by the table
            console.log('Transforming opportunities data:', opportunities);
            const transformedOpportunities = opportunities.map(opp => {
                const isCompleted = opp.category === 'Completed' || 
                                   (opp.applicants && opp.applicants.some(app => app.isCompleted));
                
                // Format the deadline and completion dates
                const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                };
                
                // Count accepted volunteers
                const acceptedVolunteers = opp.applicants ? 
                    opp.applicants.filter(app => app.status === 'Accepted').length : 0;
                
                // Format duration based on opportunity type
                const getDuration = (opp) => {
                    if (opp.schedule && opp.schedule.startDate && opp.schedule.endDate) {
                        const start = new Date(opp.schedule.startDate);
                        const end = new Date(opp.schedule.endDate);
                        const diffTime = Math.abs(end - start);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays === 0) return `${opp.schedule.timeCommitment}`;
                        if (diffDays === 1) return '1 Day';
                        if (diffDays < 7) return `${diffDays} Days`;
                        if (diffDays < 30) return `${Math.ceil(diffDays/7)} Weeks`;
                        if (diffDays < 365) return `${Math.ceil(diffDays/30)} Months`;
                        return `${Math.ceil(diffDays/365)} Years`;
                    }
                    return opp.schedule?.timeCommitment || 'N/A';
                };
                
                const baseOpportunity = {
                    id: opp._id,
                    name: opp.basicDetails?.title || 'Unnamed Opportunity',
                    organization: currentUser?.organizationName || 'Your Organization',
                    location: opp.schedule?.location || 'N/A',
                    volunteers: acceptedVolunteers,
                    duration: getDuration(opp),
                    category: isCompleted ? 'Completed' : 'Ongoing',
                    rawData: opp // Keep reference to original data
                };
                
                if (isCompleted) {
                    // Add completion-specific fields
                    return {
                        ...baseOpportunity,
                        completionDate: formatDate(opp.completionDate || new Date()),
                        volunteersParticipated: acceptedVolunteers,
                        outcome: opp.outcome || 'Completed successfully'
                    };
                } else {
                    // Add ongoing-specific fields
                    return {
                        ...baseOpportunity,
                        deadline: formatDate(opp.schedule?.applicationDeadline)
                    };
                }
            });
            
            setOpportunitiesList(transformedOpportunities);
        }
    }, [opportunities, currentUser]);

    // Delete opportunity handler
    const handleDeleteOpportunity = async (opportunityId, opportunityName) => {
        if (window.confirm(`Are you sure you want to delete "${opportunityName}"?`)) {
            try {
                await deleteOpportunity(opportunityId);
                // The opportunities list will be updated automatically via the Redux state
            } catch (error) {
                console.error('Error deleting opportunity:', error);
                alert(`Failed to delete opportunity: ${error.message}`);
            }
        }
    };

    
    // Handle completion submission
    // const handleCompletionSubmit = async (completionData) => {
    //     try {
    //         if (selectedOpportunity) {
    //             await completeOpportunity(selectedOpportunity.id, completionData);
    //             setIsCompletionModalOpen(false);
    //             setSelectedOpportunity(null);
    //
    //             // Refresh the data
    //             await getProviderOpportunitiesAndStats();
    //             await getProviderOpportunities();
    //         }
    //     } catch (error) {
    //         console.error('Error completing opportunity:', error);
    //         alert(`Failed to complete opportunity: ${error.message}`);
    //     }
    // };

    // Render the "Complete Your Profile" section when no profile exists
    // const renderProfileSetupPrompt = () => {
    //     return (
    //         <div className="profile-setup-container" style={{
    //             textAlign: 'center',
    //             padding: '50px',
    //             margin: '40px auto',
    //             maxWidth: '800px',
    //             backgroundColor: '#f8f9fa',
    //             borderRadius: '8px',
    //             boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    //         }}>
    //             <h2 style={{ color: '#236D4E', marginBottom: '20px' }}>Complete Your Organization Profile</h2>
    //             <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
    //                 Welcome to Enveave! Before you can create and manage opportunities,
    //                 you need to complete your organization profile. This helps volunteers
    //                 understand your mission and the work you do.
    //             </p>
    //             <Link to="/provider/profile/edit">
    //                 <button style={{
    //                     backgroundColor: '#236D4E',
    //                     color: 'white',
    //                     border: 'none',
    //                     padding: '12px 30px',
    //                     borderRadius: '4px',
    //                     fontSize: '16px',
    //                     cursor: 'pointer',
    //                     fontWeight: 'bold'
    //                 }}>
    //                     Complete Profile Now
    //                 </button>
    //             </Link>
    //         </div>
    //     );
    // };

    // Prepare card data with real stats
    const realCardData = [
        { title: 'Total Campaigns Running', count: stats?.totalOpportunities || 0, color: '#FD2828' },
        { title: 'Total Volunteers', count: stats?.totalVolunteers || 0, color: '#2C66E4' },
        { title: 'Completed Projects', count: stats?.completedProjects || 0, color: '#236D4E' }
    ];

    // Prepare user data with real profile info
    const realUserData = {
        ProfilePictureURL: profile?.organizationDetails?.logo || '/NGO-profile-pic.svg',
        userName: currentUser?.organizationName || 'Organization',
        status: 'Active',
        completionPercentage: profile?.profileCompletion?.step1 && profile?.profileCompletion?.step2 ? 100 : (profile?.profileCompletion?.step1)? 50 : 0,
        formLink: '/provider/profile/edit'
    };

    // Column definitions
    const ongoingColumns = [
        { header: 'Opportunity name', accessor: 'name', cellClassName: 'ngo-cell-name',
            cellRenderer: (name, row) => ( // Render name as a Link
                <Link to={`/provider/dashboard/opportunity/${row.id}`} title={`View details for ${name}`}>
                    {name}
                </Link>
            )
        },
        { header: 'Organization', accessor: 'organization' },
        { header: 'Location', accessor: 'location' },
        { header: 'Total volunteers', accessor: 'volunteers', cellClassName: 'ngo-cell-number' },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Application Deadline', accessor: 'deadline' },
        {
            header: 'Action',
            accessor: 'id',
            cellClassName: 'ngo-cell-action',
            cellRenderer: (id, row) => (
                <div className="ngo-action-buttons">
                    <button
                        onClick={() => handleDeleteOpportunity(id, row.name)}
                        className="ngo-delete-button"
                        title={`Delete ${row.name}`}
                        aria-label={`Delete ${row.name}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                </div>
            )
        },
    ];

    const completedColumns = [
        { header: 'Opportunity name', accessor: 'name', cellClassName: 'ngo-cell-name',
            cellRenderer: (name, row) => ( // Render name as a Link
                <Link to={`/provider/dashboard/opportunity/${row.id}`} title={`View details for ${name}`}>
                    {name}
                </Link>
            )
        },
        { header: 'Location', accessor: 'location' },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Completion Date', accessor: 'completionDate'},
        { header: 'Volunteers Participated', accessor: 'volunteersParticipated', cellClassName: 'ngo-cell-number' },

    ];

    // Dynamic selections based on active tab
    const activeColumns = useMemo(() => {
        return activeTab === 'Completed' ? completedColumns : ongoingColumns;
    }, [activeTab]);

    const filteredData = useMemo(() => {
        console.log('Filtering data for active tab:', activeTab);
        console.log('Opportunities list:', opportunitiesList);
        return opportunitiesList.filter(opp => opp.category === activeTab);
    }, [activeTab, opportunitiesList]);

    // // Show profile setup prompt if profile doesn't exist
    // if (profileError === 'profile_not_found') {
    //     return (
    //         <div>
    //             <Header />
    //             {renderProfileSetupPrompt()}
    //             <Footer />
    //         </div>
    //     );
    // }    // Loading state
    if (profileLoading || opportunitiesLoading) {
        return (
            <div>
                <Header />
                <div className="NGO-dashboard-container">
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
                    
                    {/* Skeleton for cards section */}
                    <div className="NGO-dashboard-card-container mb-8">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <Skeleton height={20} width="60%" baseColor="#e9eaec" highlightColor="#f6f67d33" />
                                <Skeleton height={40} width="30%" className="mt-4" baseColor="#e9eaec" highlightColor="#f6f67d33" />
                            </div>
                        ))}
                    </div>
                    
                    {/* Skeleton for heading and button */}
                    <div className="NGO-dashboard-heading-container mb-6">
                        <Skeleton height={30} width={200} baseColor="#e9eaec" highlightColor="#f6f67d33" />
                        <div>
                            <Skeleton height={40} width={150} baseColor="#e9eaec" highlightColor="#f6f67d33" />
                        </div>
                    </div>
                    
                    {/* Skeleton for table */}
                    <div className="NGO-dashboard-table-container">
                        <div className="mb-4">
                            <div className="flex mb-4">
                                {["Ongoing", "Completed"].map((_, index) => (
                                    <div key={index} className="mr-4">
                                        <Skeleton height={40} width={100} baseColor="#e9eaec" highlightColor="#f6f67d33" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <TableSkeleton rows={5} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <DashBoardHeader
                ProfilePictureURL={realUserData.ProfilePictureURL}
                userName={realUserData.userName}
                status={realUserData.status}
                completionPercentage={realUserData.completionPercentage}
                formLink={realUserData.formLink}
            />

            {/* Cards Section */}
            <div className="NGO-dashboard-card-container">
                {realCardData.map((card, index) => (
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
                    My Opportunities
                </h1>
                <Link to='/create-opportunity'>
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
                    className="dashboard-table-ngo-theme"
                />
            </div>
            
            {/*/!* Completion Modal *!/*/}
            {/*{isCompletionModalOpen && selectedOpportunity && (*/}
            {/*    <CompletionModal*/}
            {/*        isOpen={isCompletionModalOpen}*/}
            {/*        onClose={() => {*/}
            {/*            setIsCompletionModalOpen(false);*/}
            {/*            setSelectedOpportunity(null);*/}
            {/*        }}*/}
            {/*        onSubmit={handleCompletionSubmit}*/}
            {/*        opportunityName={selectedOpportunity.name}*/}
            {/*    />*/}
            {/*)}*/}

            <Footer />
        </div>
    );
};

export default NgoDashboard;