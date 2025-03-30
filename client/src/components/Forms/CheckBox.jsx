import React from "react";

const CheckboxGroup = ({ name, options, selectedValues, onChange, error }) => {
  return (
    <div>
      {options.map((option) => (
        <div key={option} style={{ marginBottom: "8px" }}>
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={selectedValues.includes(option)}
            onChange={onChange}
            style={{ marginRight: "7px" }}
          />
          <label>{option}</label>
        </div>
      ))}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CheckboxGroup;
