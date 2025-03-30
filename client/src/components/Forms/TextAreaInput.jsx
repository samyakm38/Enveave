import React from "react";
import "./stylesheets/TextAreaInput.css"; // Assuming you have some CSS for styling
const TextareaInput = ({ name, value, onChange, placeholder, required }) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-textarea-input"
      required={required}
    />
  );
};

export default TextareaInput;
