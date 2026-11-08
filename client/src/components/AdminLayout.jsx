import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  FiGrid, FiFolder, FiUser, FiCode, FiShare2, FiMail, FiLogOut, FiArrowLeft, FiHome
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
    <div className="min-h-screen bg-light flex font-serif text-black">
      
      {/* Sidebar */}
      <aside className="w-[300px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-20 shadow-[6px_0_30px_rgba(0,0,0,0.04)]">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center px-10 border-b border-gray-100">
          <Link to="/admin/dashboard" className="group">
            <h1 className="text-3xl font-bold tracking-tight text-black group-hover:text-primary transition-colors">
              Arzaan<span className="text-primary">.</span>
            </h1>
            <p className="text-xs text-black/50 tracking-widest uppercase mt-1">Admin Panel</p>
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
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "text-black/70 hover:bg-gray-50 hover:text-black hover:translate-x-1"
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

        {/* Footer Area: Go to Website & Logout */}
        <div className="p-6 border-t border-gray-100 space-y-2">
          
          {/* Go to Website Button */}
          <Link 
            to="/" 
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-black/70 hover:bg-blue-50 hover:text-primary transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FiHome size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
            <span className="text-[1.15rem] font-medium">Go to Website</span>
          </Link>

          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-black/70 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <FiLogOut size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-red-500 group-hover:-translate-x-0.5 transition-all" />
            <span className="text-[1.15rem] font-medium">Logout</span>
          </button>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[300px] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-[0_8px_30px_-20px_rgba(16,24,40,0.2)] flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-black capitalize">
              {menuItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <Link
            to="/"
            target="_blank"
            className="group flex items-center gap-2.5 text-sm font-medium text-black bg-gray-50 ring-1 ring-black/5 hover:bg-white hover:ring-primary/40 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(16,24,40,0.3)] px-5 py-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View Live Site
            <span className="inline-flex transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <FiArrowLeft style={{ transform: "rotate(135deg)" }} />
            </span>
          </Link>
        </header>

        {/* Content Wrapper */}
        <div className="p-10 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;