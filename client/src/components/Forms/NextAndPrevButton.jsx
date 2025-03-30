import React from "react";
import { useNavigate } from "react-router-dom";
import "./Stylesheets/NextAndPrevButton.css";
const NextAndPrevButton = ({ prevLink }) => {
  const navigate = useNavigate();
  return (
    <div className="forms-next-prev-button-container">
      <button
        type="button"
        className="forms-prev-button"
        onClick={() => navigate(prevLink)}
      >
        ← Previous
      </button>

      <button type="submit" className="forms-next-button">
        Next →
      </button>
    </div>
  );
};

export default NextAndPrevButton;
