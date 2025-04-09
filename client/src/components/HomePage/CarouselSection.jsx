import React from 'react';
import {Carousel} from "flowbite-react";
import {Link} from "react-router-dom";

const CarouselSection=() => {
    const images=['/home-carousel-1.png', '/home-carousel-1.png', '/home-carousel-1.png', '/home-carousel-1.png',];

    const customTheme={
        root: {
            base: "relative h-full w-full"
        }, control: {
            base: "inline-flex h-12 w-12 items-center justify-center rounded-full", previous: {
                base: "!bg-[#FAFAF6] hover:!bg-[#f0f0eb] mx-4", icon: "!text-black h-6 w-6"
            }, next: {
                base: "!bg-[#236D4E] hover:!bg-[#1a503a] mx-4", icon: "!text-white h-6 w-6"
            }
        }, indicators: {
            active: {
                off: "bg-white border border-[#113627]", on: "bg-[#113627]"
            }, base: "h-3 w-3 rounded-full"
        }
    };

    // Custom arrow components
    const NextArrow=() => (<div className="!bg-[#236D4E] p-3 rounded-full hover:!bg-[#1a503a]">
            <svg className="w-6 h-6 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
        </div>);

    const PrevArrow=() => (<div className="!bg-[#FAFAF6] p-3 rounded-full hover:!bg-[#f0f0eb]">
            <svg className="w-6 h-6 !text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
        </div>);

    return (<>
            <div className="sm:h-100 md:h-[650px] max-w-7xl mx-auto"> {/* Increased height and constrained width */}
                <Carousel
                    pauseOnHover
                    theme={customTheme}
                    indicators
                    leftControl={<PrevArrow/>}
                    rightControl={<NextArrow/>}
                >
                    {images.map((image, index) => (
                        <div key={index} className="relative h-full flex justify-center items-center">
                            <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="block w-[80%] h-[80%] object-cover object-center"
                            />
                        </div>))}
                </Carousel>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center', // height: '100vh' /* Or a specific height */
                marginTop: '1rem',
                flexDirection: 'column',
                gap: '1rem',
            }}>
                <p style={{
                    color: '#000',
                    textAlign: 'center',
                    fontFamily: 'Montserrat',
                    fontSize: '1.25rem',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    width: '60%',
                }}>
                    Enveave is actively implementing impactful projects that foster positive change, addressing key
                    environmental and societal challenges for a better future.
                </p>
                <Link to='/about-us'>
                    <button style={{
                        borderRadius: '0.4rem',
                        background: '#E46C43',
                        color: '#FFF', // Added quotes around #FFF
                        fontFamily: 'Montserrat', // Corrected to camelCase
                        fontSize: '1.375rem',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: 'normal',
                        padding: '0.75rem',
                    }}>
                        Learn More
                    </button>
                </Link>

            </div>
        </>

    );
};

export default CarouselSection;
