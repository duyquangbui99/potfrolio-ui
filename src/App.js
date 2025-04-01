// App.jsx
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AboutMe from "./components/Aboutme";
import TechStack from "./components/TechStack";

// src/App.js
import './styles/global.css';
import './styles/sidebarNav.css';
import './styles/aboutMe.css';
import './styles/hireme.css';
import './styles/project.css';
import './styles/resume.css';


function App() {
  return (
    <div className="flex-row">
      <Sidebar />
      <Navbar />
      <AboutMe>
        <TechStack />
      </AboutMe>
    </div>
  );
}

export default App;
