// Sidebar.jsx
import React from "react";
import avatar from '../assets/images/mePic.JPG';
import addressPin from '../assets/images/location.svg';
import linkedInIcon from '../assets/images/linkedInIcon.svg';
import gitHubIcon from '../assets/images/githubIcon.svg';
import personIcon from '../assets/images/personIcon.svg';
import projectIcon from '../assets/images/project.svg';
import resumeIcon from '../assets/images/resume.svg';
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
                <p>Hi, I'm Quang Bui | SWE intern at American Fidelity | Graduate Student at Oklahoma City University</p>

                <div className="logo-div">
                    <img src={addressPin} alt="Address Pin" className="address-pin" />
                    <p>Houston, Texas</p>
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
                    <Link to="/?scroll=aboutme" onClick={toggleSidebar}>
                        <div className="logo-div">
                            <img src={personIcon} alt="person Logo" className="person-icon" />
                            <h3>About Me</h3>
                        </div>
                    </Link>
                    <Link to="/?scroll=projects" onClick={toggleSidebar}>
                        <div className="logo-div">
                            <img src={projectIcon} alt="project Logo" className="project-icon" />
                            <h3>Projects</h3>
                        </div>
                    </Link>
                    <Link to="/resume" onClick={toggleSidebar}>
                        <div className="logo-div logo-section">
                            <img src={resumeIcon} alt="resume Logo" className="resume-icon" />
                            <h3>Resume</h3>
                        </div>
                    </Link>
                    <div className="hire-me-button">
                        <Link to="/?scroll=contact" onClick={toggleSidebar}>
                            <div className="logo-div logo-section">
                                <img src={hiremeIcon} alt="hireme Logo" className="hireme-icon" />
                                <p style={{ fontWeight: 600, fontSize: '19px' }} className="white">Hire me</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Static Nav for large screen */}
            <div className="side-bar nav-items">
                <Link to="/?scroll=aboutme">
                    <div className="logo-div">
                        <img src={personIcon} alt="person Logo" className="person-icon" />
                        <h3>About Me</h3>
                    </div>
                </Link>
                <Link to="/?scroll=projects">
                    <div className="logo-div">
                        <img src={projectIcon} alt="project Logo" className="project-icon" />
                        <h3>Projects</h3>
                    </div>
                </Link>
                <Link to="/resume">
                    <div className="logo-div logo-section">
                        <img src={resumeIcon} alt="resume Logo" className="resume-icon" />
                        <h3>Resume</h3>
                    </div>
                </Link>
                <div className="hire-me-button">
                    <Link to="/?scroll=contact">
                        <div className="logo-div logo-section">
                            <img src={hiremeIcon} alt="hireme Logo" className="hireme-icon" />
                            <p style={{ fontWeight: 600, fontSize: '19px' }} className="white">Hire me</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default Sidebar;
