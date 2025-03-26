import React from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import '../stylesheet/VolunteersPage.css'
import HeroSection from "../components/VolunteersPage/HeroSection.jsx";
// import Opportunities from "./Opportunities.jsx";
import OpportunitySection from "../components/VolunteersPage/OpportunitySection.jsx";
import ButtonOrange from "../components/main components/Button-Orange.jsx";
import HowItWorks from "../components/VolunteersPage/HowItWorks.jsx";
import CTASection from "../components/main components/CTASection.jsx";
// import ButtonOrange from "../components/main components/Button-Orange.jsx";

const Volunteers=() => {

    return (
        <>
            <Header/>
                <HeroSection/>
                <div className='volunteer-opportunity-section'>
                    <h1>Explore Opportunities</h1>
                    <OpportunitySection/>
                    <ButtonOrange text='View all' link='/'/>
                </div>
                <div className='volunteer-how-it-works-section'>
                    <h1>How It Works</h1>
                    <HowItWorks/>
                    <div className='volunteer-how-it-works-image-section'>
                        <img src='/how-it-works-img-1.png' alt='how-it-works-img-1'/>
                        <img src='/how-it-works-img-2.png' alt='how-it-works-img-2'/>
                        <img src='/how-it-works-img-3.png' alt='how-it-works-img-3'/>
                        <img src='/how-it-works-img-4.png' alt='how-it-works-img-4'/>
                        <img src='/how-it-works-img-5.png' alt='how-it-works-img-5'/>
                    </div>
                </div>
                <CTASection/>
            <Footer/>
        </>
    );
};

export default Volunteers;