import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation
import axios from 'axios'; // Import axios for API calls
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import '../stylesheet/Login.css';

const Login = () => {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // For navigation after login

    // Handle form submission
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);

        try {
            // Make API call to the unified login endpoint
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, 
                { email, password }
            );

            // Store token and user data in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userType', response.data.userType);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect based on user type
            if (response.data.userType === 'admin') {
                navigate('/admin/dashboard'); // Redirect to admin dashboard
            } else if (response.data.userType === 'provider') {
                navigate('/provider/dashboard'); // Redirect to NGO dashboard
            } else if (response.data.userType === 'volunteer') {
                navigate('/volunteer/dashboard'); // Redirect to volunteer dashboard
            } else {
                navigate('/'); // Fallback to home page
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError(
                err.response?.data?.message || 
                'Login failed. Please check your credentials and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />

            {/* Login Form Section */}
            <div className="login-page-container">
                <div className="login-container">
                    <img src='/logo-green.svg' alt="Logo" className="login-logo" />

                    <h1 className="login-heading">Log in to your account</h1>
                    <p className="login-subheading">Welcome back! Please enter your details.</p>

                    {/* Display error message if any */}
                    {error && <div className="login-error-message">{error}</div>}

                    <form onSubmit={handleLoginSubmit}>
                        {/* Email Field */}
                        <div className="login-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="login-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="login-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="login-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Remember Me & Forgot Password Row */}
                        <div className="login-options-row">
                            <Link to="/forgot-password" className="login-forgot-password">
                                Forgot password
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <button 
                            type="submit" 
                            className="login-submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Sign Up Prompt */}
                    <p className="login-signup-prompt">
                        Don&#39;t have an account? <a href="/sign-up-option" className="login-signup-link">Sign up</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;