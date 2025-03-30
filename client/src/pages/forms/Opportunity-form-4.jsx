import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Opportunity-form-4.css";
import Footer from "../../components/main components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import SubmitAndPrevButton from "../../components/Forms/SubmitAndPrevButton.jsx";
import TextAreaInput from "../../components/Forms/TextAreaInput";

const OpportunityForm4 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    additionalDetails: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox separately
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <>
      <Header />
      <section className="opportunity-form-4">
        <h2 className="tagline">Tell Us About The Opportunity</h2>
        <form
          onSubmit={handleSubmit}
          className="opportunity-form-4-form-container"
        >
          <div className="opportunity-form-4-progress-indicator">
            <img
              src="/forms-progress-indicator-size-4-4.svg"
              alt="Progress Indicator"
            />
          </div>
          <h2>Additional Details</h2>

          <label>
            Please enter additional details for volunteers? (if any)
          </label>
          <TextAreaInput
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleChange}
            placeholder="Enter details"
          />

          <div className="terms-checkbox">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
              style={{ marginRight: "7px" }} // Add spacing between checkbox and label
            />
            <label>
              I accept the{" "}
              <a
                className="opportunity-form-4-tc-link"
                href="/terms-and-conditions"
                target="_blank"
              >
                terms and conditions.
              </a>
              .
            </label>
          </div>

          <SubmitAndPrevButton prevLink="/Opportunity-form-3" />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default OpportunityForm4;
