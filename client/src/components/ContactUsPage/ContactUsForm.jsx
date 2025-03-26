import React, {useState} from 'react';
import './stylesheet/ContactUsForm.css'

const ContactUsForm=() => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here (e.g., API call)
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            message: '',
        });
    };

    return (
        <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-group">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="contact-form-input"
                        required
                    />
                </div>
                <div className="contact-form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="contact-form-input"
                        required
                    />
                </div>
                <div className="contact-form-group">
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="contact-form-input"
                    />
                </div>
                <div className="contact-form-group">
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="contact-form-input"
                    />
                </div>
                <div className="contact-form-group">
          <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="contact-form-textarea"
              rows="5"
              required
          />
                </div>
                <div className="contact-form-footer">
                    <button type="submit" className="contact-form-submit">
                        Submit
                    </button>
                    {/*<p className="contact-form-privacy">*/}
                    {/*    By submitting, you agree to Enveave’s Privacy Policy*/}
                    {/*</p>*/}
                </div>
            </form>
        </div>
    );
};

export default ContactUsForm;