import React from "react";
import "./Stylesheets/SubmitButton.css";

const SubmitButton = ({ prevLink }) => {
  return (
    <div className="forms-submit-button-container">
      <button type="submit" className="forms-submit-button">
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
