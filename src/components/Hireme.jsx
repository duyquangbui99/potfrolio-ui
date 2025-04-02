// src/components/HireMe.jsx

import mailIcon from '../assets/images/email.svg';
import linkedinIcon from '../assets/images/linkedInIcon.svg';
import "../styles/hireme.css"; // optional if you have a separate style for it

function HireMe() {
    return (
        <>
            <section id="contact">
                <p style={{ fontSize: "1.3rem" }}>Get in Touch</p>
                <h1>Contact Me</h1>
                <div className="contact-info-upper-container">
                    <div className="contact-info-container">
                        <img src={mailIcon} alt="Email icon" className="email-icon" />
                        <p><a href="mailto:qbui011099@gmail.com">qbui011099@gmail.com</a></p>
                    </div>
                    <div className="contact-info-container">
                        <img src={linkedinIcon} alt="LinkedIn icon" className="contact-icon" />
                        <p>
                            <a href="https://www.linkedin.com/in/quang-bui-4b7059256/" target="_blank" rel="noreferrer">
                                LinkedIn
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            <div className="copy-right">
                <p>Copyright © Quang Bui</p>
            </div>
        </>
    );
}

export default HireMe;
