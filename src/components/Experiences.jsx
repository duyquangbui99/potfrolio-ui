import expData from "../assets/expData";
import "../styles/experience.css";

function Experiences() {
    return (
        <section className="experience-section" id="experience">
            <h1>EXPERIENCE</h1>
            {expData.map((exp, index) => (
                <div key={index} className="experience-card">
                    <h2>{exp.position} | {exp.company}</h2>
                    <p className="exp-location-date">{exp.location} | {exp.date}</p>
                    <ul>
                        {exp.details.map((point, idx) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}

export default Experiences;
