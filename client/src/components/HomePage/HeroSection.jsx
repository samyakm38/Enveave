import './stylesheet/HeroSection.css'
import {Link} from "react-router-dom";
import {useMediaQuery} from "react-responsive";

const HeroSection=() => {

    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

    const hero_section_background = {
        backgroundImage: 'url("/home-hero-section.png")',
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center',   // Centers the image within the div
        width: '100%',                 // Full width of the parent container
        height: isMobile ? '50rem' : '42.5rem',               // Fixed height for the section
    };
    return (
        <div className='home-hero-section-container' style={hero_section_background}>
            <div className='home-hero-heading-container'>
                <h1>Changing Lives For the Better</h1>
                <h3>Enveave provides a one-stop platform for individuals, communities and organisations to come together, launch environmental initiatives and access support from volunteers, funders, and experts.</h3>
            </div>
            <Link to='/sign-up-option'>
                <div className='home-hero-button'>
                    Join Enveave
                </div>
            </Link>

        </div>
    );
};

export default HeroSection;