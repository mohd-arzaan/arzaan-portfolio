import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminAbout from "./pages/AdminAbout";
import AdminSkills from "./pages/AdminSkills";
import AdminSocials from "./pages/AdminSocials";
import AdminMessages from "./pages/AdminMessages";

function App() {
  return (
    <div className="font-sans">
      <Router>
        <Routes>
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

          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;