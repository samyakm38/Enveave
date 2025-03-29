import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import '../stylesheet/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Track current step of the process
    const [currentStep, setCurrentStep] = useState('requestOtp'); // requestOtp, verifyOtp, resetPassword
    
    const navigate = useNavigate();

    // Step 1: Handle request OTP submission
    const handleRequestOtp = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password/request`, 
                { email }
            );
            
            setSuccess(response.data.message || 'OTP sent successfully! Please check your email.');
            setCurrentStep('verifyOtp');
        } catch (err) {
            console.error('Failed to request OTP:', err);
            setError(
                err.response?.data?.message || 
                'Failed to send OTP. Please check your email and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Handle OTP verification
    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password/verify-otp`, 
                { email, otp }
            );
            
            setSuccess(response.data.message || 'OTP verified successfully! Please set your new password.');
            setCurrentStep('resetPassword');
        } catch (err) {
            console.error('Failed to verify OTP:', err);
            setError(
                err.response?.data?.message || 
                'Invalid or expired OTP. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Handle password reset
    const handleResetPassword = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        // Validate password length
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password/reset`, 
                { email, otp, newPassword }
            );
            
            setSuccess(response.data.message || 'Password reset successful!');
            // Short delay before redirecting to login
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Failed to reset password:', err);
            setError(
                err.response?.data?.message || 
                'Failed to reset password. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Go back to previous step
    const handleGoBack = () => {
        if (currentStep === 'verifyOtp') {
            setCurrentStep('requestOtp');
        } else if (currentStep === 'resetPassword') {
            setCurrentStep('verifyOtp');
        }
        setError('');
        setSuccess('');
    };

    return (
        <div>
            <Header />
            <div className="forgot-password-page-container">
                <div className="forgot-password-container">
                    <img src='/logo-green.svg' alt="Logo" className="forgot-password-logo" />

                    {/* Step 1: Request OTP Form */}
                    {currentStep === 'requestOtp' && (
                        <>
                            <h1 className="forgot-password-heading">Forgot Password</h1>
                            <p className="forgot-password-subheading">Enter your email address to receive a verification code</p>
                            
                            {error && <div className="forgot-password-error-message">{error}</div>}
                            {success && <div className="forgot-password-success-message">{success}</div>}
                            
                            <form onSubmit={handleRequestOtp}>
                                <div className="forgot-password-form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="forgot-password-input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="forgot-password-submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </form>
                            
                            <p className="forgot-password-login-prompt">
                                Remember your password? <Link to="/login" className="forgot-password-login-link">Log in</Link>
                            </p>
                        </>
                    )}

                    {/* Step 2: Verify OTP Form */}
                    {currentStep === 'verifyOtp' && (
                        <>
                            <h1 className="forgot-password-heading">Verify OTP</h1>
                            <p className="forgot-password-subheading">
                                Enter the verification code sent to <strong>{email}</strong>
                            </p>
                            
                            {error && <div className="forgot-password-error-message">{error}</div>}
                            {success && <div className="forgot-password-success-message">{success}</div>}
                            
                            <form onSubmit={handleVerifyOtp}>
                                <div className="forgot-password-form-group">
                                    <label htmlFor="otp">Verification Code</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        className="forgot-password-input"
                                        placeholder="Enter the 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="forgot-password-submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </form>
                            
                            <p className="forgot-password-back-prompt">
                                Didn't receive OTP? Check spam folder or{' '}
                                <button onClick={handleGoBack} className="link-button-style">
                                    go back
                                </button>
                                {/* Add Resend OTP logic here if needed */}
                            </p>
                        </>
                    )}

                    {/* Step 3: Reset Password Form */}
                    {currentStep === 'resetPassword' && (
                        <>
                            <h1 className="forgot-password-heading">Reset Password</h1>
                            <p className="forgot-password-subheading">Create a new password for your account</p>
                            
                            {error && <div className="forgot-password-error-message">{error}</div>}
                            {success && <div className="forgot-password-success-message">{success}</div>}
                            
                            <form onSubmit={handleResetPassword}>
                                <div className="forgot-password-form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        className="forgot-password-input"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="forgot-password-form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="forgot-password-input"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="forgot-password-submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                            
                            <p className="forgot-password-back-prompt">
                                <button onClick={handleGoBack} className="link-button-style">
                                    Go back to verification
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;