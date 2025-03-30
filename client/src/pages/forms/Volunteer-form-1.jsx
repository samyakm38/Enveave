import { useState } from "react";
import Header from "../../components/main components/Header";
import "../../stylesheet/forms/Volunteer-form-1.css";
import Footer from "../../components/main components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import NextButton from "../../components/Forms/NextButton.jsx";
import SingleLineInput from "../../components/Forms/SingleLineInput";
import SelectInput from "../../components/Forms/SelectInput";

const VolunteerForm1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    dob: "",
    state: "",
    city: "",
    pincode: "",
    gender: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    navigate("/Volunteer-form-2");
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
      <section className="volunteer-form-1">
        <h2 className="volunteer-form-1-tagline">Let's get to know you</h2>
        <form
          onSubmit={handleSubmit}
          className="volunteer-form-1-form-container"
        >
          <div className="volunteer-form-1-progress-indicator">
            <img src="/forms-progress-indicator-size-3-1.svg"></img>
          </div>
          <h2>Volunteer Details</h2>
          <label>Name</label>
          <SingleLineInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="volunteer-form-1-input"
            required={true}
          />

          <label>Phone no.</label>
          <SingleLineInput
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Phone No."
            className="volunteer-form-1-input"
            required={true}
          />

          <label>Date of Birth</label>
          <SingleLineInput
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="volunteer-form-1-input"
            required={true}
          />

          <label>Gender</label>
          <SelectInput
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", "Others"]}
            placeholder="Select Gender"
            required={true}
          />

          <label>Address</label>
          <SingleLineInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="volunteer-form-1-input"
            required={true}
          />

          <label>State</label>
          <SelectInput
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={states}
            required={true}
            placeholder={"Select state"}
          />

          <label>City</label>
          <SingleLineInput
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            className="volunteer-form-1-input"
            required={true}
          />

          <label>Pincode</label>
          <SingleLineInput
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            className="volunteer-form-1-input"
            required={true}
          />
          <NextButton />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default VolunteerForm1;
