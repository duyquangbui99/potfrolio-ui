// src/assets/techStackData.js
import python from '../assets/images/python.svg';
import cSharp from '../assets/images/cSharp.svg';
import html from '../assets/images/html.svg';
import css from '../assets/images/css.svg';
import js from '../assets/images/js.svg';
import react from '../assets/images/react.svg';
import mongoDB from '../assets/images/mongodb.svg';
import sql from '../assets/images/sql.svg';
import dotnet from '../assets/images/dotnet.svg';
import flask from '../assets/images/flask.svg';
import nodejs from '../assets/images/nodejs.svg';
import angular from '../assets/images/angular.svg';



const techStack = [
    {
        icon: python,
        alt: 'python',
        description: `I’ve been using Python since I first started coding, and it quickly became my go-to language. What I love most about Python is its versatility. Over the years, I’ve built everything from simple scripts to AI-driven tools using Python, and it’s always exciting to see the impact it can have across various fields.`,
    },
    {
        icon: cSharp,
        alt: 'c# .Net',
        description: `Gained hands-on experience with C# and the .NET framework through recent development work, including porting a legacy VB application to C#. Previously explored C# in a game programming course using Unity, where I built interactive projects and deepened my understanding of object-oriented programming (OOP) principles.`,
        multiple: [cSharp, dotnet]
    },
    {
        icon: '/static/images/html.svg',
        alt: 'html, css, js',
        description: `I work with HTML, CSS, and JavaScript almost daily to build projects. These core web technologies are essential for creating responsive, dynamic applications, and they’ve been the foundation of much of my development work.`,
        multiple: [html, css, js]
    },
    {
        icon: react,
        alt: 'react, angular',
        description: `I enjoy working with React and Angular for their component-based structure, which made it easier to build and maintain scalable UIs in my recent projects. React’s flexibility was especially useful when developing the customer feedback app, while Angular’s built-in tools helped streamline frontend tasks in my internship.`,
        multiple: [react, angular]
    },
    {
        icon: nodejs,
        alt: 'nodejs and flask',
        description: `I used Node.js to build RESTful APIs for full-stack applications, including a chatbot project where I integrated OpenAI’s API for dynamic responses.
        I also worked with Flask to develop lightweight backend services for AI-driven apps, focusing on clean, efficient API design and rapid prototyping.`,
        multiple: [nodejs, flask]
    },
    {
        icon: sql,
        alt: 'mysql',
        description: `I’ve worked with both MongoDB and MySQL in my internship and previous job, choosing between NoSQL or SQL based on the application's data structure and requirements. I enjoy designing schemas that ensure efficiency, scalability, and clean data organization.`,
        multiple: [mongoDB, sql]
    }
];

export default techStack;
