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
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-dark/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white shadow-sm transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-md shadow-primary/30">
              A
            </div>
            <div className="leading-tight">
              <p className="text-lg font-bold text-dark">Admin Panel</p>
              <p className="text-xs text-gray-500">Portfolio manager</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-dark lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-3 text-xs font-semibold text-gray-400">
            Manage content
          </p>
          {menuItems.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={name}
                to={path}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "font-medium text-gray-600 hover:bg-gray-50 hover:text-dark"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                      : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-dark group-hover:shadow-sm"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-2 border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              A
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-dark">Admin</p>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Signed in
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl p-3 font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white/80 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
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
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;