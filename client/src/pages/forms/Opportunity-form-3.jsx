import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Opportunity-form-3.css";
import Footer from "../../components/main components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import NextAndPrevButton from "../../components/Forms/NextAndPrevButton.jsx";
import SingleLineInput from "../../components/Forms/SingleLineInput";
import CheckboxGroup from "../../components/Forms/CheckBox";

const OpportunityForm3 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    support: [],
    milestones: "",
  });

  const [errors, setErrors] = useState({
    supportError: "",
  });

  const supportOptions = [
    "Travel Reimbursement",
    "Food & Accommodation",
    "Certificate of Participation",
    "Letter of Recommendation",
    "Stipend/Monetary Incentive",
    "Learning/Training Sessions",
    "Networking Opportunities",
    "Other",
  ];

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
        ? [...(prevData[name] || []), value] // Add if checked
        : (prevData[name] || []).filter((item) => item !== value), // Remove if unchecked
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { supportError: "" };

    if (formData.support.length === 0) {
      newErrors.supportError = "Please select at least one support option.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Form Submitted:", formData);
      navigate("/Opportunity-form-4");
    }
  };

  return (
    <>
      <Header />
      <section className="opportunity-form-3">
        <h2 className="tagline">Tell Us About The Opportunity</h2>
        <form
          onSubmit={handleSubmit}
          className="opportunity-form-3-form-container"
        >
          <div className="opportunity-form-3-progress-indicator">
            <img
              src="/forms-progress-indicator-size-4-3.svg"
              alt="Progress Indicator"
            />
          </div>
          <h2>Support & Milestones</h2>

          <label>What support will be provided? (Select all that apply)</label>
          <CheckboxGroup
            name="support"
            options={supportOptions}
            selectedValues={formData.support}
            onChange={handleCheckboxChange}
            error={errors.supportError}
          />

          <label>
            Are there any milestones? If yes, please mention them below.
          </label>
          <SingleLineInput
            type="text"
            name="milestones"
            value={formData.milestones}
            onChange={handleChange}
            placeholder="Enter key milestones"
          />

          <NextAndPrevButton prevLink="/Opportunity-form-2" />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default OpportunityForm3;
