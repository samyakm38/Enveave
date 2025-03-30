import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Ngo-form-1.css";
import Footer from "../../components/main components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import NextButton from "../../components/Forms/NextButton.jsx";
import SingleLineInput from "../../components/Forms/SingleLineInput";
import SelectInput from "../../components/Forms/SelectInput";
import TextareaInput from "../../components/Forms/TextAreaInput";

const NgoForm1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null,
    address: "",
    state: "",
    city: "",
    pincode: "",
    website: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    navigate("/ngo-form-2");
  };

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  return (
    <>
      <Header />
      <section className="ngo-form-1">
        <h2 className="ngo-form-1-tagline">
          Let's get to know about your organization
        </h2>
        <form onSubmit={handleSubmit} className="ngo-form-1-form-container">
          <div className="ngo-form-1-progress-indicator">
            <img src="/forms-progress-indicator-size-2-1.svg"></img>
          </div>
          <h2>Organization Details</h2>
          <label>Enter your organization name</label>
          <SingleLineInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="ngo-form-1-input"
            required={true}
          />

          <label>Please provide a description of your organization</label>
          <TextareaInput
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description..."
            required={true}
          />

          <label>Please upload your organization's logo</label>
          <input type="file" onChange={handleFileChange} required />

          <label>What is the address of your organization?</label>
          <SingleLineInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            required={true}
          />

          <label>What is the state of your organization?</label>
          <SelectInput
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={states}
            required={true}
            placeholder="Select state"
          />

          <label>What is the city of your organization?</label>
          <SingleLineInput
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            required={true}
          />

          <label>What is the pincode of your organization?</label>
          <SingleLineInput
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            required={true}
          />

          <label>What is your organization's website?</label>
          <SingleLineInput
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="URL"
            required={true}
          />

          <NextButton />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default NgoForm1;
