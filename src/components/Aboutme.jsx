import projectIcon from '../assets/images/project.svg';
import resumeIcon from '../assets/images/resume.svg';
import avatar from '../assets/images/meAvatar.webp';
import TechStack from './TechStack';
import Chatbot from './Chatbot';
import Projects from './Projects';
import HireMe from './Hireme';
import '../styles/aboutMe.css';
import Experiences from './Experiences';
import BookingProject from './BookingProject';
import { Link } from 'react-router-dom';
import WindowBar from './WindowBar';
import { useWindow } from '../context/WindowContext';


function AboutMe({ isOpen }) {
    const { panelProps: { windowClass, ref: panelRef, onAnimationEnd } } = useWindow();

    return (
        <div className={`main-about-me ${windowClass}`} ref={panelRef} onAnimationEnd={onAnimationEnd} id="aboutme">
            <WindowBar url="quangbui.dev" />
            <div className="about-me">
                <div className="about-me-text">
                    <h1 className="hero-name">Quang Bui</h1>
                    <h2 className="hero-role">full stack developer</h2>
                    <p>
                        Hi, I’m Quang! I’m a Full Stack Developer at Paul Logistic in Tulsa, OK, with a Master’s in Computer Science from Oklahoma City University.</p>
                    <p>  I build automation pipelines with Python and Selenium, serverless integrations on AWS , and internal dashboards with React, Node.js, and PostgreSQL. Before that, I was a Software Development Intern at American Fidelity, shipping features in C#, .NET, and Angular.</p>

                    <p style={{ fontWeight: 500 }}>
                        I enjoy turning manual, repetitive workflows into reliable software that teams actually use.
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
                <h1 className="section-title">Projects</h1>
                <Chatbot isOpen={isOpen} />
                <BookingProject />
            </div>

            <div className="project-section" id="projects">
                <h1 className="section-title" style={{ paddingTop: "30px" }}>More Projects</h1>
                <Projects />
            </div>

            <HireMe />

        </div>
    );
}

export default AboutMe;
