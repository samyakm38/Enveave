import React from 'react';
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import {Button} from "flowbite-react";
import '../stylesheet/Sign-Up-Option.css'
import {Link} from "react-router-dom";

const SignUpOption=() => {
    return (
        <div>
            <Header/>
            <div className='sign-up-option-container'>
                <h1>How would you like to sign-up?</h1>
                <Link to='/sign-up/volunteer'>
                    <div className='sign-up-option-button'>As Volunteer</div>
                </Link>
                <Link to='/sign-up/ngo'>
                    <div className='sign-up-option-button'>As NGO</div>
                </Link>

            </div>
            <Footer/>
        </div>
    );
};

export default SignUpOption;