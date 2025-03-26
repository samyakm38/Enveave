import React from 'react';
// import './SignupForm.css'; // Import the CSS file
// You'll need to replace 'path/to/your/logo.png' with the actual path to your logo image
 // Assuming you have a logo.png in the same folder
import '../stylesheet/Sign-up-volunteer.css'
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import {Link} from "react-router-dom";

function SignUpVolunteer() {
    // Basic state handlers (optional, but good practice for a real form)
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted:', { name, email, password });
        // Add your account creation logic here
    };

    return (
        <>

        <Header/>
            <div className="sign-up-volunteer-main-container">


        <div className="sign-up-volunteer-container"> {/* Updated class */}
            <img src='/logo-green.svg' alt="Company Logo" className="sign-up-volunteer-logo" /> {/* Updated class */}

            <h1 className="sign-up-volunteer-heading">Create an account</h1> {/* Added class */}
            <p className="sign-up-volunteer-subheading">Start your volunteering journey</p> {/* Updated class */}

            <form onSubmit={handleSubmit}>
                <div className="sign-up-volunteer-form-group"> {/* Updated class */}
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="sign-up-volunteer-input"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="sign-up-volunteer-form-group"> {/* Updated class */}
                    <label htmlFor="email">Email-ID</label>
                    <input
                        type="email"
                        id="email"
                        className="sign-up-volunteer-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="sign-up-volunteer-form-group"> {/* Updated class */}
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="sign-up-volunteer-input"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="sign-up-volunteer-submit-button"> {/* Updated class */}
                    Get started
                </button>
            </form>

            <div className="sign-up-volunteer-separator"> {/* Updated class */}
                <span>OR</span>
            </div>

            <p className="sign-up-volunteer-login-prompt"> {/* Updated class */}
                Already have an account? <Link to="/login" className="sign-up-volunteer-login-link">Log in</Link> {/* Updated class */}
                
            </p>
        </div>
            </div>
    <Footer/>
        </>
    );
}

export default SignUpVolunteer;