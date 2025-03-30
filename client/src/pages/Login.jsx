import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import { useAuth } from '../redux/hooks';
import '../stylesheet/Login.css';

const Login = () => {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Use our custom auth hook from Redux
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    // Handle form submission
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        
        try {
            // Use the login method from our auth hook
            const response = await login(email, password);
            
            // Redirect based on user type
            if (response.userType === 'admin') {
                navigate('/admin/dashboard');
            } else if (response.userType === 'provider') {
                navigate('/provider/dashboard');
            } else if (response.userType === 'volunteer') {
                navigate('/volunteer/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            // Error handling is managed by the hook
            console.error('Login attempt failed');
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
                        Don&#39;t have an account? <Link to="/sign-up-option" className="login-signup-link">Sign up</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;