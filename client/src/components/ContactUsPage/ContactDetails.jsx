import React from 'react';
import './stylesheet/ContactDetails.css'

const ContactDetails=() => {
    return (
        <div className="contact-us-container">

                {/* Placeholder for the image */}
                <img
                    src="/contact-us-image.png"
                    alt="Person using phone and laptop"
                    className='contact-us-image'
                />
            {/*</div>*/}
            <div className="contact-us-content">
                <h2>
                    Have questions or ideas to share? Reach out to us—we’re here to help
                    you bring your environmental vision to life.
                </h2>
                <ul className="contact-us-list">
                    <li className="contact-us-item">
                        <div className="contact-us-icon-container">
                            <img src='/phone-icon.svg' alt='Phone icon'/>
                        </div>

                        <div className="contact-us-mini-container">
                            <span className="contact-us-label">Phone</span>
                            <span className="contact-us-value">+91 99999999</span>
                        </div>
                    </li>
                    <li className="contact-us-item">
                        <div className="contact-us-icon-container">
                            <img src='/location-icon.svg' alt='Location icon'/>
                        </div>

                        <div className="contact-us-mini-container">
                            <span className="contact-us-label">Address</span>
                            <span className="contact-us-value">IIITD - Old Academic Building</span>
                        </div>

                    </li>
                    <li className="contact-us-item">
                        <div className="contact-us-icon-container">
                            <img src='/mail-icon.svg' alt='Email icon'/>
                        </div>

                        <div className="contact-us-mini-container">
                            <span className="contact-us-label">Email</span>
                            <span className="contact-us-value">xyz@gmail.com</span>
                        </div>

                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ContactDetails;