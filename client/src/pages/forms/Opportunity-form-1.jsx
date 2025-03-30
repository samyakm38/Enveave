import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Opportunity-form-1.css";
import Footer from "../../components/main components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import NextButton from "../../components/Forms/NextButton.jsx";
import SingleLineInput from "../../components/Forms/SingleLineInput";
import SelectInput from "../../components/Forms/SelectInput";
import CheckboxGroup from "../../components/Forms/CheckBox";
import TextareaInput from "../../components/Forms/TextAreaInput";
import RadioButton from "../../components/Forms/RadioButton.jsx";

const OpportunityForm1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photo: null,
    selectedOppType: "",
    selectedCategories: [],
    otherCategory: "",
    numReqVolunteers: "",
    isPaid: "",
    compAmount: "",
  });

  const [errors, setErrors] = useState({
    categoriesError: "",
  });

  const opportunityTypes = [
    "One-time Event",
    "Short-term Volunteering (1-4 weeks)",
    "Medium-term Volunteering (1-6 months)",
    "Long-term Volunteering (6+ months)",
  ];

  const categoryOptions = [
    "Content Creation & Communication",
    "Field Work & Conservation",
    "Research & Data Collection",
    "Education & Awareness",
    "Administrative Support",
    "Event Management",
    "Technical & IT Support",
    "Fundraising & Grant Writing",
    "Community Outreach",
    "Project Coordination",
    "Waste Management",
    "Sustainability Planning",
    "Wildlife Protection",
    "Climate Action",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { categoriesError: "" };

    if (formData.selectedCategories.length === 0) {
      newErrors.categoriesError = "Please select at least one category.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Form Submitted:", formData);
      navigate("/Opportunity-form-2");
    }
  };

  return (
    <>
      <Header />
      <section className="opportunity-form-1">
        <h2 className="tagline">Tell us about the opportunity</h2>
        <form
          onSubmit={handleSubmit}
          className="opportunity-form-1-form-container"
        >
          <div className="opportunity-form-1-progress-indicator">
            <img src="/forms-progress-indicator-size-4-1.svg"></img>
          </div>
          <h2>Basic Details</h2>
          <label>Enter the title for the opportunity</label>
          <SingleLineInput
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter name"
            required={true}
          />

          <label>Please provide a description of it</label>
          <TextareaInput
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description..."
            required={true}
          />

          <label>Would you like to upload a photo for it?</label>
          <input type="file" onChange={handleFileChange} required={false} />

          <label>What type of opportunity is this?</label>
          <SelectInput
            name="selectedOppType"
            value={formData.selectedOppType}
            onChange={handleChange}
            options={opportunityTypes}
            required={true}
            placeholder="Select type of opportunity"
          />

          <label>What category does it belong to?</label>
          <CheckboxGroup
            name="selectedCategories"
            options={categoryOptions}
            selectedValues={formData.selectedCategories}
            onChange={handleCheckboxChange}
            error={errors.categoriesError}
            required={true}
          />

          <label>If other, please specify.</label>
          <SingleLineInput
            type="text"
            name="otherCategory"
            value={formData.otherCategory}
            onChange={handleChange}
            placeholder="Enter a category"
            required={false}
          />

          <label>How many volunteers are required for this?</label>
          <SingleLineInput
            type="text"
            name="numReqVolunteers"
            value={formData.numReqVolunteers}
            onChange={handleChange}
            placeholder="Enter number"
            required
          />

          <label>Is this paid?</label>
          <RadioButton
            name="isPaid"
            options={["Yes", "No"]}
            selectedValue={formData.isPaid}
            onChange={handleChange}
          />

          {formData.isPaid === "Yes" && (
            <>
              <label>If yes, please specify a range.</label>
              <SingleLineInput
                type="text"
                name="compAmount"
                value={formData.compAmount}
                onChange={handleChange}
                placeholder="Enter compensation range"
              />
            </>
          )}

          <NextButton />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default OpportunityForm1;
