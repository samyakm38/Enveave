import React from "react";
import "./stylesheets/TextAreaInput.css";

const TextareaInput = ({ name, value, onChange, placeholder, required }) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-textarea-input"
      required={required}
      style={{ width: "100%", padding: "10px", fontSize: "14px" }}
    />
  );
};

export default TextareaInput;
