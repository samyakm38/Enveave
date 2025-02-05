import React from 'react'
import Header from "../components/Header.jsx";
import HeroSection from "../components/HomePage/HeroSection.jsx";
import '../stylesheet/HomePage.css'
import CarouselSection from "../components/HomePage/CarouselSection.jsx";

const Home=() => {
    return (<>
        <Header/>
        <HeroSection/>
        <h1
            className='home-heading'
        >
            Our Current Initiatives
        </h1>
        <CarouselSection/>
        <h1
            className='home-heading'
        >
            Our Partners
        </h1>
        <img src='/home-partners.png' alt='Home Partners image' className='home-partner-image'/>


    </>)
}

export default Home