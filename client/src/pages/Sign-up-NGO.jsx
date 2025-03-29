import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate and Link
import '../stylesheet/Sign-up-NGO.css'; // Ensure CSS path is correct
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";

// --- Backend Endpoints ---
// Adjust VITE_API_BASE_URL based on your environment variable setup
// const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Fallback for local dev
const SIGNUP_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/auth/opportunity-provider/signup`;
const VERIFY_OTP_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/auth/opportunity-provider/verify-otp`;
// --- ---

const SignUpNgo = () => {
    // State for form fields
    const [organizationName, setOrganizationName] = useState('');
    const [pocName, setPocName] = useState('');
    const [pocEmail, setPocEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // Ensure format matches backend validator (+countrycode...)
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // State for OTP input

    // State for component control and feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState(''); // Store email for OTP verification step

    const navigate = useNavigate(); // Hook for navigation

    // --- Handler for Signup Form Submission ---
    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        // Structure data according to backend expectation (nested contactPerson)
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
            console.log('Sending signup data:', signupData); // Log data being sent
            const response = await axios.post(SIGNUP_ENDPOINT, signupData);
            console.log('Signup successful:', response.data);

            // If signup is successful (backend sends 201 and initiates OTP)
            setSubmittedEmail(pocEmail); // Store the email used
            setShowOtpForm(true);       // Show the OTP form
            // Optionally clear signup fields here if desired
            // setOrganizationName(''); setPocName(''); ... setPassword('');

        } catch (err) {
            console.error('Signup failed:', err.response?.data || err.message); // Log detailed error
            // Set user-friendly error message
            const errorMessage = err.response?.data?.message || 'Signup failed. Please check your details and try again.';
            setError(errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // --- Handler for OTP Form Submission ---
    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const otpData = {
            email: submittedEmail, // Send the primary contact email
            otp: otp,
        };

        try {
            console.log('Sending OTP data:', otpData);
            const response = await axios.post(VERIFY_OTP_ENDPOINT, otpData);
            console.log('OTP Verification successful:', response.data);

            // On successful verification (backend creates user, returns 200)
            alert('Account verified and created successfully! Please log in.'); // Simple feedback
            navigate('/login'); // Redirect to login page (adjust route if needed)

        } catch (err) {
            console.error('OTP Verification failed:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
            setError(errorMessage);
            setOtp(''); // Clear OTP input on failure
        } finally {
            setLoading(false);
        }
    };

    // Helper to go back from OTP form to Signup form
    const handleGoBack = () => {
        setShowOtpForm(false);
        setError(null); // Clear errors when going back
        setOtp(''); // Clear OTP input
        // Don't clear main signup fields, user might just want to correct email
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
                            <p className="sign-up-ngo-subheading">Register your organization</p> {/* Adjusted subheading */}

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
                                        placeholder="e.g., +911234567890" // Add placeholder for format
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        pattern="\+\d{10,15}" // Basic pattern validation (matches backend)
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
                                        placeholder="Enter Password (min 8 characters)" // Hint for user
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8} // Basic frontend check
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
                                {/* Use Link component */}
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
                                {/* Add Resend OTP logic/button here if implemented */}
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