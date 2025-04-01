import { useState } from "react";
// App.jsx
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AboutMe from "./components/Aboutme";
import TechStack from "./components/TechStack";

// src/App.js
import './styles/global.css';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex-row">
      <Sidebar isOpen={isSidebarOpen} />
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <AboutMe isOpen={isSidebarOpen}>
        <TechStack />
      </AboutMe>
    </div>
  );
}

export default App;
