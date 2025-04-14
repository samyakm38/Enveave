// filepath: d:\Enveave-SDOS\client\src\redux\hooks\useAdmin.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import adminService from '../services/adminService';
import {
    // Reset actions
    resetDeleteStatus,
    resetCreateStatus,
    
    // Organizations
    fetchOrganizationsStart,
    fetchOrganizationsSuccess,
    fetchOrganizationsFailure,
    removeOrganizationSuccess,
    
    // Volunteers
    fetchVolunteersStart,
    fetchVolunteersSuccess,
    fetchVolunteersFailure,
    removeVolunteerSuccess,
    
    // Opportunities
    fetchOpportunitiesStart,
    fetchOpportunitiesSuccess,
    fetchOpportunitiesFailure,
    removeOpportunitySuccess,
    
    // Stories
    fetchStoriesStart,
    fetchStoriesSuccess,
    fetchStoriesFailure,
    addStorySuccess,
    removeStorySuccess,
    
    // Dashboard Stats
    fetchDashboardStatsStart,
    fetchDashboardStatsSuccess,
    fetchDashboardStatsFailure,
    
    // Admin Profile
    fetchAdminProfileStart,
    fetchAdminProfileSuccess,
    fetchAdminProfileFailure,
    
    // Operations status
    deleteOperationStart,
    deleteOperationFailure,
    createOperationStart,
    createOperationFailure
} from '../slices/adminSlice';

