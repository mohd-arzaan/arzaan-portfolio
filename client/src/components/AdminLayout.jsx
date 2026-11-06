import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  FiGrid, FiFolder, FiUser, FiCode, FiShare2, FiMail, FiLogOut, FiArrowLeft
} from "react-icons/fi"; 

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid strokeWidth={1.5} /> },
    { name: "Projects", path: "/admin/projects", icon: <FiFolder strokeWidth={1.5} /> },
    { name: "About", path: "/admin/about", icon: <FiUser strokeWidth={1.5} /> },
    { name: "Skills", path: "/admin/skills", icon: <FiCode strokeWidth={1.5} /> },
    { name: "Social Links", path: "/admin/socials", icon: <FiShare2 strokeWidth={1.5} /> },
    { name: "Messages", path: "/admin/messages", icon: <FiMail strokeWidth={1.5} /> },
  ];

  return (
    <div className="min-h-screen bg-light flex font-serif text-dark">
      
      {/* Sidebar - Elegant & Minimal */}
      <aside className="w-[300px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center px-10 border-b border-gray-100">
          <Link to="/admin/dashboard" className="group">
            <h1 className="text-3xl font-bold tracking-tight text-dark group-hover:text-primary transition-colors">
              Arzaan<span className="text-primary">.</span>
            </h1>
            <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">Admin Panel</p>
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-dark"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-primary"} transition-colors text-xl`}>
                  {item.icon}
                </span>
                <span className={`text-[1.15rem] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Area */}
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
          >
            <FiLogOut size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            <span className="text-[1.15rem] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[300px] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-semibold text-dark capitalize">
              {menuItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <Link to="/" target="_blank" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors bg-gray-50 hover:bg-primary/5 px-4 py-2 rounded-full">
            View Live Site <FiArrowLeft className="rotate-135" />
          </Link>
        </header>

        {/* Content Wrapper */}
        <div className="p-10 flex-1">
          <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-10 min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;