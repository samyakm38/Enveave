import React, { useState } from 'react';
import Header from "../components/main components/Header.jsx"; // Assuming this path is correct
import Footer from "../components/main components/Footer.jsx"; // Assuming this path is correct
// import './Login.css'; // Import the CSS file for Login component
// Replace 'path/to/your/logo.png' with the actual path to your logo image
// import logo from './logo.png'; // Assuming logo.png is in the same folder as Login.js
import '../stylesheet/Login.css'
const Login = () => {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState(false);

    // Handle form submission
    const handleLoginSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Login attempt:', {
            email,
            password,
        });
        // Add your authentication logic here (e.g., API call)
    };

    return (
        <div>
            <Header />

            {/* Login Form Section */}
            <div className="login-page-container"> {/* Wrapper for centering */}
                <div className="login-container">
                    <img src='/logo-green.svg' alt="Logo" className="login-logo" />

                    <h1 className="login-heading">Log in to your account</h1>
                    <p className="login-subheading">Welcome back! Please enter your details.</p>

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
                            />
                        </div>

                        {/* Password Field */}
                        <div className="login-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="login-input"
                                placeholder="••••••••" // Placeholder shown in image
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Remember Me & Forgot Password Row */}
                        <div className="login-options-row">
                            {/*<div className="login-remember-me">*/}
                            {/*    <input*/}
                            {/*        type="checkbox"*/}
                            {/*        id="rememberMe"*/}
                            {/*        className="login-checkbox"*/}
                            {/*        checked={rememberMe}*/}
                            {/*        onChange={(e) => setRememberMe(e.target.checked)}*/}
                            {/*    />*/}
                            {/*    <label htmlFor="rememberMe">Remember for 30 days</label>*/}
                            {/*</div>*/}
                            <a href="/forgot-password" className="login-forgot-password"> {/* Adjust link as needed */}
                                Forgot password
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button type="submit" className="login-submit-button">
                            Sign in
                        </button>
                    </form>

                    {/* Sign Up Prompt */}
                    <p className="login-signup-prompt">
                        Don&#39;t have an account? <a href="/sign-up-option" className="login-signup-link">Sign up</a> {/* Adjust link */}
                    </p>
                </div>
            </div>
            {/* End Login Form Section */}

            <Footer />
        </div>
    );
};

export default Login;