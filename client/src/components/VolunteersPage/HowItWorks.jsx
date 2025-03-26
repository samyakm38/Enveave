import React from 'react';
import HowItWorksSubSection from "../main components/HowItWorksSubSection.jsx";
import './stylesheet/HowItWorks.css'

const HowItWorks=() => {
    return (
        <div className='how-it-works-text-container'>
            <HowItWorksSubSection number='01' title='Sign-Up' description='Fill in the basic details to get started with your journey today'/>
            <HowItWorksSubSection number='02' title='Browse' description='Explore and apply for opportunities to your preference'/>
            <HowItWorksSubSection number='03' title='Wait for Acceptance' description='Explore and apply for opportunities to your preference'/>
            <HowItWorksSubSection number='04' title='Start Working' description='If you and your NGO find it a good fit, start working'/>
        </div>
    );
};

export default HowItWorks;