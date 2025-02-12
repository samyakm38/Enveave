import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { PiXLogoBold } from "react-icons/pi"; // X (Twitter) icon
import "./stylesheet/Footer.css"; // Import the custom styles
import { NavLink } from 'react-router-dom';

const Footer = () => {

    const footer_background = {
        backgroundImage: 'url("/footer-background.png")',
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center',   // Centers the image within the div
        width: '100%',                 // Full width of the parent container
        height: '15rem',               // Fixed height for the section
    };
    return (
        <footer className="footer-container" style={footer_background}>
            <div className="container mx-auto flex flex-col items-center py-6">

                <div className='footer-nav-container'>
                    {/* Logo */}
                    <h1 className="footer-logo">ENVEAVE</h1>


                    {/* Navigation */}
                    <div>
                        <nav className="footer-nav">
                            <ul className="footer-menu">
                                <li>
                                    <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/volunteers"
                                             className={({isActive}) => isActive ? "active" : ""}>Volunteers</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/ngos"
                                             className={({isActive}) => isActive ? "active" : ""}>NGOs</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/opportunities"
                                             className={({isActive}) => isActive ? "active" : ""}>Opportunities</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about-us" className={({isActive}) => isActive ? "active" : ""}>About
                                        us</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/contact-us" className={({isActive}) => isActive ? "active" : ""}>Contact
                                        us</NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>


                {/* Horizontal Line */}
                <div className="footer-line"></div>

                <div className="footer-content">
                    {/* Social Media Icons */}
                    <div className="footer-social">
                        <div className="footer-icon-wrapper"> {/* Added wrapper div */}
                            <a href="#" className="footer-icon">
                                <FaFacebookF/>
                            </a>
                        </div>
                        <div className="footer-icon-wrapper"> {/* Added wrapper div */}
                            <a href="#" className="footer-icon">
                                <PiXLogoBold/>
                            </a>
                        </div>
                        <div className="footer-icon-wrapper"> {/* Added wrapper div */}
                            <a href="#" className="footer-icon">
                                <FaInstagram/>
                            </a>
                        </div>
                        <div className="footer-icon-wrapper"> {/* Added wrapper div */}
                            <a href="#" className="footer-icon">
                                <FaLinkedinIn/>
                            </a>
                        </div>
                    </div>

                    {/* Copyright Text */}
                    <p className="footer-copyright">
                        © 2025 Enveave. All rights reserved
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
