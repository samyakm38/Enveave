import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/hooks';
import { useToast } from '../components/main components/ToastContext';
import '../stylesheet/Sign-up-NGO.css';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";

const SignUpNgo = () => {
    // State for form fields
    const [organizationName, setOrganizationName] = useState('');
    const [pocName, setPocName] = useState('');
    const [pocEmail, setPocEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    // State for component control
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    // Use our custom Redux auth hook
    const { registerProvider, verifyProviderOtp, loading, error } = useAuth();
    const navigate = useNavigate();
    // Use our custom toast hook
    const { showToast } = useToast();

    // Handler for Signup Form Submission
    const handleSignupSubmit = async (event) => {
        event.preventDefault();

        // Structure data according to backend expectation
        const signupData = {
            organizationName: organizationName,
            contactPerson: {
                name: pocName,
                email: pocEmail,
                phoneNumber: phoneNumber,
            },
            password: password,
            profileStatus: "NOT_STARTED"
        };

        try {
            // Use our Redux hook to register provider
            const response = await registerProvider(signupData);
            console.log('Signup successful:', response);
            
            showToast('Organization registered successfully! Please verify with OTP.', 'SUCCESS');
            setSubmittedEmail(pocEmail);
            setShowOtpForm(true);
        } catch (err) {
            // Error is handled by the hook and stored in error state
            console.error('Signup failed');
            showToast('Registration failed. Please try again.', 'ERROR');
        }
    };

    // Handler for OTP Form Submission
    const handleOtpSubmit = async (event) => {
        event.preventDefault();

        try {
            // Use our Redux hook to verify OTP
            await verifyProviderOtp(submittedEmail, otp);
            
            showToast('Account verified successfully! Redirecting to login...', 'SUCCESS');
            // Give the user time to see the toast before redirecting
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            // Error is handled by the hook
            console.error('OTP Verification failed');
            showToast('OTP verification failed. Please try again.', 'ERROR');
            setOtp('');
        }
    };

    // Helper to go back from OTP form to Signup form
    const handleGoBack = () => {
        setShowOtpForm(false);
        setOtp(''); // Clear OTP input
    };

    return (
        <>
            <Header />
            <div className="sign-up-ngo-main-container">
                <div className="sign-up-ngo-container">
                    <img src='/logo-green.svg' alt="Organization Logo" className="sign-up-ngo-logo" />

                    {/* Conditionally Render Forms */}
                    {!showOtpForm ? (
                        <>
                            {/* --- Signup Form --- */}
                            <h1 className="sign-up-ngo-heading">Create an account</h1>
                            <p className="sign-up-ngo-subheading">Register your organization</p>

                            <form onSubmit={handleSignupSubmit}>
                                {/* Organization Name */}
                                <div className="sign-up-ngo-form-group">
                                    <label htmlFor="organizationName">Organization name</label>
                                    <input
                                        type="text"
                                        id="organizationName"
                                        className="sign-up-ngo-input"
                                        placeholder="Enter organization name"
                                        value={organizationName}
                                        onChange={(e) => setOrganizationName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* POC Name */}
                                <div className="sign-up-ngo-form-group">
                                    <label htmlFor="pocName">Point of Contact Name</label>
                                    <input
                                        type="text"
                                        id="pocName"
                                        className="sign-up-ngo-input"
                                        placeholder="Enter contact person's name"
                                        value={pocName}
                                        onChange={(e) => setPocName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* POC Email */}
                                <div className="sign-up-ngo-form-group">
                                    <label htmlFor="pocEmail">Point of Contact Email</label>
                                    <input
                                        type="email"
                                        id="pocEmail"
                                        className="sign-up-ngo-input"
                                        placeholder="Enter contact person's email"
                                        value={pocEmail}
                                        onChange={(e) => setPocEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="sign-up-ngo-form-group">
                                    <label htmlFor="phoneNumber">Contact Phone number</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        className="sign-up-ngo-input"
                                        placeholder="e.g., +911234567890"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        pattern="\+\d{10,15}"
                                        title="Phone number must be in international format, e.g., +911234567890"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Password */}
                                <div className="sign-up-ngo-form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="sign-up-ngo-input"
                                        placeholder="Enter Password (min 8 characters)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Display Error Messages */}
                                {error && <p className="sign-up-ngo-error">{error}</p>}

                                {/* Submit Button */}
                                <button type="submit" className="sign-up-ngo-submit-button" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Get started'}
                                </button>
                            </form>

                            {/* Separator */}
                            <div className="sign-up-ngo-separator">
                                <span>OR</span>
                            </div>

                            {/* Login Prompt */}
                            <p className="sign-up-ngo-login-prompt">
                                Already have an account? <Link to="/login" className="sign-up-ngo-login-link">Log in</Link>
                            </p>
                        </>
                    ) : (
                        <>
                            {/* --- OTP Verification Form --- */}
                            <h1 className="sign-up-ngo-heading">Verify Your Email</h1>
                            <p className="sign-up-ngo-subheading">
                                An OTP has been sent to the contact email <strong>{submittedEmail}</strong>. Please enter it below.
                            </p>

                            <form onSubmit={handleOtpSubmit}>
                                <div className="sign-up-ngo-form-group">
                                    <label htmlFor="otp">Enter OTP</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        className="sign-up-ngo-input"
                                        placeholder="Enter the 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Display Error Messages */}
                                {error && <p className="sign-up-ngo-error">{error}</p>}

                                <button type="submit" className="sign-up-ngo-submit-button" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify & Create Account'}
                                </button>
                            </form>

                            {/* Go Back / Resend Prompt */}
                            <p className="sign-up-ngo-login-prompt" style={{ marginTop: '15px' }}>
                                Didn&#39;t receive OTP? Check spam folder or{' '}
                                <button onClick={handleGoBack} className="link-button-style">
                                    go back to edit details
                                </button>
                                .
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignUpNgo;