import { useState } from "react";
// App.jsx
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AboutMe from "./components/Aboutme";
//Resume page
import Resume from './pages/Resume'; //

// src/App.js
import './styles/global.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex-row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Routes>
          <Route path="/" element={<><AboutMe isOpen={isSidebarOpen}></AboutMe></>} />
          <Route path="/resume" element={<><Resume /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
