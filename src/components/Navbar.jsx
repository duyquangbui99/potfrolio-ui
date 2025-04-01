// Navbar.jsx
import React from "react";
import menuIcon from '../assets/images/menu.svg';

const Navbar = () => {
    return (
        <div className="top-navbar">
            <div className="open-menu" id="open-menu">
                <img src={menuIcon} alt="menu Logo" className="menu-icon" />
            </div>
            <div className="menu-text">
                <h2>Quang Bui</h2>
            </div>
        </div>
    );
};

export default Navbar;
