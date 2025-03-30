import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  userApplications: [], // Applications made by the current volunteer
  opportunityApplications: [], // Applications for a specific opportunity
  currentApplication: null,
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload;
      state.error = null;
    },
    fetchUserApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.userApplications = action.payload;
      state.error = null;
    },
    fetchOpportunityApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.opportunityApplications = action.payload;
      state.error = null;
    },
    fetchApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload;
    },
    addApplication: (state, action) => {
      state.applications.push(action.payload);
      state.userApplications.push(action.payload);
      
      // If this application is for the current opportunity being viewed
      if (action.payload.opportunity === state.currentApplication?.opportunity) {
        state.opportunityApplications.push(action.payload);
      }
    },
    updateApplication: (state, action) => {
      const updateInList = (list) => {
        const index = list.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          list[index] = action.payload;
        }
        return list;
      };
      
      state.applications = updateInList(state.applications);
      state.userApplications = updateInList(state.userApplications);
      state.opportunityApplications = updateInList(state.opportunityApplications);
      
      if (state.currentApplication?._id === action.payload._id) {
        state.currentApplication = action.payload;
      }
    },
    deleteApplication: (state, action) => {
      const removeFromList = (list) => 
        list.filter(app => app._id !== action.payload);
      
      state.applications = removeFromList(state.applications);
      state.userApplications = removeFromList(state.userApplications);
      state.opportunityApplications = removeFromList(state.opportunityApplications);
      
      if (state.currentApplication?._id === action.payload) {
        state.currentApplication = null;
      }
    },
  },
});

export const {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchUserApplicationsSuccess,
  fetchOpportunityApplicationsSuccess,
  fetchApplicationsFailure,
  setCurrentApplication,
  addApplication,
  updateApplication,
  deleteApplication,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;