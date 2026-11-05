import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col">
        <div className="p-6 text-2xl font-bold text-primary border-b border-gray-700">
          Arzaan Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="block p-3 rounded hover:bg-gray-800 transition">Dashboard</Link>
          <Link to="/admin/projects" className="block p-3 rounded hover:bg-gray-800 transition">Projects</Link>
          <Link to="/admin/about" className="block p-3 rounded hover:bg-gray-800 transition">About</Link>
          <Link to="/admin/skills" className="block p-3 rounded hover:bg-gray-800 transition">Skills</Link>
          <Link to="/admin/socials" className="block p-3 rounded hover:bg-gray-800 transition">Social Links</Link>
          <Link to="/admin/messages" className="block p-3 rounded hover:bg-gray-800 transition">Messages</Link>
        </nav>
        <button onClick={handleLogout} className="p-4 bg-red-600 hover:bg-red-700 text-center font-bold transition">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* Yahan baaki pages load honge */}
      </main>
    </div>
  );
};

export default AdminLayout;