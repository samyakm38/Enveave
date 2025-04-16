import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import volunteerService from '../services/volunteerService';

// Async thunk to fetch volunteer profile
export const fetchVolunteerProfile = createAsyncThunk(
  'volunteer/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await volunteerService.getCurrentVolunteerProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch volunteer profile');
    }
  }
);

// Async thunk to update basic details
export const updateBasicDetails = createAsyncThunk(
  'volunteer/updateBasicDetails',
  async (basicDetailsData, { rejectWithValue }) => {
    try {
      const response = await volunteerService.updateBasicDetails(basicDetailsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update basic details');
    }
  }
);

// Async thunk to update interests
export const updateInterests = createAsyncThunk(
  'volunteer/updateInterests',
  async (interestsData, { rejectWithValue }) => {
    try {
      const response = await volunteerService.updateInterests(interestsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update interests');
    }
  }
);

// Async thunk to update engagement
export const updateEngagement = createAsyncThunk(
  'volunteer/updateEngagement',
  async (engagementData, { rejectWithValue }) => {
    try {
      const response = await volunteerService.updateEngagement(engagementData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update engagement');
    }
  }
);

// Async thunk to update profile status
export const updateProfileStatus = createAsyncThunk(
  'volunteer/updateProfileStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await volunteerService.updateProfileStatus(status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile status');
    }
  }
);

// Create the volunteer slice
const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState: {
    volunteerProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetVolunteerState: (state) => {
      state.volunteerProfile = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchVolunteerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteerProfile = action.payload;
      })
      .addCase(fetchVolunteerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update basic details
      .addCase(updateBasicDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBasicDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteerProfile = action.payload;
      })
      .addCase(updateBasicDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update interests
      .addCase(updateInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteerProfile = action.payload;
      })
      .addCase(updateInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update engagement
      .addCase(updateEngagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEngagement.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteerProfile = action.payload;
      })
      .addCase(updateEngagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update profile status
      .addCase(updateProfileStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.volunteerProfile) {
          state.volunteerProfile.status = action.payload.status;
        }
      })
      .addCase(updateProfileStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetVolunteerState } = volunteerSlice.actions;

export default volunteerSlice.reducer;
