import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminAbout from "./pages/AdminAbout";
import AdminSkills from "./pages/AdminSkills";
import AdminSocials from "./pages/AdminSocials";
import AdminMessages from "./pages/AdminMessages";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";

// Page Transition Wrapper - Ye page load hone se pehle thoda wait karega
const PageWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Jab bhi route change ho, pehle invisible hoga, 300ms baad visible hoga
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // 300ms delay (GooeyNav animation ke liye)
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      {/* Frontend Routes (Wrapped in PageWrapper) */}
      <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
      <Route path="/skills" element={<PageWrapper><SkillsPage /></PageWrapper>} />
      <Route path="/projects" element={<PageWrapper><ProjectsPage /></PageWrapper>} />
      <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="socials" element={<AdminSocials />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;