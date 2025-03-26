import React, { useState } from 'react'; // No useRef needed for emailjs.send
import emailjs from '@emailjs/browser';
import './stylesheet/ContactUsForm.css';

const ContactUsForm = () => {
    // No longer need useRef for the form with emailjs.send
    // const form = useRef();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: '',
        // Add 'title' if your template *requires* it, otherwise remove this line
        // title: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');

    // Access environment variables
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            console.error("EmailJS environment variables are not loaded!");
            setSubmitStatus('error');
            setSubmitMessage('Configuration error. Cannot send message.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setSubmitMessage('');

        // Prepare the data object for emailjs.send
        // Ensure the keys here (name, email, message, etc.) EXACTLY match
        // the variable names you used in your EmailJS template (template_8a9qudd)
        const templateParams = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            message: formData.message,
            // Include 'title' ONLY if your template expects {{title}}
            // title: formData.title, // If you added 'title' to state and the form
        };

        // Use emailjs.send
        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            .then((result) => {
                console.log('EmailJS Success:', result.text);
                setSubmitStatus('success');
                setSubmitMessage('Thank you! Your message has been sent.');
                // Reset form state
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    message: '',
                    // title: '', // Reset title too if using it
                });
            }, (error) => {
                console.error('EmailJS Error:', error);
                setSubmitStatus('error');
                setSubmitMessage(`Failed to send message: ${error.text || 'Unknown error'}`);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="contact-form-container">
            {/* No ref needed on the form tag anymore */}
            <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Contact Us</h2>

                {/* --- Input fields --- */}
                {/* Make sure the 'name' attributes match the keys in templateParams */}
                <div className="contact-form-group">
                    <input
                        type="text"
                        name="name" // Should match templateParams.name and {{name}}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="contact-form-input"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="contact-form-group">
                    <input
                        type="email"
                        name="email" // Should match templateParams.email and {{email}}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="contact-form-input"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="contact-form-group">
                    <input
                        type="tel"
                        name="phone" // Should match templateParams.phone and {{phone}}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone (Optional)"
                        className="contact-form-input"
                        disabled={isSubmitting}
                    />
                </div>
                <div className="contact-form-group">
                    <input
                        type="text"
                        name="address" // Should match templateParams.address and {{address}}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address (Optional)"
                        className="contact-form-input"
                        disabled={isSubmitting}
                    />
                </div>
                {/* If your template needs a 'title', add an input for it here */}
                {/* <div className="contact-form-group">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title/Subject" className="contact-form-input" required disabled={isSubmitting} />
                </div> */}
                <div className="contact-form-group">
                    <textarea
                        name="message" // Should match templateParams.message and {{message}}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Message"
                        className="contact-form-textarea"
                        rows="5"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* --- Status Message --- */}
                {submitStatus && (
                    <div className={`contact-form-status ${submitStatus === 'success' ? 'success' : 'error'}`}>
                        {submitMessage}
                    </div>
                )}

                {/* --- Footer --- */}
                <div className="contact-form-footer">
                    <button type="submit" className="contact-form-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Submit'}
                    </button>
                </div>
            </form>
            {/* --- Styles --- */}
            <style jsx>{`
                .contact-form-status { margin-top: 15px; padding: 10px; border-radius: 4px; text-align: center; }
                .contact-form-status.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .contact-form-status.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            `}</style>
        </div>
    );
};

export default ContactUsForm;