import React from 'react';
import ButtonOrange from "../main components/Button-Orange.jsx";
import './stylesheet/HeroSection.css'

const HeroSection=() => {
    const volunteer_hero_section_background = {
        backgroundImage: 'url("/volunteer-page-hero-section.png")',
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center',   // Centers the image within the div
        width: '100%',                 // Full width of the parent container
        height: '40rem',               // Fixed height for the section
    };
    return (
        <div style={volunteer_hero_section_background}>
            <div className="volunteer-hero-section-container">
                <div className="volunteer-hero-section-text-container">
                    <h3>Lead. Initiate. Collaborate.</h3>
                    <h1>Connecting Volunteers with NGOs</h1>
                    <h3>Let a Million Environment Flowers Bloom</h3>
                </div>
                <ButtonOrange text="Join Enveave" link='/' className="volunteer-hero-section-button"/>
            </div>
        </div>
    );
};

export default HeroSection;