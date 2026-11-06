import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  FiGrid, FiFolder, FiUser, FiCode, FiShare2, FiMail, FiLogOut, FiArrowLeft
} from "react-icons/fi"; 

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
      <style>{`
        @keyframes side-aurora {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(30px, 40px) scale(1.2); }
        }
        .side-aurora { animation: side-aurora 16s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .side-aurora { animation: none; }
        }
      `}</style>
      
      {/* Sidebar - Dark & Premium */}
      <aside className="w-[300px] bg-dark border-r border-white/10 flex flex-col fixed h-full z-20 overflow-hidden shadow-[8px_0_40px_rgba(0,0,0,0.18)]">
        {/* Background effects */}
        <div className="side-aurora pointer-events-none absolute -top-32 -left-24 w-[22rem] h-[22rem] rounded-full bg-white/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-32 w-[22rem] h-[22rem] rounded-full bg-white/[0.08] blur-[110px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.95) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            WebkitMaskImage: "radial-gradient(ellipse at 0% 0%, black, transparent 60%)",
            maskImage: "radial-gradient(ellipse at 0% 0%, black, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-white/25 via-white/5 to-transparent" />
        
        {/* Logo Area */}
        <div className="relative h-24 flex items-center px-10 border-b border-white/10">
          <Link to="/admin/dashboard" className="group">
            <h1 className="text-3xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              Arzaan<span className="text-primary">.</span>
            </h1>
            <p className="text-xs text-white/40 tracking-widest uppercase mt-1">Admin Panel</p>
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <nav className="relative flex-1 px-6 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive 
                    ? "bg-primary text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] ring-1 ring-white/20" 
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white hover:translate-x-1"
                }`}
              >
                {isActive && (
                  <span className="pointer-events-none absolute -left-6 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                <span className={`${isActive ? "text-white" : "text-white/40 group-hover:text-primary"} transition-colors text-xl`}>
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
        <div className="relative p-6 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/55 hover:bg-red-500/10 hover:text-red-400 hover:ring-1 hover:ring-red-500/20 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <FiLogOut size={20} strokeWidth={1.5} className="text-white/40 group-hover:text-red-400 group-hover:-translate-x-0.5 transition-all" />
            <span className="text-[1.15rem] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex-1 ml-[300px] min-h-screen flex flex-col">
        {/* Soft ambient background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 90% 0%, rgba(0,0,0,0.035), transparent 70%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(0,0,0,0.03), transparent 70%)",
          }}
        />

        {/* Top Header */}
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_8px_30px_-20px_rgba(16,24,40,0.25)] flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-dark capitalize">
              {menuItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <Link
            to="/"
            target="_blank"
            className="group flex items-center gap-2.5 text-sm font-medium text-gray-600 hover:text-primary bg-white ring-1 ring-black/10 hover:ring-primary/40 shadow-sm hover:shadow-[0_12px_24px_-10px_rgba(16,24,40,0.25)] hover:-translate-y-0.5 px-5 py-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View Live Site
            <span className="inline-flex transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <FiArrowLeft style={{ transform: "rotate(135deg)" }} />
            </span>
          </Link>
        </header>

        {/* Content Wrapper */}
        <div className="relative p-10 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;