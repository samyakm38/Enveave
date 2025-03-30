import React from "react";
import "./stylesheets/SelectInput.css"; // Assuming you have a CSS file for styling

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
