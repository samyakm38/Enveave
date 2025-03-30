import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Volunteer-form-2.css";
import Footer from "../../components/main components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import NextAndPrevButton from "../../components/Forms/NextAndPrevButton.jsx";
import CheckboxGroup from "../../components/Forms/CheckBox";

const VolunteerForm1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    causes: [],
    skills: [],
  });

  const skillOptions = [
    "Environmental Research",
    "Data Collection & Analysis",
    "Environmental Education",
    "Waste Management",
    "Community Outreach",
    "Project Management",
    "Field Work",
    "Social Media Management",
    "Photography",
    "Editorial Writing",
    "Graphic Designing",
    "Sustainable Design",
    "Water Quality Testing",
  ];

  const causeOptions = [
    "Climate Action",
    "Environmental Conservation",
    "Waste Management",
    "Wildlife Protection",
    "Marine Conservation",
    "Forest Conservation",
    "Water Conservation",
    "Air Quality",
    "Environmental Education",
    "Habitat Restoration",
    "Others",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    navigate("/Volunteer-form-3");
  };

  return (
    <>
      <Header />
      <section className="volunteer-form-2">
        <h2 className="tagline">Let's get to know you</h2>
        <form
          onSubmit={handleSubmit}
          className="volunteer-form-2-form-container"
        >
          <div className="volunteer-form-2-progress-indicator">
            <img src="/forms-progress-indicator-size-3-2.svg"></img>
          </div>
          <h2>Interests & Skills</h2>
          <label>
            What causes are you interested in? (Select all that apply)
          </label>
          <CheckboxGroup
            name="causes"
            options={causeOptions}
            selectedValues={formData.causes}
            onChange={handleCheckboxChange}
          />

          <label>What skills do you have? (Select all that apply)</label>
          <CheckboxGroup
            name="skills"
            options={skillOptions}
            selectedValues={formData.skills}
            onChange={handleCheckboxChange}
          />
          <NextAndPrevButton prevLink="/Volunteer-form-1" />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default VolunteerForm1;
