import React from "react";

const CheckboxGroup = ({ name, options, selectedValues, onChange, error }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {options.map((option) => (
        <div key={option} style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={selectedValues.includes(option)}
            onChange={onChange}
            style={{ marginRight: "7px" }}
          />
          <label style={{ fontSize: "14px" }}>{option}</label>
        </div>
      ))}
      {error && (
        <p className="error-message" style={{ fontSize: "12px", color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckboxGroup;
