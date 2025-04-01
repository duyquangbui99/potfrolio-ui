// App.jsx
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

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
    </div>
  );
}

export default App;
