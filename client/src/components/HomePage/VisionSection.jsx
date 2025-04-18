import React from 'react';
import './stylesheet/VisionSection.css'

const VisionSection=() => {
    return (
        <div className='home-vision-container'>
            <div className='home-vision-left-container'>
                <p>Enveave is the <span className='text-[#236D4E]'>Digital Infrastructure </span>for societal initiatives, on a mission to become a collective for all initiatives that benefit society in India. </p>
            </div>
            <div className='home-vision-right-container'>
                <div className='home-vision-text-container'>
                    <div className='home-vision-heading'>
                        <div className='home-vision-green-column'></div>
                        <h2>Vision</h2>
                    </div>
                    <p>Our vision is for Enveave to become the go-to platform for all organizational initiatives that aim to create positive change in society. We aspire to be the main forum for anyone who wants to contribute their time, skills, or passion toward the greater good.</p>
                </div>
                <div className='home-vision-text-container'>
                    <div className='home-vision-heading'>
                        <div className='home-vision-green-column'></div>
                        <h2>Mission</h2>
                    </div>
                    <p>Our mission is to connect volunteers with organizations dedicated to non-commercial initiatives that benefit society. We strive to make it easier for individuals and groups to discover, engage with, and collaborate on meaningful opportunities that drive positive impact in India.</p>
                </div>
            </div>
        </div>
    );
};

export default VisionSection;