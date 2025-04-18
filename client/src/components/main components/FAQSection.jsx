import React, { useState } from 'react';
import './stylesheet/FAQSection.css'; // Make sure to import the CSS file

const FAQSection = () => {
    // Define FAQ data
    const faqData = [
        {
            question: "Is there a cost for using Enveave?",
            answer:
                "Enveave is a non-profit platform and completely free to use. We are committed to keeping it accessible to individuals and organizations working for the greater good."
        },
        {
            question: "Who can use Enveave?",
            answer:
                "Anyone interested in contributing to positive social change is welcome on Enveave. This includes individuals, volunteers, NGOs, and organizations of all sizes working on non-commercial initiatives."
        },
        {
            question: "What are the criteria for starting opportunities on Enveave?",
            answer:
                "Organizations looking to post opportunities on Enveave must be focused on societal good, community impact, or charitable causes—not for commercial gain. Registration is required to ensure transparency and build trust with volunteers. Each opportunity should clearly outline roles or tasks, whether remote or on-site. Once registered, organizations can connect with volunteers and collaborate to create meaningful impact."
        },
        {
            question: "How can I get involved with Enveave?",
            answer:
                "There are many ways to get involved! You can create an account, sign up as a volunteer or an organization, create or join an opportunity, or simply explore ongoing efforts and help spread the word about Enveave."
        }       
    ];

    // State to keep track of the currently open FAQ index; null means all are closed
    const [openIndex, setOpenIndex] = useState(null);

    // Toggle the open/close state for the selected FAQ item
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h2 className="faq-heading">Frequently Asked Questions</h2>
            {faqData.map((item, index) => (
                <div key={index} className="faq-item">
                    <button className="faq-question" onClick={() => toggleAccordion(index)}>
                        {item.question}
                        <span className={`faq-arrow ${openIndex === index ? 'open' : ''}`}>
                            <img src='/down-arrow.svg' alt='down arrow'/>
                        </span>
                    </button>
                    {openIndex === index && (
                        <div className="faq-answer-container">
                            <p className="faq-answer">{item.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FAQSection;
