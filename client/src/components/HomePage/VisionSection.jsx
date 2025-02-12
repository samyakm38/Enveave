import React from 'react';
import './stylesheet/VisionSection.css'

const VisionSection=() => {
    return (
        <div className='home-vision-container'>
            <div className='home-vision-left-container'>
                <p>Enveave is the <span className='text-[#236D4E]'>Digital Infrastructure </span>for environmental actions on a mission to become a collective for all environmental initiatives in India.</p>
            </div>
            <div className='home-vision-right-container'>
                <div className='home-vision-text-container'>
                    <div className='home-vision-heading'>
                        <div className='home-vision-green-column'></div>
                        <h2>Vision</h2>
                    </div>
                    <p>Our vision is that Enveave will become the platform for all environmental initiatives by the
                        citizens and organizations in India and the main forum for anyone who wants to contribute to the
                        environment.</p>
                </div>
                <div className='home-vision-text-container'>
                    <div className='home-vision-heading'>
                        <div className='home-vision-green-column'></div>
                        <h2>Mission</h2>
                    </div>
                    <p>Enveave aims to get together civil society, individuals, expert groups, academia, the research community, and industry on a common platform and provide a single place to collaborate on various projects related to Ecology and Environment. We aim to ease the launch and execution of such projects, large or small, and <span className='font-bold'>“Let a Million Environment Flowers Bloom”.</span></p>
                </div>
            </div>
        </div>
    );
};

export default VisionSection;