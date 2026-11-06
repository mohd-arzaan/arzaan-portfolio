import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiUser,
  FiCode,
  FiShare2,
  FiMail,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
  { name: "Projects", path: "/admin/projects", icon: FiFolder },
  { name: "About", path: "/admin/about", icon: FiUser },
  { name: "Skills", path: "/admin/skills", icon: FiCode },
  { name: "Social Links", path: "/admin/socials", icon: FiShare2 },
  { name: "Messages", path: "/admin/messages", icon: FiMail },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // mobile drawer

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const current = menuItems.find((item) => isActive(item.path));

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close drawer with Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-light flex font-sans">
      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-dark/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-dark text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Soft glow behind the brand */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/15 to-transparent" />

        {/* Brand */}
        <div className="relative flex items-center justify-between px-7 py-7 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-base font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              A
            </div>
            <div className="leading-tight">
              <p className="text-lg font-bold tracking-wide">Admin Panel</p>
              <p className="text-xs text-gray-400">Portfolio manager</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 space-y-1.5 overflow-y-auto px-5 py-6">
          <p className="mb-3 px-3 text-xs font-semibold text-gray-500">
            Manage content
          </p>
          {menuItems.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={name}
                to={path}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute -left-5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                )}
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? "bg-white/15"
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative space-y-3 border-t border-gray-700/50 p-5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold">
              A
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">Admin</p>
              <p className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Signed in
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500/10 p-3.5 font-medium text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex h-screen min-w-0 flex-1 flex-col bg-[#f8fafc]">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-gray-200/70 bg-white/80 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-lg border border-gray-200 bg-white p-2 text-dark transition hover:bg-gray-50 lg:hidden"
            >
              <FiMenu size={20} />
            </button>
            <div className="leading-tight">
              <p className="text-xs text-gray-500">Admin</p>
              <p className="text-base font-bold text-dark">
                {current ? current.name : "Overview"}
              </p>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary"
          >
            View site
            <FiExternalLink size={15} />
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;