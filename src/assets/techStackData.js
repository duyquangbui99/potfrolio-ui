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
        alt: 'c#',
        description: `I got into C# during a game programming class, and it’s been a fascinating journey. C# really stood out to me, especially for its strong support of object-oriented programming (OOP). I’ve used it primarily with Unity for game development.`,
        multiple: [cSharp, dotnet]
    },
    {
        icon: '/static/images/html.svg',
        alt: 'html',
        description: `I work with HTML, CSS, and JavaScript almost daily to build projects. These core web technologies are essential for creating responsive, dynamic applications, and they’ve been the foundation of much of my development work.`,
        multiple: [html, css, js]
    },
    {
        icon: react,
        alt: 'react',
        description: `I gained experience with React in my last job, building a customer feedback app using the MERN stack. By combining React’s flexible, component-based structure with Tailwind CSS, I was able to create a highly responsive and efficient front-end.`,
        multiple: [react, angular]
    },
    {
        icon: mongoDB,
        alt: 'mongoDB',
        description: `I have some experience with MongoDB, mainly through integrating it with backend APIs. While I don’t work with it directly, I understand how to design schemas and manage data effectively within a full-stack application.`,
        multiple: [nodejs, flask]
    },
    {
        icon: sql,
        alt: 'mysql',
        description: `I’m currently building a school system database with MySQL as part of my database class. I have a strong understanding of the relational database model and SQL, and I’m applying this knowledge to real-world projects.`,
        multiple: [mongoDB, sql]
    }
];

export default techStack;
