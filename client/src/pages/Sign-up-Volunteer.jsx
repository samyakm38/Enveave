import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../stylesheet/Sign-up-volunteer.css';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";

// --- Assumed Backend Endpoints ---
// You might need to adjust these based on your actual backend setup
const SIGNUP_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/auth/volunteer/signup`;
const VERIFY_OTP_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/auth/volunteer/verify-otp`; // **Assumption:** Endpoint to verify OTP
// --- ---

function SignUpVolunteer() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // State for OTP input

    const [loading, setLoading] = useState(false); // Loading state for API calls
    const [error, setError] = useState(null); // Error message state
    const [showOtpForm, setShowOtpForm] = useState(false); // Toggle between forms
    const [submittedEmail, setSubmittedEmail] = useState(''); // Store email for OTP verification

    const navigate = useNavigate(); // Hook for navigation

    // --- Handler for Signup Form Submission ---
    const handleSignupSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setError(null); // Clear previous errors
        setLoading(true); // Start loading

        const signupData = {
            name: name,
            email: email,
            password: password,
            profileStatus: "NOT_STARTED" // As per your example payload
        };

        try {
            // Make the POST request to the signup endpoint
            const response = await axios.post(SIGNUP_ENDPOINT, signupData);

            console.log('Signup successful:', response.data); // Log success response (optional)

            // Assuming success means OTP was sent and we should show the OTP form
            setSubmittedEmail(email); // Store the email for verification step
            setShowOtpForm(true); // Show the OTP form
            // Optionally clear signup form fields
            // setName('');
            // setEmail('');
            // setPassword('');

        } catch (err) {
            console.error('Signup failed:', err);
            // Set error message - try to get specific message from backend response
            const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    // --- Handler for OTP Form Submission ---
    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const otpData = {
            email: submittedEmail, // Send the email used during signup
            otp: otp,             // Send the entered OTP
        };

        try {
            // Make the POST request to the OTP verification endpoint
            // **IMPORTANT:** Replace VERIFY_OTP_ENDPOINT if your endpoint is different
            const response = await axios.post(VERIFY_OTP_ENDPOINT, otpData);

            console.log('OTP Verification successful:', response.data);

            // On successful verification, navigate the user
            alert('Account verified successfully! Please log in.'); // Simple feedback
            navigate('/login'); // Redirect to login page (or dashboard)

        } catch (err) {
            console.error('OTP Verification failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Invalid or expired OTP. Please try again.';
            setError(errorMessage);
            setOtp(''); // Clear OTP input on failure
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="sign-up-volunteer-main-container">
                <div className="sign-up-volunteer-container">
                    <img src='/logo-green.svg' alt="Company Logo" className="sign-up-volunteer-logo" />

                    {/* --- Conditionally render Signup Form or OTP Form --- */}
                    {!showOtpForm ? (
                        <>
                            {/* --- Signup Form --- */}
                            <h1 className="sign-up-volunteer-heading">Create an account</h1>
                            <p className="sign-up-volunteer-subheading">Start your volunteering journey</p>

                            <form onSubmit={handleSignupSubmit}>
                                {/* Name Input */}
                                <div className="sign-up-volunteer-form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="sign-up-volunteer-input"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={loading} // Disable during loading
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="sign-up-volunteer-form-group">
                                    <label htmlFor="email">Email-ID</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="sign-up-volunteer-input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading} // Disable during loading
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="sign-up-volunteer-form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="sign-up-volunteer-input"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading} // Disable during loading
                                    />
                                </div>

                                {/* Display Error Messages */}
                                {error && <p className="sign-up-volunteer-error">{error}</p>}

                                <button type="submit" className="sign-up-volunteer-submit-button" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Get started'}
                                </button>
                            </form>

                            <div className="sign-up-volunteer-separator">
                                <span>OR</span>
                            </div>

                            <p className="sign-up-volunteer-login-prompt">
                                Already have an account? <Link to="/login" className="sign-up-volunteer-login-link">Log in</Link>
                            </p>
                        </>
                    ) : (
                        <>
                            {/* --- OTP Verification Form --- */}
                            <h1 className="sign-up-volunteer-heading">Verify Your Email</h1>
                            <p className="sign-up-volunteer-subheading">
                                An OTP has been sent to <strong>{submittedEmail}</strong>. Please enter it below.
                            </p>

                            <form onSubmit={handleOtpSubmit}>
                                <div className="sign-up-volunteer-form-group">
                                    <label htmlFor="otp">Enter OTP</label>
                                    <input
                                        type="text" // Can use type="number" but text is often better for OTPs
                                        id="otp"
                                        className="sign-up-volunteer-input"
                                        placeholder="Enter the 6-digit OTP" // Adjust if OTP length differs
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={6} // Example: Set max length
                                        disabled={loading}
                                    />
                                </div>

                                {/* Display Error Messages */}
                                {error && <p className="sign-up-volunteer-error">{error}</p>}

                                <button type="submit" className="sign-up-volunteer-submit-button" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify Account'}
                                </button>
                                {/* Optional: Add a "Resend OTP" button here (requires another backend endpoint) */}
                            </form>

                            {/* Link to go back or maybe login */}
                            <p className="sign-up-volunteer-login-prompt" style={{marginTop: '15px'}}>
                                Didn&#39;t receive OTP? Check spam or{' '}
                                <button onClick={() => setShowOtpForm(false)} className="link-button-style">
                                    go back
                                </button>
                                {/* Add Resend OTP logic here if needed */}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default SignUpVolunteer;

// Add some basic styling for error messages and link-button if not in your CSS
/* In your Sign-up-volunteer.css (or add a <style> tag) */
/*
.sign-up-volunteer-error {
    color: red;
    font-size: 0.9em;
    margin-top: -10px;
    margin-bottom: 15px;
    text-align: center;
}

.link-button-style {
    background: none;
    border: none;
    padding: 0;
    color: #007bff; // Or your link color
    text-decoration: underline;
    cursor: pointer;
    font-size: inherit; // Inherit font size from parent
}
*/