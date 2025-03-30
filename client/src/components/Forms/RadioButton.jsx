import React from "react";

const RadioButton = ({ name, options, selectedValue, onChange }) => {
  return (
    <div>
      {options.map((option) => (
        <label
          key={option}
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={selectedValue === option}
            onChange={onChange}
            required={true} // Ensure one option is selected
            style={{ marginRight: "7px" }} // Add spacing between radio button and label
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
