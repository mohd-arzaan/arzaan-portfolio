import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FiFolder, FiMail, FiCode, FiArrowRight } from "react-icons/fi";

// Number ko 0 se target tak smoothly count karta hai
const CountUp = ({ value, duration = 900 }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{n}</>;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    skills: 0
  });

  // Data fetch karke dashboard pe count dikhayenge
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, messagesRes, skillsRes] = await Promise.all([
          API.get("/projects"),
          API.get("/contacts"),
          API.get("/skills")
        ]);

        setStats({
          projects: projectsRes.data.length,
          messages: messagesRes.data.length,
          skills: skillsRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Projects", value: stats.projects, icon: <FiFolder size={22} strokeWidth={1.5} />, link: "/admin/projects" },
    { title: "Unread Messages", value: stats.messages, icon: <FiMail size={22} strokeWidth={1.5} />, link: "/admin/messages" },
    { title: "Total Skills", value: stats.skills, icon: <FiCode size={22} strokeWidth={1.5} />, link: "/admin/skills" },
  ];

  // Mouse ke saath card ke andar spotlight follow karega
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(260px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(260px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  return (
    <div className="max-w-6xl">
      <style>{`
        @keyframes dash-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-rise { opacity: 0; animation: dash-rise .7s cubic-bezier(.2,.7,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .dash-rise { opacity: 1; animation: none; }
        }
      `}</style>

      {/* Welcome Section */}
      <div
        className="dash-rise relative overflow-hidden rounded-[2rem] bg-dark px-8 py-12 md:px-14 md:py-16 mb-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
        style={{ animationDelay: "0ms" }}
      >
        {/* Glows */}
        <div className="pointer-events-none absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/40 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 w-[26rem] h-[26rem] rounded-full bg-primary/20 blur-[120px]" />
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            WebkitMaskImage: "radial-gradient(ellipse at 80% 0%, black, transparent 70%)",
            maskImage: "radial-gradient(ellipse at 80% 0%, black, transparent 70%)",
          }}
        />
        {/* Top shine line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-4">
            Welcome back, Arzaan!
          </h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl">
            Here is an overview of your portfolio.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            onMouseMove={handleMove}
            className="dash-rise group relative overflow-hidden bg-white p-8 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_40px_-16px_rgba(16,24,40,0.14)] hover:-translate-y-1.5 hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_32px_64px_-20px_rgba(16,24,40,0.28)] transition-[transform,box-shadow] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ animationDelay: `${120 + index * 90}ms` }}
          >
            {/* Cursor spotlight */}
            <div
              className="pointer-events-none absolute inset-0 bg-primary/[0.12] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={spotlightMask}
            />
            {/* Corner glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-52 h-52 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
            {/* Top shine line */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-dark to-black text-white flex items-center justify-center mb-12 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] group-hover:from-primary group-hover:to-primary group-hover:shadow-[0_14px_28px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500">
                {card.icon}
              </div>

              <h3 className="text-gray-500 text-sm font-medium tracking-wide mb-3">{card.title}</h3>
              <div className="text-7xl font-bold text-dark tracking-tighter tabular-nums leading-none mb-10">
                <CountUp value={card.value} />
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <span className="text-dark font-semibold group-hover:text-primary transition-colors duration-300">
                  Manage
                </span>
                <span className="w-10 h-10 rounded-full bg-gray-50 ring-1 ring-black/5 text-dark flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:ring-primary group-hover:translate-x-1 group-hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] transition-all duration-300">
                  <FiArrowRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dash-rise" style={{ animationDelay: "420ms" }}>
        <h2 className="text-2xl font-bold text-dark tracking-tight mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/projects"
            className="group relative overflow-hidden bg-gradient-to-b from-dark to-black text-white px-9 py-4 rounded-2xl font-medium shadow-[0_14px_28px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-white/10 hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="relative z-10">Add New Project</span>
            {/* Shine sweep */}
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-0 group-hover:translate-x-[300%] transition-transform duration-[900ms] ease-out" />
          </Link>
          <Link
            to="/admin/about"
            className="bg-white/80 backdrop-blur text-dark px-9 py-4 rounded-2xl font-medium ring-1 ring-black/10 shadow-sm hover:ring-primary/40 hover:text-primary hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(16,24,40,0.2)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Edit About Section
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;