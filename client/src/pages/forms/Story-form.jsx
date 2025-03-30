import React from "react";
import SingleLineInput from "../../components/Forms/SingleLineInput";
import Header from "../../components/main components/Header";
import { useState } from "react";
import TextareaInput from "../../components/Forms/TextAreaInput";
import "../../stylesheet/forms/Story-form.css";
import Footer from "../../components/main components/Footer.jsx";
import SubmitButton from "../../components/Forms/SubmitButton.jsx";

const StoryForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

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
      <section className="story-form">
        <h2 className="tagline">Tell Us Your Story</h2>
        <form onSubmit={handleSubmit} className="story-form-form-container">
          <label>Enter Title</label>
          <SingleLineInput
            type="text"
            name="title"
            value={formData.title}
            placeholder="Enter Title"
            required={true}
            onChange={handleChange}
          />

          <label>Enter Description</label>
          <TextareaInput
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Description"
            required={true}
          />

          <label>Upload Image</label>
          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            required
          />
          <SubmitButton />
        </form>
      </section>
      <Footer />
    </>
  );
};

export default StoryForm;
