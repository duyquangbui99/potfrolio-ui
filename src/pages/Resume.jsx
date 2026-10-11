// src/pages/Resume.jsx
import '../styles/resume.css';
import { Link } from 'react-router-dom';
import resumePdf from '../assets/Quang Bui - Resume.pdf';

function Resume() {
    return (
        <div className="flex-row resume-page">
            <div className="resume-container">
                <div className="window-bar">
                    <div className="window-dots"><span></span><span></span><span></span></div>
                    <p className="window-url">quangbui.dev/resume</p>
                </div>
                <div className="resume-body">
                {/* Header */}
                <header className="header">
                    <h1>Quang Bui</h1>
                    <div className="contact-info">
                        <p>Tulsa, OK</p>
                        <p>(539) 292-6908 | qbui011099@gmail.com</p>
                        <div className="links">
                            <a href={resumePdf} download="Quang Bui - Resume.pdf" className="export-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 3v12" />
                                    <path d="m7 10 5 5 5-5" />
                                    <path d="M5 21h14" />
                                </svg>
                                Export PDF
                            </a>
                            <a href="https://linkedin.com/in/duyquangbui99" target="_blank" rel="noreferrer">LinkedIn</a>
                            <a href="https://github.com/duyquangbui99" target="_blank" rel="noreferrer">GitHub</a>
                            <Link to="/">
                                Personal Website
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Sections */}
                <section className="education">
                    <h2>Education</h2>
                    <div className="line"></div>
                    <div>
                        <h3>Master's in Computer Science</h3>
                        <div className="flex-row-resume">
                            <p>Oklahoma City University (Oklahoma City, OK)</p>
                            <p>Aug 2024 - Dec 2025</p>
                        </div>
                        <p>GPA: 3.97</p>
                    </div>
                    <div>
                        <h3>Bachelor of Science in Computer Science</h3>
                        <div className="flex-row-resume">
                            <p>Northeastern State University (Tahlequah, OK)</p>
                            <p>Aug 2020 - May 2023</p>
                        </div>
                        <p className="italic">Summa Cum Laude</p>
                    </div>
                </section>
                <section className="work-experience">
                    <h2>Work Experience</h2>
                    <div className="line"></div>
                    <div>
                        <h3>Full Stack Developer</h3>
                        <div className="flex-row-resume">
                            <p>Paul Logistic (Tulsa, OK)</p>
                            <p>Apr 2026 - Present</p>
                        </div>
                        <div className="project-def">
                            <p> ● Built automation pipelines with <span style={{ fontWeight: 500 }}>Python and Selenium</span> to handle freight booking and dispatch workflows, eliminating manual load entry and <span style={{ fontWeight: 500 }}>increasing daily freight throughput by 35%.</span>
                            </p>
                            <p> ● Designed serverless integrations with <span style={{ fontWeight: 500 }}>AWS Lambda behind API Gateway</span>, giving outside vendors and carriers secure endpoints to tender loads and push status updates directly into the system instead of by phone and email.
                            </p>
                            <p> ● Developed internal tooling and data visualization dashboards for the pricing analyst team using <span style={{ fontWeight: 500 }}>React, Node.js, and PostgreSQL</span>, replacing manual spreadsheet reporting with real-time lane rate and margin views.
                            </p>
                            <p> ● Provisioned and maintained AWS infrastructure <span style={{ fontWeight: 500 }}>(EC2, Lambda, API Gateway) as code</span>, standardizing dev and production environments and <span style={{ fontWeight: 500 }}>reducing deployment time by 50%.</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3>Software Development Intern</h3>
                        <div className="flex-row-resume">
                            <p>American Fidelity (Oklahoma City, OK)</p>
                            <p>Jan 2025 - Dec 2025</p>
                        </div>
                        <div className="project-def">
                            <p> ● Assisted in the full-stack development of the American Fidelity internal application, optimizing performance and improving production efficiency, <span style={{ fontWeight: 500 }}>reducing page load time.</span>
                            </p>
                            <p> ● Designed and implemented new features, models, and responsive UI components using <span style={{ fontWeight: 500 }}>C#, .NET, Angular, Bootstrap 5, HTML, and SASS</span>, enhancing user experience and <span style={{ fontWeight: 500 }}>increasing accessibility by 20%.</span>
                            </p>
                            <p> ● Collaborated with QA and development teams to test, refine, and deploy updates across multiple environments using Octopus Deploy, <span style={{ fontWeight: 500 }}>reducing deployment errors by 10% and improving release efficiency.</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3>Web Developer</h3>
                        <div className="flex-row-resume">
                            <p>Tranquility Nail and Spa (Tulsa, OK)</p>
                            <p>June 2023 - May 2024</p>
                        </div>
                        <div className="project-def">
                            <p> ● Developed a customer feedback app with a team member using the MERN stack <span style={{ fontWeight: 500 }}>(MongoDB, Express.js, React.js, Node.js)</span>, enabling efficient customer-employee communication.
                            </p>
                            <p> ● Built the React.js front end and integrated <span style={{ fontWeight: 500 }}>Node.js and Express.js APIs</span> for user authentication and feedback management, <span style={{ fontWeight: 500 }}>enhancing customer satisfaction by 20%</span> through streamlined feedback loops.
                            </p>
                            <p> ● Implemented manager-employee communication features, <span style={{ fontWeight: 500 }}>leading to a 15% improvement in employee performance and customer retention.</span>
                            </p>
                        </div>
                    </div>
                </section>
                <section className="projects">
                    <h2>Projects</h2>
                    <div className="line"></div>
                    <div>
                        <h3>Schedulo <span style={{ fontWeight: 400, fontStyle: 'italic' }}>| React, Node, Express, MongoDB</span> · <a href="https://spaproject-ui.vercel.app/" target="_blank" rel="noreferrer">Live Demo</a></h3>
                        <div className="project-def">
                            <p> ● Built and deployed a full-stack booking management system, <span style={{ fontWeight: 500 }}>handling over 200 booking requests per day</span>, streamlining appointment scheduling and resource allocation for both customers and staff.
                            </p>
                            <p> ● Designed responsive UI and real-time email notifications, <span style={{ fontWeight: 500 }}>reducing no-shows by 30% and increasing booking efficiency by 25%.</span>
                            </p>
                            <p> ● Developed AI-powered caption generation and Facebook auto-posting features, <span style={{ fontWeight: 500 }}>increasing weekly social media engagement by 40%.</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3>VidSummarizer <span style={{ fontWeight: 400, fontStyle: 'italic' }}>| Python, LangChain, Flask, HTML, JavaScript, CSS</span> · <a href="https://github.com/duyquangbui99/VidSummarizer" target="_blank" rel="noreferrer">Source Code</a></h3>
                        <div className="project-def">
                            <p> ● Developed an <span style={{ fontWeight: 500 }}>AI-driven</span> application that converts YouTube video content into concise summaries using <span style={{ fontWeight: 500 }}>OpenAI GPT models, LangChain, Python, and Flask</span> with CORS-secured endpoints.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="skills">
                    <h2>Technical Skills</h2>
                    <div className="line"></div>
                    <div className="grid">
                        <div>
                            <h3>Languages:</h3>
                            <p>Python, C/C++, SQL (PostgreSQL)</p>
                            <p>JavaScript, TypeScript, HTML/CSS</p>
                            <p>C# (ASP.NET Core)</p>
                        </div>
                        <div>
                            <h3>Frameworks & Libraries:</h3>
                            <p>React, Angular, Node.js, Express</p>
                            <p>Blazor, Flask, Selenium</p>
                        </div>
                        <div>
                            <h3>Cloud & DevOps:</h3>
                            <p>AWS (EC2, Lambda, API Gateway), Azure</p>
                            <p>Infrastructure as Code, Docker, CI/CD</p>
                            <p>Octopus Deploy, Git</p>
                        </div>
                        <div>
                            <h3>Databases & Tools:</h3>
                            <p>PostgreSQL, MongoDB, SQL Server</p>
                            <p>REST APIs, ServiceNow</p>
                            <p>Visual Studio, VS Code, PyCharm</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <p>&copy; 2026 Quang Bui. All rights reserved.</p>
                </footer>
                </div>
            </div>
        </div>
    );
}

export default Resume;
