import AFA from '../assets/images/afalogo.webp';
import tranquility from '../assets/images/tranquility.webp';
import paulLogistic from '../assets/images/paul-square.webp';
const expData = [
    {
        position: "Full Stack Developer",
        logo: paulLogistic,
        company: "Paul Logistic",
        location: "Tulsa, OK",
        date: "Apr 2026 – Present",
        details: [
            "Built automation pipelines with Python and Selenium to handle freight booking and dispatch workflows, eliminating manual load entry and increasing daily freight throughput by 35%.",
            "Designed serverless integrations with AWS Lambda behind API Gateway, giving outside vendors and carriers secure endpoints to tender loads and push status updates directly into the system instead of by phone and email.",
            "Developed internal tooling and data visualization dashboards for the pricing analyst team using React, Node.js, and PostgreSQL, replacing manual spreadsheet reporting with real-time lane rate and margin views.",
            "Provisioned and maintained AWS infrastructure (EC2, Lambda, API Gateway) as code, standardizing dev and production environments and reducing deployment time by 50%."
        ],
        stack: ["Python", "Selenium", "AWS", "React", "Node.js", "PostgreSQL"]
    },
    {
        position: "Software Development Intern",
        logo: AFA,
        company: "American Fidelity",
        location: "OKC, OK",
        date: "Jan 2025 – Dec 2025",
        details: [
            "Assisted in the full-stack development of the American Fidelity internal application, optimizing performance and improving production efficiency, reducing page load time.",
            "Designed and implemented new features, models, and responsive UI components using C#, .NET, Angular, Bootstrap 5, HTML, and SASS, enhancing user experience and increasing accessibility by 20%.",
            "Collaborated with QA and development teams to test, refine, and deploy updates across multiple environments using Octopus Deploy, reducing deployment errors by 10% and improving release efficiency."
        ],
        stack: ["C#", ".NET", "Angular", "Bootstrap 5", "SASS", "Octopus Deploy"]
    },
    {
        position: "Web Developer",
        logo: tranquility,
        company: "Tranquility Nail and Spa",
        location: "Tulsa, OK",
        date: "June 2023 - May 2024",
        details: [
            "Developed a customer feedback app with a team member using the MERN stack (MongoDB, Express.js, React.js, Node.js), enabling efficient customer-employee communication.",
            "Built the React.js front end and integrated Node.js and Express.js APIs for user authentication and feedback management, enhancing customer satisfaction by 20% through streamlined feedback loops.",
            "Implemented manager-employee communication features, leading to a 15% improvement in employee performance and customer retention."
        ],
        stack: ["React", "MongoDB", "Express", "Node.js"]
    }
];

export default expData;
