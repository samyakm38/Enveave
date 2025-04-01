import React from 'react';
import PropTypes from 'prop-types'; // Optional, but good practice for type checking
import './stylesheet/DashBoardCard.css'; // We'll create this CSS file next

// Props: title, count, borderColor with default parameters
const DashBoardCard = ({ 
    title = 'Card Title', 
    count = 0, 
    borderColor = '#cccccc' 
}) => {
    // Style object for the left border color
    const cardStyle = {
        borderLeftColor: borderColor
    };

    return (
        <div className="DashBoardCard--item" style={cardStyle}>
            <div className="DashBoardCard--content">
                <p className="DashBoardCard--title">{title}</p>
                <p className="DashBoardCard--count">{count}</p>
            </div>
        </div>
    );
};

// Define prop types for better component documentation and error checking
DashBoardCard.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    borderColor: PropTypes.string.isRequired, // Expecting a CSS color string (e.g., '#FF0000', 'red')
};

export default DashBoardCard;