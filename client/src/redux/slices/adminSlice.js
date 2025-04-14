// filepath: d:\Enveave-SDOS\client\src\redux\slices\adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

// --- Initial State ---
const initialState = {
    // Organizations
    organizations: [],
    organizationsPagination: { total: 0, page: 1, pages: 1, limit: 10 },
    organizationsLoading: false,
    organizationsError: null,
    
    // Volunteers
    volunteers: [],
    volunteersPagination: { total: 0, page: 1, pages: 1, limit: 10 },
    volunteersLoading: false,
    volunteersError: null,
    
    // Opportunities
    opportunities: [],
    opportunitiesPagination: { total: 0, page: 1, pages: 1, limit: 10 },
    opportunitiesLoading: false,
    opportunitiesError: null,
    
    // Stories
    stories: [],
    storiesPagination: { total: 0, page: 1, pages: 1, limit: 10 },
    storiesLoading: false,
    storiesError: null,
    
    // Dashboard stats
    dashboardStats: {
        totalOrganizations: 0,
        totalVolunteers: 0,
        totalOpportunities: 0,
        totalStories: 0
    },
    statsLoading: false,
    statsError: null,
    
    // Admin profile
    adminProfile: null,
    profileLoading: false,
    profileError: null,
    
    // Delete operations status
    deleteStatus: null,
    deleteLoading: false,
    deleteError: null,
    
    // Create operations status
    createStatus: null,
    createLoading: false,
    createError: null
};

// --- Admin Slice ---
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // Reset status actions
        resetDeleteStatus: (state) => {
            state.deleteStatus = null;
            state.deleteError = null;
            state.deleteLoading = false;
        },
        resetCreateStatus: (state) => {
            state.createStatus = null;
            state.createError = null;
            state.createLoading = false;
        },
        
        // Organizations
        fetchOrganizationsStart: (state) => {
            state.organizationsLoading = true;
            state.organizationsError = null;
        },
        fetchOrganizationsSuccess: (state, action) => {
            state.organizationsLoading = false;
            state.organizations = action.payload.data;
            state.organizationsPagination = action.payload.pagination;
        },
        fetchOrganizationsFailure: (state, action) => {
            state.organizationsLoading = false;
            state.organizationsError = action.payload;
        },
        removeOrganizationSuccess: (state, action) => {
            state.deleteLoading = false;
            state.deleteStatus = 'success';
            state.organizations = state.organizations.filter(org => org.id !== action.payload.id);
        },
        
        // Volunteers
        fetchVolunteersStart: (state) => {
            state.volunteersLoading = true;
            state.volunteersError = null;
        },
        fetchVolunteersSuccess: (state, action) => {
            state.volunteersLoading = false;
            state.volunteers = action.payload.data;
            state.volunteersPagination = action.payload.pagination;
        },
        fetchVolunteersFailure: (state, action) => {
            state.volunteersLoading = false;
            state.volunteersError = action.payload;
        },
        removeVolunteerSuccess: (state, action) => {
            state.deleteLoading = false;
            state.deleteStatus = 'success';
            state.volunteers = state.volunteers.filter(vol => vol.id !== action.payload.id);
        },
        
        // Opportunities
        fetchOpportunitiesStart: (state) => {
            state.opportunitiesLoading = true;
            state.opportunitiesError = null;
        },
        fetchOpportunitiesSuccess: (state, action) => {
            state.opportunitiesLoading = false;
            state.opportunities = action.payload.data;
            state.opportunitiesPagination = action.payload.pagination;
        },
        fetchOpportunitiesFailure: (state, action) => {
            state.opportunitiesLoading = false;
            state.opportunitiesError = action.payload;
        },
        removeOpportunitySuccess: (state, action) => {
            state.deleteLoading = false;
            state.deleteStatus = 'success';
            state.opportunities = state.opportunities.filter(opp => opp.id !== action.payload.id);
        },
        
        // Stories
        fetchStoriesStart: (state) => {
            state.storiesLoading = true;
            state.storiesError = null;
        },
        fetchStoriesSuccess: (state, action) => {
            state.storiesLoading = false;
            state.stories = action.payload.data;
            state.storiesPagination = action.payload.pagination;
        },
        fetchStoriesFailure: (state, action) => {
            state.storiesLoading = false;
            state.storiesError = action.payload;
        },
        addStorySuccess: (state, action) => {
            state.createLoading = false;
            state.createStatus = 'success';
            // If we have story data in the payload, add it to the stories array
            if (action.payload.data) {
                state.stories.unshift(action.payload.data);
            }
        },
        removeStorySuccess: (state, action) => {
            state.deleteLoading = false;
            state.deleteStatus = 'success';
            state.stories = state.stories.filter(story => story.id !== action.payload.id);
        },
        
        // Admin Profile
        fetchAdminProfileStart: (state) => {
            state.profileLoading = true;
            state.profileError = null;
        },
        fetchAdminProfileSuccess: (state, action) => {
            state.profileLoading = false;
            state.adminProfile = action.payload.data;
        },
        fetchAdminProfileFailure: (state, action) => {
            state.profileLoading = false;
            state.profileError = action.payload;
        },
        
        // Dashboard Stats
        fetchDashboardStatsStart: (state) => {
            state.statsLoading = true;
            state.statsError = null;
        },
        fetchDashboardStatsSuccess: (state, action) => {
            state.statsLoading = false;
            state.dashboardStats = action.payload.data || {
                totalOrganizations: 0,
                totalVolunteers: 0,
                totalOpportunities: 0,
                totalStories: 0
            };
        },
        fetchDashboardStatsFailure: (state, action) => {
            state.statsLoading = false;
            state.statsError = action.payload;
        },
        
        // Delete operation status
        deleteOperationStart: (state) => {
            state.deleteLoading = true;
            state.deleteError = null;
        },
        deleteOperationFailure: (state, action) => {
            state.deleteLoading = false;
            state.deleteError = action.payload;
        },
        
        // Create operation status
        createOperationStart: (state) => {
            state.createLoading = true;
            state.createError = null;
        },
        createOperationFailure: (state, action) => {
            state.createLoading = false;
            state.createError = action.payload;
        }
    }
});

// Export actions
export const {
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
    
    // Admin Profile
    fetchAdminProfileStart,
    fetchAdminProfileSuccess,
    fetchAdminProfileFailure,
    
    // Dashboard Stats
    fetchDashboardStatsStart,
    fetchDashboardStatsSuccess,
    fetchDashboardStatsFailure,
    
    // Operations status
    deleteOperationStart,
    deleteOperationFailure,
    createOperationStart,
    createOperationFailure
} = adminSlice.actions;

// Export reducer
export default adminSlice.reducer;
