import React from "react";
import expData from "../assets/expData";
import "../styles/experience.css";

function Experiences() {
    return (
        <section className="experience-section" id="experience">
            <h1>Work Experience</h1>

            <div className="experiences-container">
                {expData.map((exp, index) => (
                    <div key={index} className="experience-item">
                        {/* Icon and Info Section */}
                        <div className="exp-header">
                            <div className="exp-logo">
                                <img src={exp.logo} alt={`${exp.company} logo`} />
                            </div>

                            <div className="exp-title-info">
                                <div className="exp-position-company">
                                    <h3>{exp.position} <span className="dot-separator">•</span> {exp.company}</h3>
                                </div>


                                <div className="exp-metadata">
                                    <span className="location-tag">{exp.location}</span>
                                    <span className="date-tag">{exp.date}</span>
                                </div>


                            </div>
                        </div>

                        {/* Experience Details */}
                        <div className="exp-details">
                            {exp.details.map((detail, idx) => (
                                <div key={idx} className="detail-item">
                                    <span className="bullet"></span> {detail}
                                </div>
                            ))}
                        </div>

                        {/* Technology Stack Tags */}
                        {exp.stack && (
                            <div className="tech-stack-resume">
                                {exp.stack.map((tech, idx) => (
                                    <span key={idx} className="stack-tag">{tech}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="line-break-3"></div>
        </section>
    );
}

export default Experiences;