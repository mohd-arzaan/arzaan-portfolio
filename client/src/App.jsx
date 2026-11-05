import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminAbout from "./pages/AdminAbout";
import AdminSkills from "./pages/AdminSkills";
import AdminSocials from "./pages/AdminSocials";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="socials" element={<AdminSocials />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;