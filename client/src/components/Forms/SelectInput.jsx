import React from "react";
import "./stylesheets/SelectInput.css";

const SelectInput = ({
  name,
  value,
  onChange,
  options,
  required,
  placeholder,
}) => {
  return (
    <select
      className="form-select-input"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={{ width: "100%", padding: "10px", fontSize: "14px" }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
