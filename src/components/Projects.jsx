import projects from "../assets/projectsData";

import '../styles/project.css';


function Projects() {
    return (
        <div className="container">
            <div className="project-grid">
                {projects.map((project, index) => (
                    <a href={project.link} target="_blank" rel="noreferrer" key={index}>
                        <div className="project-card">
                            <img src={project.image} alt={project.title} className="project-image" />
                            <div className="content">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="stack">
                                    {project.stack.map((tech, i) => (
                                        <span className="badge" key={i}>{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Projects;
