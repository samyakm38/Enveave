import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  userType: null, // 'volunteer', 'provider', or 'admin'
  token: localStorage.getItem('auth_token') || null, // Initialize from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.user;
      state.userType = action.payload.userType;
      state.token = action.payload.token; // Store token in Redux state
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.userType = null;
      state.token = null; // Clear token on logout
      state.loading = false;
      state.error = null;
      // Also remove from localStorage
      localStorage.removeItem('auth_token');
    },
    updateUserProfile: (state, action) => {
      state.currentUser = {...state.currentUser, ...action.payload};
    },
    registrationComplete: (state) => {
      state.loading = false;
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      // Also store in localStorage for persistence
      if (action.payload) {
        localStorage.setItem('auth_token', action.payload);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  clearError,
  logout,
  updateUserProfile,
  registrationComplete,
  setToken
} = authSlice.actions;

export default authSlice.reducer;