import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  userType: null, // 'volunteer', 'provider', or 'admin'
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
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.userType = null;
      state.loading = false;
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.currentUser = {...state.currentUser, ...action.payload};
    },
    registrationComplete: (state) => {
      state.loading = false;
      state.error = null;
    }
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout,
  updateUserProfile,
  registrationComplete
} = authSlice.actions;

export default authSlice.reducer;