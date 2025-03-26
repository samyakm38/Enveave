import React from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
// import {Footer} from "flowbite-react";
import '../stylesheet/contact-us.css'
import ContactDetails from "../components/ContactUsPage/ContactDetails.jsx";
import ContactUsForm from "../components/ContactUsPage/ContactUsForm.jsx";

const ContactUs=() => {
    return (
        <>
            <Header/>
            <div className='contact-us-heading'>
                <h1>Contact Us</h1>
                <p>We love to hear from our change makers</p>
            </div>
            <div className='contact-us-main-container'>
                <ContactDetails/>
                <ContactUsForm/>
            </div>
            <Footer/>
        </>
    );
};

export default ContactUs;