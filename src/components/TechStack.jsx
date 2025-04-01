import techStack from '../assets/techStackData';

function TechStack() {
    return (
        <div className="tech-used">
            <h1>TECHNICAL STACK</h1>
            <div className="tech-stack">
                {techStack.map((tech, index) => (
                    <div className="flex-iem" key={index}>
                        {tech.multiple ? (
                            <div className="mutiple-icons paddbottom10px">
                                {tech.multiple.map((src, i) => (
                                    <img key={i} src={src} alt={tech.alt} className="tech-icon" />
                                ))}
                            </div>
                        ) : (
                            <img src={tech.icon} alt={tech.alt} className="tech-icon paddbottom20px" />
                        )}
                        <p>{tech.description}</p>
                    </div>
                ))}
            </div>
            <div className="line-break-3"></div>
        </div>
    );
}

export default TechStack;
