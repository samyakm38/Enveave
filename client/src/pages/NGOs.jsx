import React from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import HeroSection from "../components/NGOPage/HeroSection.jsx";
import ButtonOrange from "../components/main components/Button-Orange.jsx";
import '../stylesheet/NGOPage.css'
import HowItWorks from "../components/NGOPage/HowItWorks.jsx";

const NGOs=() => {
    return (
        <div>
            <Header/>
            <HeroSection/>
            <div className='NGO-CTA'>
                <div className='NGO-CTA-text-container'>
                    <h1>Find the Right Volunteers</h1>
                    <p>Work with Enveave to find the best volunteer based on your needs.</p>
                </div>
                <ButtonOrange text='Connect >' link='/contact-us'/>
            </div>
            <div className='NGO-how-it-works'>
                <h1 className='NGO-how-it-works-heading'>
                    How it works
                </h1>
                <HowItWorks/>
                <div className='NGO-how-it-works-image-section'>
                    <img src='/how-it-works-img-1.png' alt='how-it-works-img-1'/>
                    <img src='/how-it-works-img-2.png' alt='how-it-works-img-2'/>
                    <img src='/how-it-works-img-3.png' alt='how-it-works-img-3'/>
                    <img src='/how-it-works-img-4.png' alt='how-it-works-img-4'/>
                    <img src='/how-it-works-img-5.png' alt='how-it-works-img-5'/>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default NGOs;