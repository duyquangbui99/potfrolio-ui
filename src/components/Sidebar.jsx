// Sidebar.jsx
import React from "react";
import avatar from '../assets/images/mePic.webp';
import addressPin from '../assets/images/location.svg';
import linkedInIcon from '../assets/images/linkedInIcon.svg';
import gitHubIcon from '../assets/images/githubIcon.svg';
import hiremeIcon from '../assets/images/hireme.png';

import '../styles/sidebarNav.css';
import { Link } from 'react-router-dom';
import useScrollToSection from "../hooks/useScrollToSection";


const Sidebar = ({ isOpen, toggleSidebar }) => {
    useScrollToSection();
    return (
        <div className="main-sidebar">
            {/* Sidebar with toggle state */}
            <div className={`nav-side-bar side-bar ${isOpen ? 'sidebar-open' : ''}`}>
                {!isOpen && <h2>Quang Bui</h2>}
                <img src={avatar} alt="avatar" className="img-ava" />
                <p>Hi, I'm Quang Bui | Full Stack Developer at Paul Logistic | M.S. in Computer Science, Oklahoma City University</p>

                <div className="logo-div">
                    <img src={addressPin} alt="Address Pin" className="address-pin" />
                    <p>Tulsa, Oklahoma</p>
                </div>
                <div className="line-break"></div>

                <div className="logo-div">
                    <a href="https://www.linkedin.com/in/duyquangbui99/" target="_blank" rel="noreferrer">
                        <img src={linkedInIcon} alt="LinkedIn Logo" className="linkedin-icon" />
                    </a>
                    <a href="https://github.com/duyquangbui99" target="_blank" rel="noreferrer">
                        <img src={gitHubIcon} alt="Github Logo" className="github-icon" />
                    </a>
                </div>
                {/* Nav for small screen */}
                <div className="padd20 hidden-deft">
                    <div className="nav-links">
                        <Link to="/?scroll=aboutme" onClick={toggleSidebar}>
                            <h3>About Me</h3>
                        </Link>
                        <Link to="/?scroll=projects" onClick={toggleSidebar}>
                            <h3>Projects</h3>
                        </Link>
                        <Link to="/resume" onClick={toggleSidebar}>
                            <h3>Resume</h3>
                        </Link>
                    </div>
                    <div className="hire-me-button">
                        <Link to="/?scroll=contact" onClick={toggleSidebar}>
                            <div className="logo-div logo-section">
                                <img src={hiremeIcon} alt="hireme Logo" className="hireme-icon" />
                                <p style={{ fontWeight: 600, fontSize: '19px' }} className="white">Contact</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Static Nav for large screen */}
            <div className="side-bar nav-items">
                <div className="nav-links">
                    <Link to="/?scroll=aboutme">
                        <h3>About Me</h3>
                    </Link>
                    <Link to="/?scroll=projects">
                        <h3>Projects</h3>
                    </Link>
                    <Link to="/resume">
                        <h3>Resume</h3>
                    </Link>
                </div>
                <div className="hire-me-button">
                    <Link to="/?scroll=contact">
                        <div className="logo-div logo-section">
                            <img src={hiremeIcon} alt="hireme Logo" className="hireme-icon" />
                            <p style={{ fontWeight: 600, fontSize: '19px' }} className="white">Contact</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default Sidebar;
