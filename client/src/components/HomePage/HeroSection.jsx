import './stylesheet/HeroSection.css'

const HeroSection=() => {
    return (
        <div className='home-hero-section-container'>
            <div className='home-hero-section-mini-container'>
                <div className='home-hero-section-text-container'>
                    <p className='home-hero-section-sub-title'>Lead. Initiate. Collaborate.</p>
                    <h1 className='home-hero-section-heading'>Connecting <br/> Volunteers with NGOs</h1>
                    <p className='home-hero-section-sub-title'>Let a Million Environment Flowers Bloom.</p>
                    <div className='home-hero-section-CTA-buttons-container'>
                        <button className='home-hero-section-CTA-button-1'>Get Started</button>
                        <button className='home-hero-section-CTA-button-2'>Learn More</button>
                    </div>
                </div>
                <div className='home-hero-section-number-container'>
                    <ul className='home-hero-section-number'>
                        <li className='home-hero-section-number-item'>
                            <h2 className='home-hero-section-number-item-title'>280k</h2>
                            <p className='home-hero-section-number-item-sub-title'>Volunteers</p>
                        </li>
                        <li className='home-hero-section-number-item'>
                            <h2 className='home-hero-section-number-item-title'>6k</h2>
                            <p className='home-hero-section-number-item-sub-title'>Organizations</p>
                        </li>
                        <li className='home-hero-section-number-item'>
                            <h2 className='home-hero-section-number-item-title'>12k</h2>
                            <p className='home-hero-section-number-item-sub-title'>Activities</p>
                        </li>
                    </ul>
                </div>
            </div>

            <img src='/home-hero-section-image.png' alt='Home Image'/>
        </div>
    );
};

export default HeroSection;