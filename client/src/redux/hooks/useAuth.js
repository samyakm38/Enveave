import { useSelector, useDispatch } from 'react-redux';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  clearError,
  logout as logoutAction,
  updateUserProfile,
  registrationComplete
} from '../slices/authSlice';
import { authService } from '../services/authService';

// A custom hook for handling authentication-related state and actions
export const useAuth = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error, userType } = useSelector((state) => state.auth);

  // Clear error messages
  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  // Login user
  const login = async (email, password) => {
    try {
      dispatch(loginStart());
      const data = await authService.login(email, password);
      dispatch(loginSuccess({ 
        user: data.user, 
        userType: data.user.role // Assuming the API returns a role property
      }));
      return data;
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Wrong email or password'));
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    dispatch(logoutAction());
  };

  // Register volunteer
  const registerVolunteer = async (formData) => {
    try {
      dispatch(loginStart());
      const data = await authService.volunteerSignup(formData);
      dispatch(registrationComplete());
      return data;
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Registration failed'));
      throw error;
    }
  };

  // Register opportunity provider
  const registerProvider = async (formData) => {
    try {
      dispatch(loginStart());
      const data = await authService.providerSignup(formData);
      dispatch(registrationComplete());
      return data;
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Registration failed'));
      throw error;
    }
  };

  // Verify volunteer OTP
  const verifyVolunteerOtp = async (email, otp) => {
    try {
      dispatch(loginStart());
      const data = await authService.verifyVolunteerOtp(email, otp);
      dispatch(loginSuccess({ 
        user: data.user, 
        userType: 'volunteer'
      }));
      return data;
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'OTP verification failed'));
      throw error;
    }
  };

  // Verify provider OTP
  const verifyProviderOtp = async (email, otp) => {
    try {
      dispatch(loginStart());
      const data = await authService.verifyProviderOtp(email, otp);
      dispatch(loginSuccess({ 
        user: data.user, 
        userType: 'provider'
      }));
      return data;
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'OTP verification failed'));
      throw error;
    }
  };

  // Update user profile
  const updateProfile = (userData) => {
    dispatch(updateUserProfile(userData));
  };

  // Password reset helpers
  const requestPasswordReset = async (email) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const verifyPasswordResetOtp = async (email, otp) => {
    try {
      const data = await authService.verifyPasswordResetOtp(email, otp);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const data = await authService.resetPassword(email, otp, newPassword);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    currentUser,
    userType,
    isAuthenticated: !!currentUser,
    isVolunteer: userType === 'volunteer',
    isProvider: userType === 'provider',
    loading,
    error,
    clearErrorMessage,
    login,
    logout,
    registerVolunteer,
    registerProvider,
    verifyVolunteerOtp,
    verifyProviderOtp,
    updateProfile,
    requestPasswordReset,
    verifyPasswordResetOtp,
    resetPassword
  };
};

export default useAuth;