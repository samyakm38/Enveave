import React from 'react';
import './stylesheet/ButtonOrange.css'
import {Link} from "react-router-dom";

const ButtonOrange=({text, link}) => {
    return (
        <Link to={link}>
            <div className="button-orange-container">
                {text}
            </div>
        </Link>

    );
};

export default ButtonOrange;