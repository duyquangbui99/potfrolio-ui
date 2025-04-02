import projectIcon from '../assets/images/project.svg';
import resumeIcon from '../assets/images/resume.svg';
import avatar from '../assets/images/meAvatar.png';
import TechStack from './TechStack';
import Chatbot from './Chatbot';
import Projects from './Projects';
import HireMe from './Hireme';
import '../styles/aboutMe.css';



function AboutMe({ isOpen }) {

    return (
        <div className="main-about-me" id="aboutme">
            <div className="about-me">
                <div className="about-me-text">
                    <h1>QUANG BUI</h1>
                    <h2>Dedicated and Enthusiastic Software Engineer</h2>
                    <p>
                        I’m Quang, a tech enthusiast and grad student at Oklahoma City University, working towards my
                        Master’s in Computer Science. I love solving problems with code and turning creative ideas into
                        real, impactful applications. Whether I’m building AI tools to make information more accessible
                        or crafting customer feedback apps to improve business operations, I’m all about finding smart,
                        efficient solutions. Let’s chat if you’re looking for someone who’s driven by curiosity, loves a
                        good challenge, and is always looking to learn and grow in the tech world.
                    </p>
                    <p style={{ fontWeight: 500 }}>
                        I’m also actively looking for a summer 2025 internship to further apply my skills and gain
                        hands-on experience.
                    </p>

                    <div className="flex-row gap-30">
                        <a href="#projects">
                            <div className="logo-div">
                                <img src={projectIcon} alt="project Logo" className="project-icon" />
                                <h3>Projects</h3>
                            </div>
                        </a>
                        <a href="/resume">
                            <div className="logo-div logo-section">
                                <img src={resumeIcon} alt="resume Logo" className="resume-icon" />
                                <h3>Resume</h3>
                            </div>
                        </a>
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
