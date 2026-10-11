// src/assets/techStackData.js
import python from '../assets/images/python.svg';
import selenium from '../assets/images/selenium.svg';
import cSharp from '../assets/images/cSharp.svg';
import html from '../assets/images/html.svg';
import css from '../assets/images/css.svg';
import js from '../assets/images/js.svg';
import typescript from '../assets/images/typescript.svg';
import react from '../assets/images/react.svg';
import mongoDB from '../assets/images/mongodb.svg';
import postgresql from '../assets/images/postgresql.svg';
import dotnet from '../assets/images/dotnet.svg';
import flask from '../assets/images/flask.svg';
import nodejs from '../assets/images/nodejs.svg';
import angular from '../assets/images/angular.svg';
import aws from '../assets/images/aws.svg';
import azure from '../assets/images/azure.svg';



const techStack = [
    {
        icon: python,
        alt: 'python, selenium',
        description: `Python has been my go-to language since I first started coding. Today I use it with Selenium to build automation pipelines for freight booking and dispatch workflows, and I’ve also used it with Flask and LangChain to build AI-driven tools.`,
        multiple: [python, selenium]
    },
    {
        icon: aws,
        alt: 'aws, azure',
        description: `I provision and maintain AWS infrastructure (EC2, Lambda, API Gateway) as code, and I build serverless integrations that give vendors and carriers secure endpoints. I’ve also worked with Azure, Docker, CI/CD pipelines, and Octopus Deploy to ship releases across multiple environments.`,
        multiple: [aws, azure]
    },
    {
        icon: react,
        alt: 'react, angular',
        description: `I build front ends with React and Angular. I use React for internal tools and data visualization dashboards that replace manual spreadsheet reporting, and I used Angular with Bootstrap 5 and SASS to ship accessible, responsive UI components during my internship at American Fidelity.`,
        multiple: [react, angular]
    },
    {
        icon: nodejs,
        alt: 'nodejs and flask',
        description: `I build REST APIs with Node.js and Express for full-stack apps such as my booking system Schedulo, and I use Flask for lightweight backend services in AI-driven apps, with a focus on clean, secure API design.`,
        multiple: [nodejs, flask]
    },
    {
        icon: cSharp,
        alt: 'c# .Net',
        description: `I use C# with ASP.NET Core and Blazor. At American Fidelity I designed and implemented new features, models, and UI components for an internal C# .NET application.`,
        multiple: [cSharp, dotnet]
    },
    {
        icon: postgresql,
        alt: 'postgresql, mongodb',
        description: `I work with PostgreSQL, MongoDB, and SQL Server and pick between SQL and NoSQL based on the shape of the data. I enjoy designing schemas and queries that power real-time reporting, such as lane rate and margin views.`,
        multiple: [postgresql, mongoDB]
    },
    {
        icon: js,
        alt: 'html, css, js, typescript',
        description: `HTML, CSS, JavaScript, and TypeScript are the foundation of most of my day-to-day work, from responsive layouts to type-safe front-end and Node.js code.`,
        multiple: [html, css, js, typescript]
    }
];

export default techStack;
