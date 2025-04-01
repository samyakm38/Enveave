import React from 'react';
import './stylesheet/DashBoardHeader.css';
import {Link} from "react-router-dom"; // We'll create this CSS file next

// Using default parameters instead of defaultProps
const DashBoardHeader = ({
    ProfilePictureURL = 'https://via.placeholder.com/150',
    userName = 'User',
    status = 'Unknown',
    completionPercentage = 0,
    formLink = '#'
}) => {
    return (
        <div className="DashBoardHeader__container">
            {/* Left Section: Profile Pic, Welcome, Status */}
            <div className="DashBoardHeader__left">
                <div className="DashBoardHeader__profilePicContainer">
                    {/* Use userName in alt text for better accessibility */}
                    <img
                        src={ProfilePictureURL}
                        alt={`${userName}'s profile`}
                        className="DashBoardHeader__profilePic"
                    />
                </div>
                <div className="DashBoardHeader__userInfo">
                    {/* Use h2 or similar for semantic heading */}
                    <h2 className="DashBoardHeader__welcomeMessage">
                        Welcome, {userName}
                    </h2>
                    <div className="DashBoardHeader__statusLine">
                        <span className="DashBoardHeader__statusLabel">Your current status: </span>
                        {/* Status shown in a badge-like element */}
                        <span className="DashBoardHeader__statusBadge">{status}</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Profile Completion, Button */}
            <div className="DashBoardHeader__right">
                <div className="DashBoardHeader__profileCompletion">
                    <p className="DashBoardHeader__completionText">
                        Profile: {completionPercentage}% Completed
                    </p>
                    {/* Progress Bar */}
                    <div className="DashBoardHeader__progressBarTrack">
                        <div
                            className="DashBoardHeader__progressBarFill"
                            // Inline style to set the width dynamically based on percentage
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                </div>
                {/* Button - Using an anchor tag assuming it links somewhere */}
                <Link to={formLink} className="DashBoardHeader__completeButton">
                    Complete Profile
                </Link>
                {/* Alternatively, if it triggers an action within the app:
        <button className="DashBoardHeader__completeButton">
          Complete Profile
        </button>
        */}
            </div>
        </div>
    );
};

export default DashBoardHeader;