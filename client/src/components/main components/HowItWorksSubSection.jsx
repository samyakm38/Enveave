import React from 'react';
import './stylesheet/HowItWorksSubSection.css'

const HowItWorksSubSection=({number, title, description}) => {
    return (
        <div className='how-it-works-SubSection-text-container'>
            <h2>STEP</h2>
            <h1>{number}</h1>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default HowItWorksSubSection;