// src/pages/Resume.jsx
import '../styles/resume.css';
import { Link } from 'react-router-dom';

function Resume() {
    return (
        <div className="flex-row">
            <div className="resume-container">
                {/* Header */}
                <header className="header">
                    <h1>Quang Bui</h1>
                    <div className="contact-info">
                        <p>Houston, Texas 77064</p>
                        <p>(539) 292-6908 | qbui011099@gmail.com</p>
                        <div className="links">
                            <a href="https://www.linkedin.com/in/quang-bui-4b7059256/" target="_blank" rel="noreferrer">LinkedIn</a>
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
                    <div class="line"></div>
                    <div>
                        <h3>Master's in Computer Science</h3>
                        <p>Oklahoma City University (2024-2026)</p>
                        <p>GPA: 4.0</p>
                    </div>
                    <div>
                        <h3>Bachelor's in Computer Science</h3>
                        <p>Northeastern State University (2020-2023)</p>
                        <p class="italic">Summa Cum Laude: Graduated with honors</p>
                    </div>
                </section>
                <section className="skills">
                    <h2>Technical Skills</h2>
                    <div class="line"></div>
                    <div class="grid">
                        <div>
                            <h3>Programming Languages:</h3>
                            <p>C#, JavaScript</p>
                            <p>Python, C/C++, SQL</p>
                        </div>
                        <div>
                            <h3>Tools & Technologies:</h3>
                            <p>VS Code, Git, MongoDB, ReactJS, Angular, .NET,  Node.js</p>
                            <p>Tailwind, Bootstrap, Game Development.</p>
                        </div>
                        <div>
                            <h3>Languages:</h3>
                            <p>English, Vietnamese</p>
                        </div>
                    </div>
                </section>
                <section className="work-experience">
                    <h2>Work Experience</h2>
                    <div className="line"></div>
                    <div>
                        <h3>Software Development Intern</h3>
                        <p>American Fidelity (June 2025 - Present)</p>
                        <div className="project-def">
                            <p> ● Developed a customer feedback app with 1 other team member using the MERN stack
                                <span style={{ fontWeight: 500 }}>(MongoDB,
                                    Express.js, React.js, Node.js)</span>, enabling efficient customer-employee
                                communication.
                            </p>
                            <p>
                                ● Designed and developed the front-end application using React.js, implementing
                                responsive
                                UI
                                components and integrating with <span style={{ fontWeight: 500 }}>back-end APIs</span>
                                built using Node.js and Express.js to
                                manage
                                user
                                authentication, customer feedback. Enhancing customer satisfaction by 20% through
                                streamlined
                                feedback loops.
                            </p>
                            <p> ● Implemented manager-employee communication features, leading to a 15% improvement in
                                employee
                                performance and customer retention.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3>Software Engineer</h3>
                        <p>Tranquility Nail and Spa (June 2023 - May 2024)</p>
                        <div className="project-def">
                            <p> ● Developed a customer feedback app with 1 other team member using the MERN stack
                                <span style={{ fontWeight: 500 }}>(MongoDB,
                                    Express.js, React.js, Node.js)</span>, enabling efficient customer-employee
                                communication.
                            </p>
                            <p>
                                ● Designed and developed the front-end application using React.js, implementing
                                responsive
                                UI
                                components and integrating with <span style={{ fontWeight: 500 }}>back-end APIs</span>
                                built using Node.js and Express.js to
                                manage
                                user
                                authentication, customer feedback. Enhancing customer satisfaction by 20% through
                                streamlined
                                feedback loops.
                            </p>
                            <p> ● Implemented manager-employee communication features, leading to a 15% improvement in
                                employee
                                performance and customer retention.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="projects">
                    <h2>Project Experience</h2>
                    <div className="line"></div>
                    <div>
                        <h3>WriteBetter</h3>
                        <div className="project-def">
                            <p>
                                ● Develop a fully functional Sudoku game with a GUI using <span
                                    style={{ fontWeight: 500 }}>Python and Tkinter.</span>
                            </p>
                            <p>
                                ● Developed a Sudoku solving algorithm to provide hints and solutions for user-generated
                                puzzles.
                            </p>
                            <p>
                                ● Incorporated features for submitting solutions, starting new games, and tracking
                                elapsed
                                time during gameplay.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3>VidSummarizer</h3>
                        <div className="project-def">
                            <p>● Developed an <span style={{ fontWeight: 500 }}>AI-driven</span> application to convert
                                YouTube video content into concise
                                summaries
                                using <span style={{ fontWeight: 500 }}>OpenAI's GPT models, Langchain framework, Python
                                    and Flask</span>, enhancing content
                                digestibility and accessibility </p>
                            <p>
                                ● Designed and implemented a responsive web interface that allows users to easily input
                                video
                                URLs and display summaries, utilizing <span style={{ fontWeight: 500 }}>HTML, CSS, and
                                    JavaScript.</span>
                            </p>
                            <p>
                                ● Ensured robust application performance and security by integrating CORS in Flask,
                                achieving a
                                significant improvement in response efficiency.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3>Math Bingo</h3>
                        <div className="project-def">
                            <p>
                                ● Developed an engaging Math Bingo game with a modern interface and dynamic animations,
                                utilizing <span style={{ fontWeight: 500 }}>HTML, CSS, and JavaScript</span> to enhance
                                user experience and interactivity.
                            </p>
                            <p>
                                ● Integrated real-time gameplay features and optimized user interface elements,
                                leveraging
                                JavaScript for interactive functionality and CSS animations for visually appealing
                                effects.
                            </p>
                            <p>
                                ● Collaborated in a team environment using <span style={{ fontWeight: 500 }}>Git for
                                    version control</span>, ensuring efficient
                                code
                                management and smooth project workflow across multiple contributors.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3>Sudoku Solver</h3>
                        <div className="project-def">
                            <p>
                                ● Develop a fully functional Sudoku game with a GUI using <span
                                    style={{ fontWeight: 500 }}>Python and Tkinter.</span>
                            </p>
                            <p>
                                ● Developed a Sudoku solving algorithm to provide hints and solutions for user-generated
                                puzzles.
                            </p>
                            <p>
                                ● Incorporated features for submitting solutions, starting new games, and tracking
                                elapsed
                                time during gameplay.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="awards">
                    <h2>Awards</h2>
                    <div className="line"></div>
                    <ul>
                        <li>International Scholarship: Awarded by Northeastern State University</li>
                        <li>Dean's List: Acknowledged at both Oklahoma City Uinversity and Northeastern State University
                        </li>
                    </ul>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <p>&copy; 2025 Quang Bui. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default Resume;
