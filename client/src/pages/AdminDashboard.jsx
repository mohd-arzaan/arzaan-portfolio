import { useEffect, useState, cloneElement } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FiFolder, FiMail, FiCode, FiArrowRight } from "react-icons/fi";

// Number ko 0 se target tak smoothly count karta hai
const CountUp = ({ value, duration = 1000 }) => {
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
      setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
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

  // Card pe mouse ghumane se halka 3D tilt
  const handleMove = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 8}deg`);
    el.style.setProperty("--rx", `${(0.5 - y / r.height) * 8}deg`);
  };

  const handleLeave = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="max-w-6xl">
      <style>{`
        @keyframes dash-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-rise { opacity: 0; animation: dash-rise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .dash-rise { opacity: 1; animation: none; }
        }
      `}</style>

      {/* Welcome Section */}
      <div
        className="dash-rise relative overflow-hidden rounded-[2rem] bg-white px-8 py-14 md:px-16 md:py-20 mb-8 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-30px_rgba(16,24,40,0.2)]"
        style={{ animationDelay: "0ms" }}
      >
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(rgba(0,0,0,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "radial-gradient(ellipse at 90% 0%, black, transparent 65%)",
            maskImage: "radial-gradient(ellipse at 90% 0%, black, transparent 65%)",
          }}
        />
        {/* Left accent */}
        <div className="pointer-events-none absolute left-0 top-10 bottom-10 w-1 rounded-r-full bg-primary" />

        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.02] mb-5 text-black">
            Welcome back, Arzaan!
          </h1>
          <p className="text-black/60 text-lg md:text-xl leading-relaxed max-w-xl">
            Here is an overview of your portfolio.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14" style={{ perspective: "1200px" }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            className="dash-rise"
            style={{ animationDelay: `${140 + index * 100}ms` }}
          >
            <Link
              to={card.link}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className="group relative block overflow-hidden bg-white p-8 rounded-3xl ring-1 ring-black/[0.07] hover:ring-primary/40 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_20px_44px_-18px_rgba(16,24,40,0.16)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_36px_64px_-24px_rgba(16,24,40,0.3)] transition-[transform,box-shadow] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
            >
              {/* Giant watermark icon */}
              <div className="pointer-events-none absolute -bottom-10 -right-8 text-black/[0.035] group-hover:text-primary/[0.08] group-hover:-rotate-6 group-hover:scale-110 transition-all duration-700">
                {cloneElement(card.icon, { size: 190, strokeWidth: 0.7 })}
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 flex items-center justify-center mb-12 group-hover:bg-primary group-hover:text-white group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500">
                  {card.icon}
                </div>

                <h3 className="text-black/60 text-sm font-medium tracking-wide mb-3">{card.title}</h3>
                <div className="text-7xl font-bold text-black tracking-tighter tabular-nums leading-none mb-10">
                  <CountUp value={card.value} />
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <span className="text-black font-semibold">Manage</span>
                  <span className="w-10 h-10 rounded-full bg-gray-50 ring-1 ring-black/5 text-black flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:ring-primary group-hover:translate-x-1 transition-all duration-300">
                    <FiArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dash-rise" style={{ animationDelay: "460ms" }}>
        <h2 className="text-2xl font-bold text-black tracking-tight mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/projects"
            className="bg-primary text-white ring-1 ring-primary px-9 py-4 rounded-2xl font-medium shadow-lg shadow-primary/25 hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Add New Project
          </Link>
          <Link
            to="/admin/about"
            className="bg-white text-black px-9 py-4 rounded-2xl font-medium ring-1 ring-black/10 shadow-sm hover:ring-primary/50 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-12px_rgba(16,24,40,0.25)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Edit About Section
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;