const useAdmin = () => {
    const dispatch = useDispatch();
    
    // Organizations state and actions
    const organizations = useSelector(state => state.admin.organizations);
    const organizationsLoading = useSelector(state => state.admin.organizationsLoading);
    const organizationsError = useSelector(state => state.admin.organizationsError);
    const organizationsPagination = useSelector(state => state.admin.organizationsPagination);
    
    const loadOrganizations = useCallback(async (page = 1, limit = 10) => {
        try {
            dispatch(fetchOrganizationsStart());
            const response = await adminService.getOrganizations(page, limit);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch organizations');
            }
            dispatch(fetchOrganizationsSuccess(response));
            return response;
        } catch (error) {
            console.error('Error loading organizations:', error);
            dispatch(fetchOrganizationsFailure(error.message || 'Failed to fetch organizations'));
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    const deleteOrganization = useCallback(async (id) => {
        try {
            dispatch(deleteOperationStart());
            const response = await adminService.deleteOrganization(id);
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete organization');
            }
            dispatch(removeOrganizationSuccess({ id, ...response }));
            toast.success('Organization deleted successfully');
            return response;
        } catch (error) {
            console.error('Error deleting organization:', error);
            dispatch(deleteOperationFailure(error.message || 'Failed to delete organization'));
            toast.error(error.message || 'Failed to delete organization');
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    // Volunteers state and actions
    const volunteers = useSelector(state => state.admin.volunteers);
    const volunteersLoading = useSelector(state => state.admin.volunteersLoading);
    const volunteersError = useSelector(state => state.admin.volunteersError);
    const volunteersPagination = useSelector(state => state.admin.volunteersPagination);
    
    const loadVolunteers = useCallback(async (page = 1, limit = 10) => {
        try {
            dispatch(fetchVolunteersStart());
            const response = await adminService.getVolunteers(page, limit);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch volunteers');
            }
            dispatch(fetchVolunteersSuccess(response));
            return response;
        } catch (error) {
            console.error('Error loading volunteers:', error);
            dispatch(fetchVolunteersFailure(error.message || 'Failed to fetch volunteers'));
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    const deleteVolunteer = useCallback(async (id) => {
        try {
            dispatch(deleteOperationStart());
            const response = await adminService.deleteVolunteer(id);
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete volunteer');
            }
            dispatch(removeVolunteerSuccess({ id, ...response }));
            toast.success('Volunteer deleted successfully');
            return response;
        } catch (error) {
            console.error('Error deleting volunteer:', error);
            dispatch(deleteOperationFailure(error.message || 'Failed to delete volunteer'));
            toast.error(error.message || 'Failed to delete volunteer');
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    // Opportunities state and actions
    const opportunities = useSelector(state => state.admin.opportunities);
    const opportunitiesLoading = useSelector(state => state.admin.opportunitiesLoading);
    const opportunitiesError = useSelector(state => state.admin.opportunitiesError);
    const opportunitiesPagination = useSelector(state => state.admin.opportunitiesPagination);
    
    const loadOpportunities = useCallback(async (page = 1, limit = 10) => {
        try {
            dispatch(fetchOpportunitiesStart());
            const response = await adminService.getOpportunities(page, limit);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch opportunities');
            }
            dispatch(fetchOpportunitiesSuccess(response));
            return response;
        } catch (error) {
            console.error('Error loading opportunities:', error);
            dispatch(fetchOpportunitiesFailure(error.message || 'Failed to fetch opportunities'));
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    const deleteOpportunity = useCallback(async (id) => {
        try {
            dispatch(deleteOperationStart());
            const response = await adminService.deleteOpportunity(id);
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete opportunity');
            }
            dispatch(removeOpportunitySuccess({ id, ...response }));
            toast.success('Opportunity deleted successfully');
            return response;
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            dispatch(deleteOperationFailure(error.message || 'Failed to delete opportunity'));
            toast.error(error.message || 'Failed to delete opportunity');
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    // Stories state and actions
    const stories = useSelector(state => state.admin.stories);
    const storiesLoading = useSelector(state => state.admin.storiesLoading);
    const storiesError = useSelector(state => state.admin.storiesError);
    const storiesPagination = useSelector(state => state.admin.storiesPagination);
    
    const loadStories = useCallback(async (page = 1, limit = 10) => {
        try {
            dispatch(fetchStoriesStart());
            const response = await adminService.getStories(page, limit);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch stories');
            }
            dispatch(fetchStoriesSuccess(response));
            return response;
        } catch (error) {
            console.error('Error loading stories:', error);
            dispatch(fetchStoriesFailure(error.message || 'Failed to fetch stories'));
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    const createStory = useCallback(async (storyData) => {
        try {
            dispatch(createOperationStart());
            const response = await adminService.createStory(storyData);
            if (!response.success) {
                throw new Error(response.error || 'Failed to create story');
            }
            dispatch(addStorySuccess(response));
            toast.success('Story created successfully');
            return response;
        } catch (error) {
            console.error('Error creating story:', error);
            dispatch(createOperationFailure(error.message || 'Failed to create story'));
            toast.error(error.message || 'Failed to create story');
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    const deleteStory = useCallback(async (id) => {
        try {
            dispatch(deleteOperationStart());
            const response = await adminService.deleteStory(id);
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete story');
            }
            dispatch(removeStorySuccess({ id, ...response }));
            toast.success('Story deleted successfully');
            return response;
        } catch (error) {
            console.error('Error deleting story:', error);
            dispatch(deleteOperationFailure(error.message || 'Failed to delete story'));
            toast.error(error.message || 'Failed to delete story');
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    // Dashboard stats
    const dashboardStats = useSelector(state => state.admin.dashboardStats);
    const statsLoading = useSelector(state => state.admin.statsLoading);
    const statsError = useSelector(state => state.admin.statsError);
    
    const loadDashboardStats = useCallback(async () => {
        try {
            console.log('Loading dashboard stats...');
            dispatch(fetchDashboardStatsStart());
            const response = await adminService.getDashboardStats();
            console.log('Dashboard stats response:', response);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch dashboard statistics');
            }
            dispatch(fetchDashboardStatsSuccess(response));
            console.log('Dashboard stats loaded successfully:', response);
            return response;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            dispatch(fetchDashboardStatsFailure(error.message || 'Failed to fetch dashboard statistics'));
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    // Admin profile
    const adminProfile = useSelector(state => state.admin.adminProfile);
    const profileLoading = useSelector(state => state.admin.profileLoading);
    const profileError = useSelector(state => state.admin.profileError);
    
    const loadAdminProfile = useCallback(async () => {
        try {
            dispatch(fetchAdminProfileStart());
            const response = await adminService.getAdminProfile();
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch admin profile');
            }
            dispatch(fetchAdminProfileSuccess(response));
            return response;
        } catch (error) {
            console.error('Error loading admin profile:', error);
            dispatch(fetchAdminProfileFailure(error.message || 'Failed to fetch admin profile'));
            return { success: false, error: error.message };
        }
    }, [dispatch]);
    
    // Delete and create status
    const deleteStatus = useSelector(state => state.admin.deleteStatus);
    const deleteLoading = useSelector(state => state.admin.deleteLoading);
    const deleteError = useSelector(state => state.admin.deleteError);
    
    const createStatus = useSelector(state => state.admin.createStatus);
    const createLoading = useSelector(state => state.admin.createLoading);
    const createError = useSelector(state => state.admin.createError);
    
    const clearDeleteStatus = useCallback(() => {
        dispatch(resetDeleteStatus());
    }, [dispatch]);
    
    const clearCreateStatus = useCallback(() => {
        dispatch(resetCreateStatus());
    }, [dispatch]);
    
    return {
        // Organizations
        organizations,
        organizationsLoading,
        organizationsError,
        organizationsPagination,
        loadOrganizations,
        deleteOrganization,
        
        // Volunteers
        volunteers,
        volunteersLoading,
        volunteersError,
        volunteersPagination,
        loadVolunteers,
        deleteVolunteer,
        
        // Opportunities
        opportunities,
        opportunitiesLoading,
        opportunitiesError,
        opportunitiesPagination,
        loadOpportunities,
        deleteOpportunity,
        
        // Stories
        stories,
        storiesLoading,
        storiesError,
        storiesPagination,
        loadStories,
        createStory,
        deleteStory,
        
        // Dashboard Stats
        dashboardStats,
        statsLoading,
        statsError,
        loadDashboardStats,
        
        // Admin Profile
        adminProfile,
        profileLoading,
        profileError,
        loadAdminProfile,
        
        // Status
        deleteStatus,
        deleteLoading,
        deleteError,
        createStatus,
        createLoading,
        createError,
        clearDeleteStatus,
        clearCreateStatus
    };
};

export default useAdmin;
