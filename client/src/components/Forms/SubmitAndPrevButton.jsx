import React from "react";
import { useNavigate } from "react-router-dom";
import "./Stylesheets/SubmitAndPrevButton.css";
const SubmitAndPrevButton = ({ prevLink }) => {
  const navigate = useNavigate();
  return (
    <div className="forms-next-submit-button-container">
      <button
        type="button"
        className="forms-prev-button"
        onClick={() => navigate(prevLink)}
      >
        ← Previous
      </button>
      <button type="submit" className="forms-submit-button">
        Submit
      </button>
    </div>
  );
};

export default SubmitAndPrevButton;
