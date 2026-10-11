import { useState } from "react";
// App.jsx
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AboutMe from "./components/Aboutme";
import Dock from "./components/Dock";
import ClosedScreen from "./components/ClosedScreen";
//Resume page
import Resume from './pages/Resume'; //
import { WindowProvider, useWindow } from "./context/WindowContext";

// src/App.js
import './styles/global.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { SpeedInsights } from "@vercel/speed-insights/react";


function Shell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state } = useWindow();

  return (
    <>
      <div className="bg-scene" aria-hidden="true">
        <div className="chrome-sphere sphere-1"></div>
        <div className="chrome-sphere sphere-2"></div>
        <div className="chrome-ring"></div>
      </div>
      <div className={`flex-row app-shell shell-${state}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Routes>
          <Route path="/" element={<><AboutMe isOpen={isSidebarOpen}></AboutMe></>} />
          <Route path="/resume" element={<><Resume /></>} />
        </Routes>
        {state === 'closed' && <ClosedScreen />}
        <SpeedInsights />
      </div>
      <Dock />
    </>
  );
}

function App() {
  return (
    <Router>
      <WindowProvider>
        <Shell />
      </WindowProvider>
    </Router>
  );
}

export default App;
