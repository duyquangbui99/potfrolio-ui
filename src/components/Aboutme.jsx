import projectIcon from '../assets/images/project.svg';
import resumeIcon from '../assets/images/resume.svg';
import avatar from '../assets/images/meAvatar.png';
import TechStack from './TechStack';
import Chatbot from './Chatbot';
import Projects from './Projects';
import HireMe from './Hireme';
import '../styles/aboutMe.css';
import Experiences from './Experiences';
import { Link } from 'react-router-dom';


function AboutMe({ isOpen }) {

    return (
        <div className="main-about-me" id="aboutme">
            <div className="about-me">
                <div className="about-me-text">
                    <h1>QUANG BUI</h1>
                    <h2>Dedicated and Enthusiastic Software Engineer</h2>
                    <p>
                        Hi, I’m Quang! I’m a tech enthusiast and graduate student at Oklahoma City University, finishing my Master’s in Computer Science by December 2025.</p>
                    <p>  I specialize in full-stack development using modern frameworks and libraries, and I have working knowledge of Azure cloud computing. As a current Software Development Intern at American Fidelity, I contribute to building scalable, real-world applications.</p>

                    <p style={{ fontWeight: 500 }}>
                        I am actively seeking a summer internship or full-time role as a software engineer or full-stack developer where I can apply my skills to deliver impactful solutions.
                    </p>

                    <div className="flex-row gap-30">
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
                    </div>

                    <div className="line-break-3"></div>
                </div>

                {/* ⬇️ Conditionally render */}
                {!isOpen && (
                    <div className="circle-container">
                        <div className="circle circle1"></div>
                        <div className="circle circle2"></div>
                        <div className="avatar-container">
                            <img src={avatar} alt="Avatar" className="avatar" />
                        </div>
                    </div>
                )}
            </div>

            <TechStack />

            <Experiences />

            {/* Projects Section */}
            <div className="project-section" id="projects">
                <h1>PROJECT</h1>
                <Chatbot isOpen={isOpen} />
            </div>

            <div className="project-section" id="projects">
                <h1 style={{ paddingTop: "30px" }}>MORE PROJECTS</h1>
                <Projects />
            </div>

            <HireMe />

        </div>
    );
}

export default AboutMe;
