import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Ngo-form-2.css";
import Footer from "../../components/main components/Footer.jsx";
import SubmitAndPrevButton from "../../components/Forms/SubmitAndPrevButton.jsx";
import SingleLineInput from "../../components/Forms/SingleLineInput.jsx";
import CheckBox from "../../components/Forms/CheckBox.jsx";

const NgoForm2 = () => {
  const [formData, setFormData] = useState({
    selectedGeographicalAreas: [],
    workAreas: [],
    otherWorkAreas: "",
    prevOpportunityLink: "",
  });

  const [errors, setErrors] = useState({
    geographicalAreasError: "",
    workAreasError: "",
  });

  const workAreaOptions = ["Education", "Health"];
  const geographicalOptions = ["Urban", "Rural", "PeriUrban"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { geographicalAreasError: "", workAreasError: "" };

    // Validate geographical areas
    if (formData.selectedGeographicalAreas.length === 0) {
      newErrors.geographicalAreasError =
        "Please select at least one geographical area.";
      isValid = false;
    }

    // Validate work areas
    if (formData.workAreas.length === 0 && !formData.otherWorkAreas.trim()) {
      newErrors.workAreasError =
        "Please select at least one work area or specify in 'Other Work Areas'.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Form Submitted:", formData);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
        ? [...(prevData[name] || []), value] // Add if checked
        : (prevData[name] || []).filter((item) => item !== value), // Remove if unchecked
    }));
  };

  return (
    <>
      <Header />
      <section className="ngo-form-2">
        <h2 className="ngo-form-2-tagline">
          Let's get to know about your organization
        </h2>
        <form onSubmit={handleSubmit} className="ngo-form-2-form-container">
          <div className="ngo-form-2-progress-indicator">
            <img src="/forms-progress-indicator-size-2-2.svg" alt="Progress" />
          </div>
          <h2>Work Areas and Experience</h2>

          <label>
            What geographical areas does your organization work in? (Select all
            that apply)
          </label>
          <CheckBox
            name="selectedGeographicalAreas"
            options={geographicalOptions}
            selectedValues={formData.selectedGeographicalAreas}
            onChange={handleCheckboxChange}
            error={errors.geographicalAreasError}
          />

          <label>
            What are the thematic areas of work for your organization? (Select
            all that apply)
          </label>

          <CheckBox
            name="workAreas"
            options={workAreaOptions}
            selectedValues={formData.workAreas}
            onChange={handleCheckboxChange}
            error={errors.workAreasError}
          />

          <SingleLineInput
            type="text"
            name="otherWorkAreas"
            value={formData.otherWorkAreas}
            onChange={handleChange}
            placeholder="If others, please specify"
            required={false}
          />

          <label>
            Please provide a link to previous volunteering opportunities (If
            any).
          </label>
          <SingleLineInput
            type="url"
            name="prevOpportunityLink"
            value={formData.prevOpportunityLink}
            onChange={handleChange}
            placeholder="URL"
          />

          <SubmitAndPrevButton prevLink="/Ngo-form-1" />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default NgoForm2;
