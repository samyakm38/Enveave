import React from 'react';
import ButtonOrange from "../main components/Button-Orange.jsx";
import './stylesheet/HeroSection.css'

const HeroSection=() => {
    const volunteer_hero_section_background = {
        backgroundImage: 'url("/ngo-hero-section.png")',
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center',   // Centers the image within the div
        width: '100%',                 // Full width of the parent container
        height: '50rem',               // Fixed height for the section
    };
    return (
        <div style={volunteer_hero_section_background}>
            <div className="ngo-hero-section-container">
                <div className="ngo-hero-section-text-container">
                    <h1>Connect With<br/> Volunteers</h1>
                    <h3>Work with Enveave to find the best<br/> volunteer based on your needs.</h3>
                </div>
                <ButtonOrange text="Join Enveave" link='/sign-up/ngo' className="ngo-hero-section-button"/>
            </div>
        </div>
    );
};

export default HeroSection;