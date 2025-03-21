import React from 'react';
import './stylesheet/CTASection.css'
import {Link} from "react-router-dom";

const CtaSection=() => {
    const home_background_CTA = {
        backgroundImage: 'url("/home-background-CTA.png")',
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center',   // Centers the image within the div
        width: '100%',                 // Full width of the parent container
        height: '21.5625rem',               // Fixed height for the section
    };
    return (
        <div style={home_background_CTA} className='home-CTA-section'>
            <h5>Lets start with the first step</h5>
            <h1>Lead. Initiate. Collaborate.<br/>Let a Million Environment Flowers Bloom.</h1>
            <Link to='/'>
                <div className='home-CTA-button'>Join Enveave</div>
            </Link>
        </div>
    );
};

export default CtaSection;