import React from 'react';
import './stylesheet/HowItWorks.css'
import HowItWorksSubSection from "../main components/HowItWorksSubSection.jsx";

const HowItWorks=() => {
    return (
        <div>
            <div className='how-it-works-text-container'>
                <HowItWorksSubSection number='01' title='Register'
                                      description='Register your Organization'/>
                <HowItWorksSubSection number='02' title='Approval'
                                      description='Wait for admin Approval'/>
                <HowItWorksSubSection number='03' title='Post a Project'
                                      description='Post a project / opportunity'/>
                <HowItWorksSubSection number='04' title='Start Working'
                                      description='If you and volunteer agree, start working.'/>
            </div>
        </div>
    );
};

export default HowItWorks;