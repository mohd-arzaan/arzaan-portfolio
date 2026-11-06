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

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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

  const canAnimate = () =>
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Card pe mouse ghumane se 3D tilt + spotlight
  const handleMove = (e) => {
    if (!canAnimate()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 9}deg`);
    el.style.setProperty("--rx", `${(0.5 - y / r.height) * 9}deg`);
  };

  const handleLeave = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(240px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(240px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  return (
    <div className="max-w-6xl">
      <style>{`
        @property --angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        @keyframes dash-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dash-spin { to { --angle: 360deg; } }
        @keyframes aurora-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-60px, 40px) scale(1.2); }
        }
        @keyframes aurora-b {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50%      { transform: translate(70px, -30px) scale(0.9); }
        }
        .dash-rise { opacity: 0; animation: dash-rise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .dash-aurora-a { animation: aurora-a 14s ease-in-out infinite; }
        .dash-aurora-b { animation: aurora-b 18s ease-in-out infinite; }
        .dash-conic {
          background: conic-gradient(from var(--angle), transparent 0%, transparent 55%, currentColor 78%, transparent 95%);
          animation: dash-spin 3.5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dash-rise { opacity: 1; animation: none; }
          .dash-aurora-a, .dash-aurora-b, .dash-conic { animation: none; }
        }
      `}</style>

      {/* Welcome Section */}
      <div
        className="dash-rise relative overflow-hidden rounded-[2rem] bg-dark px-8 py-14 md:px-16 md:py-20 mb-8 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
        style={{ animationDelay: "0ms" }}
      >
        {/* Moving aurora */}
        <div className="dash-aurora-a pointer-events-none absolute -top-40 -right-20 w-[32rem] h-[32rem] rounded-full bg-primary/50 blur-[120px]" />
        <div className="dash-aurora-b pointer-events-none absolute -bottom-48 left-1/4 w-[30rem] h-[30rem] rounded-full bg-primary/25 blur-[130px]" />
        <div className="dash-aurora-a pointer-events-none absolute top-1/3 -left-32 w-[22rem] h-[22rem] rounded-full bg-white/10 blur-[110px]" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.95) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "radial-gradient(ellipse at 85% 0%, black, transparent 65%)",
            maskImage: "radial-gradient(ellipse at 85% 0%, black, transparent 65%)",
          }}
        />
        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />
        {/* Shine lines */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/30 via-transparent to-transparent" />

        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.02] mb-5 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
            Welcome back, Arzaan!
          </h1>
          <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-xl">
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
              className="group relative block rounded-3xl shadow-[0_1px_2px_rgba(16,24,40,0.05),0_20px_44px_-18px_rgba(16,24,40,0.18)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_40px_70px_-24px_rgba(16,24,40,0.38)] transition-[transform,box-shadow] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Rotating light border */}
              <div className="dash-conic text-primary absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Resting border */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/[0.07] group-hover:ring-transparent transition" />

              <div className="relative m-px overflow-hidden rounded-[23px] bg-white p-8">
                {/* Cursor spotlight */}
                <div
                  className="pointer-events-none absolute inset-0 bg-primary/[0.13] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={spotlightMask}
                />
                {/* Corner glow */}
                <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
                {/* Giant watermark icon */}
                <div className="pointer-events-none absolute -bottom-10 -right-8 text-dark/[0.035] group-hover:text-primary/[0.09] group-hover:-rotate-6 group-hover:scale-110 transition-all duration-700">
                  {cloneElement(card.icon, { size: 190, strokeWidth: 0.7 })}
                </div>

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dark to-black text-white flex items-center justify-center mb-12 shadow-[0_14px_26px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:from-primary group-hover:to-primary group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500">
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
                    <span className="w-10 h-10 rounded-full bg-gray-50 ring-1 ring-black/5 text-dark flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:ring-primary group-hover:translate-x-1 group-hover:shadow-[0_10px_20px_-4px_rgba(0,0,0,0.3)] transition-all duration-300">
                      <FiArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dash-rise" style={{ animationDelay: "460ms" }}>
        <h2 className="text-2xl font-bold text-dark tracking-tight mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/projects"
            className="group relative overflow-hidden bg-gradient-to-b from-dark to-black text-white px-9 py-4 rounded-2xl font-medium shadow-[0_16px_30px_-10px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/10 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.25)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="relative z-10">Add New Project</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[320%] transition-transform duration-[900ms] ease-out" />
          </Link>
          <Link
            to="/admin/about"
            className="bg-white/80 backdrop-blur text-dark px-9 py-4 rounded-2xl font-medium ring-1 ring-black/10 shadow-sm hover:ring-primary/50 hover:text-primary hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-12px_rgba(16,24,40,0.25)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Edit About Section
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;