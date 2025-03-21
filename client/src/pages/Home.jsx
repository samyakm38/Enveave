import React from 'react'
// Main navigation component
import Header from "../components/main components/Header.jsx";
// Component imports for different sections of the homepage
import HeroSection from "../components/HomePage/HeroSection.jsx";
import CarouselSection from "../components/HomePage/CarouselSection.jsx";
import StoriesSection from "../components/HomePage/StoriesSection.jsx";
import VisionSection from "../components/HomePage/VisionSection.jsx";
// Global styles for homepage
import '../stylesheet/HomePage.css'
import FQASection from "../components/HomePage/FQASection.jsx";
import Footer from "../components/main components/Footer.jsx";
import PartnersSection from "../components/HomePage/PartnersSection.jsx";
import CTASection from "../components/main components/CTASection.jsx";

const Home = () => {
    // Style object for the stories background section
    // Uses a background image with full-width responsive design
    const home_background_story = {
        backgroundImage: 'url("/home-background-stories.png")',
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center',   // Centers the image within the div
        width: '100%',                 // Full width of the parent container
        height: '49.5rem',               // Fixed height for the section
    };

    const home_background_CTA = {
        backgroundImage: 'url("/home-background-CTA.png")',
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center',   // Centers the image within the div
        width: '100%',                 // Full width of the parent container
        height: '21.5625rem',               // Fixed height for the section
    };

    return (
        <>
            {/* Main navigation header */}
            <Header/>

            {/* Hero section - main landing area */}
            <HeroSection/>

            {/* Carousel displaying current initiatives */}
            <h1 className='home-heading'>
                Our Current Initiatives
            </h1>
            <CarouselSection/>

            {/* Partners section*/}
            <h1 className='home-heading'>
                Our Partners
            </h1>
            <PartnersSection/>

            {/* Stories section with background image */}
            <div style={home_background_story} className='home-story-section'>
                <h1>Enveave Stories</h1>
                <StoriesSection/>
                <a href=''>
                    <div className='home-story-button-all-stories'>
                        <p>All Stories {">"}</p>
                    </div>
                </a>
            </div>

            {/* Vision and mission section */}
            <VisionSection/>

            {/*Call to Action section*/}
            <CTASection/>

            {/*FQA Section*/}
            <FQASection/>

            {/*Footer*/}
            <Footer/>
        </>
    )
}

export default Home