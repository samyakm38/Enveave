import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Opportunity-form-2.css";
import Footer from "../../components/main components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import NextAndPrevButton from "../../components/Forms/NextAndPrevButton.jsx";
import SingleLineInput from "../../components/Forms/SingleLineInput";
import SelectInput from "../../components/Forms/SelectInput";

const OpportunityForm2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: "",
    dateOfStart: null,
    dateOfEnd: null,
    timeCommitment: "",
    contactPersonName: "",
    contactPersonEmailId: "",
    contactPersonPhoneNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a date field
    if (name === "dateOfStart" || name === "dateOfEnd") {
      setFormData({ ...formData, [name]: new Date(value) }); // Convert to Date object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    navigate("/Opportunity-form-3");
  };

  return (
    <>
      <Header />
      <section className="opportunity-form-2">
        <h2 className="tagline">Tell Us About The Opportunity</h2>
        <form
          onSubmit={handleSubmit}
          className="opportunity-form-2-form-container"
        >
          <div className="opportunity-form-2-progress-indicator">
            <img src="/forms-progress-indicator-size-4-2.svg"></img>
          </div>
          <h2>Location & Schedule</h2>
          <label>Enter Address/Location</label>
          <SingleLineInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            required={true}
          />

          <label>When does it begin?</label>
          <SingleLineInput
            type="date"
            name="dateOfStart"
            value={formData.dateOfStart}
            onChange={handleChange}
            required={true}
          />

          <label>When does it end?</label>
          <SingleLineInput
            type="date"
            name="dateOfEnd"
            value={formData.dateOfEnd}
            onChange={handleChange}
            required={true}
          />

          <label>What kind of time commitment does this require?</label>
          <SelectInput
            name="timeCommitment"
            value={formData.timeCommitment}
            onChange={handleChange}
            options={[
              "Few hours per week",
              "1-2 days per week",
              "3-4 days per week",
              "Full-time",
            ]}
            required={true}
            placeholder="Select time commitment"
          />

          <label>Enter Name of Contact Person</label>
          <SingleLineInput
            type="text"
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleChange}
            placeholder="Enter Name"
            required={true}
          />

          <label>Enter Their Email ID</label>
          <SingleLineInput
            type="text"
            name="contactPersonEmailId"
            value={formData.contactPersonEmailId}
            onChange={handleChange}
            placeholder="Enter Email ID"
            required={true}
          />

          <label>Enter Their Phone No.</label>
          <SingleLineInput
            type="text"
            name="contactPersonPhoneNo"
            value={formData.contactPersonPhoneNo}
            onChange={handleChange}
            placeholder="Enter Number"
            required={true}
          />

          <NextAndPrevButton prevLink="/Opportunity-form-1" />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default OpportunityForm2;
