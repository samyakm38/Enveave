import { createSlice } from '@reduxjs/toolkit';

// Initial state for provider profile
const initialState = {
  profile: null,
  stats: {
    totalOpportunities: 0,
    totalVolunteers: 0, 
    completedProjects: 0
  },
  loading: false,
  error: null
};

// Provider profile slice
const providerProfileSlice = createSlice({
  name: 'providerProfile',
  initialState,
  reducers: {
    fetchProviderStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProviderSuccess(state, action) {
      state.loading = false;
      state.profile = action.payload;
    },
    fetchProviderStatsSuccess(state, action) {
      state.loading = false;
      state.stats = action.payload;
    },
    fetchProviderFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateProviderProfile(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    resetProviderProfile() {
      return initialState;
    }
  }
});

// Extract actions and reducer
export const {
  fetchProviderStart,
  fetchProviderSuccess,
  fetchProviderStatsSuccess,
  fetchProviderFailure,
  updateProviderProfile,
  resetProviderProfile
} = providerProfileSlice.actions;

export default providerProfileSlice.reducer;