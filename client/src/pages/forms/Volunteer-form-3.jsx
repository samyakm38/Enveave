import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Volunteer-form-3.css";
import Footer from "../../components/main components/Footer.jsx";
import { TextInput } from "flowbite-react";
import SubmitAndPrevButton from "../../components/Forms/SubmitAndPrevButton.jsx";
import CheckboxGroup from "../../components/Forms/CheckBox";
import RadioButton from "../../components/Forms/RadioButton.jsx";

const VolunteerForm3 = () => {
  const [formData, setFormData] = useState({
    selectedDates: [],
    hasExperience: "",
    experienceDetails: "",
    selectedMotivations: [],
  });

  const dateOptions = ["13-10-2025", "16-10-2025"];
  const motivationOptions = [
    "Civic Responsibility",
    "Family/Societal Expectations",
    "International Norms (e.g. SDGs)",
    "Networking",
    "Personal Interest",
    "Personal or Professional Development",
    "Resume-Building",
    "School, College or Employer Requirement",
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
    console.log("Form Submitted:", formData);
  };

  return (
    <>
      <Header />
      <section className="volunteer-form-3">
        <h2 className="tagline">Let's get to know you</h2>
        <form
          onSubmit={handleSubmit}
          className="volunteer-form-3-form-container"
        >
          <div className="volunteer-form-3-progress-indicator">
            <img src="/forms-progress-indicator-size-3-3.svg"></img>
          </div>
          <h2>Availability and Experience</h2>

          <label>
            When are you available to volunteer? (Select all that apply)
          </label>
          <CheckboxGroup
            name="selectedDates"
            options={dateOptions}
            selectedValues={formData.selectedDates}
            onChange={handleCheckboxChange}
          />

          <label>
            What motivates you to be a volunteer? (Select all that apply)
          </label>
          <CheckboxGroup
            name="selectedMotivations"
            options={motivationOptions}
            selectedValues={formData.selectedMotivations}
            onChange={handleCheckboxChange}
          />

          <label>
            Do you have previous volunteering experience? (Select all that
            apply)
          </label>
          <RadioButton
            name="hasExperience"
            options={["Yes", "No"]}
            selectedValue={formData.hasExperience}
            onChange={handleChange}
          />

          {/* Textarea appears if 'Yes' is selected */}
          {formData.hasExperience === "Yes" && (
            <>
              <label>Please describe your experience:</label>
              <textarea
                name="experienceDetails"
                value={formData.experienceDetails}
                onChange={handleChange}
                placeholder="Enter details..."
                required
              />
            </>
          )}

          <SubmitAndPrevButton prevLink="/Volunteer-form-2" />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default VolunteerForm3;
