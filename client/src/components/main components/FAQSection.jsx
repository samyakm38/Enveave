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
                "Once your order has shipped, you will receive an email with the tracking information. You can also log in to your account to view your order status."
        },
        {
            question: "What are the criteria for starting projects on Enveave?",
            answer:
                "Yes, you can purchase items again after returning them. Just add the desired items to your cart and complete the checkout process as usual."
        },
        {
            question: "What types of environmental issues does Enveave focus on?",
            answer:
                "Yes, you can purchase items again after returning them. Just add the desired items to your cart and complete the checkout process as usual."
        },
        {
            question: "How can i get involved with Enveave?",
            answer:
                "Yes, you can purchase items again after returning them. Just add the desired items to your cart and complete the checkout process as usual."
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
