import React from "react";
import "./Stylesheets/SingleLineInput.css";

const SingleLineInput = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <input
      className="form-single-line-input"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{ width: "100%", padding: "10px", fontSize: "14px" }}
    />
  );
};

export default SingleLineInput;
