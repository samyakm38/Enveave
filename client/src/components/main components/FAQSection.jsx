import React, { useState } from 'react';
import './stylesheet/FAQSection.css'; // Make sure to import the CSS file

const FAQSection = () => {
    // Define FAQ data
    const faqData = [
        {
            question: "Is there a cost for using Enveave?",
            answer:
                "Enveave is non-profit and free to use. We are committed to making our platform accessible to as many people as possible."
        },
        {
            question: "Who can use Enveave?",
            answer:
                "Anyone interested in taking action on environmental issues is welcome on Enveave. This includes individuals, communities, and organisations of all sizes and types."
        },
        {
            question: "What are the criteria for starting projects on Enveave?",
            answer:
                "Organizations looking to start a project on Enveave must be focused on social good, community impact, or charitable causes—not for commercial gain. They need to register on the platform to ensure transparency and build trust with volunteers. Each project should clearly define volunteer roles or tasks, whether remote or on-site. Once registered, organizations can post projects, connect with volunteers, and work together to create meaningful change."
        },
        {
            question: "How can i get involved with Enveave?",
            answer:
                "There are many ways to get involved with Enveave! You can sign up for an account on the platform and start a project, work on a project as a volunteer or maybe just browse projects on Enveave and spread the word. "
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
