import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/hooks';
import { useToast } from '../components/main components/ToastContext';
import '../stylesheet/Sign-up-volunteer.css';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";

function SignUpVolunteer() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [showOtpForm, setShowOtpForm] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    // Use our custom Redux auth hook
    const { registerVolunteer, verifyVolunteerOtp, loading, error } = useAuth();
    const navigate = useNavigate();
    // Use our custom toast hook
    const { showToast } = useToast();

    // Handler for Signup Form Submission
    const handleSignupSubmit = async (event) => {
        event.preventDefault();

        const signupData = {
            name: name,
            email: email,
            password: password,
            profileStatus: "NOT_STARTED"
        };

        try {
            // Use our Redux hook to register volunteer
            const response = await registerVolunteer(signupData);
            console.log('Signup successful:', response);
            
            showToast('Account created successfully! Please verify with OTP.', 'SUCCESS');
            setSubmittedEmail(email);
            setShowOtpForm(true);
        } catch (err) {
            // Error is handled by the hook and stored in error state
            console.error('Signup failed');
            showToast('Signup failed. Please try again.', 'ERROR');
        }
    };

    // Handler for OTP Form Submission
    const handleOtpSubmit = async (event) => {
        event.preventDefault();

        try {
            // Use our Redux hook to verify OTP
            await verifyVolunteerOtp(submittedEmail, otp);
            
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        type="text"
                                        id="otp"
                                        className="sign-up-volunteer-input"
                                        placeholder="Enter the 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Display Error Messages */}
                                {error && <p className="sign-up-volunteer-error">{error}</p>}

                                <button type="submit" className="sign-up-volunteer-submit-button" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify Account'}
                                </button>
                            </form>

                            <p className="sign-up-volunteer-login-prompt" style={{marginTop: '15px'}}>
                                Didn&#39;t receive OTP? Check spam or{' '}
                                <button onClick={handleGoBack} className="link-button-style">
                                    go back
                                </button>
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