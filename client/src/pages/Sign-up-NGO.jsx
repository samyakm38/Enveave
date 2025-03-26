import React, { useState } from 'react';
// import './SignUpNgo.css'; // Import the CSS file
// Replace 'path/to/your/logo.png' with the actual path to your logo image
// import logo from './logo.png'; // Assuming logo.png is in the same folder
import '../stylesheet/Sign-up-NGO.css'
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";

const SignUpNgo = () => {
    // State for form fields
    const [organizationName, setOrganizationName] = useState('');
    const [pocName, setPocName] = useState('');
    const [pocEmail, setPocEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        console.log('NGO Signup Data:', {
            organizationName,
            pocName,
            pocEmail,
            phoneNumber,
            password, // Remember to handle password securely in a real app!
        });
        // Add your account creation API call or logic here
    };

    return (
        <>
            <Header/>
            <div className="sign-up-ngo-main-container">
            <div className="sign-up-ngo-container">
                <img src='/logo-green.svg' alt="Organization Logo" className="sign-up-ngo-logo"/>

                <h1 className="sign-up-ngo-heading">Create an account</h1>
                <p className="sign-up-ngo-subheading">Start your volunteering journey</p>

                <form onSubmit={handleSubmit}>
                    {/* Organization Name */}
                    <div className="sign-up-ngo-form-group">
                        <label htmlFor="organizationName">Organization name</label>
                        <input
                            type="text"
                            id="organizationName"
                            className="sign-up-ngo-input"
                            placeholder="Enter name"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            required
                        />
                    </div>

                    {/* POC Name */}
                    <div className="sign-up-ngo-form-group">
                        <label htmlFor="pocName">POC name</label>
                        <input
                            type="text"
                            id="pocName"
                            className="sign-up-ngo-input"
                            placeholder="Enter name"
                            value={pocName}
                            onChange={(e) => setPocName(e.target.value)}
                            required
                        />
                    </div>

                    {/* POC Email */}
                    <div className="sign-up-ngo-form-group">
                        <label htmlFor="pocEmail">POC email</label>
                        <input
                            type="email"
                            id="pocEmail"
                            className="sign-up-ngo-input"
                            placeholder="Enter email"
                            value={pocEmail}
                            onChange={(e) => setPocEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="sign-up-ngo-form-group">
                        <label htmlFor="phoneNumber">Phone number</label>
                        <input
                            type="tel" // Use type="tel" for phone numbers
                            id="phoneNumber"
                            className="sign-up-ngo-input"
                            placeholder="Enter number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required // Adjust if phone number is optional
                        />
                    </div>

                    {/* Password */}
                    <div className="sign-up-ngo-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="sign-up-ngo-input"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="sign-up-ngo-submit-button">
                        Get started
                    </button>
                </form>

                {/* Separator */}
                <div className="sign-up-ngo-separator">
                    <span>OR</span>
                </div>

                {/* Login Prompt */}
                <p className="sign-up-ngo-login-prompt">
                    Already have an account? <a href="/login" className="sign-up-ngo-login-link">Log in</a>
                    {/* Replace "/login" with your actual login route */}
                </p>
            </div>
            </div>
            <Footer/>
        </>

    );
};

export default SignUpNgo;