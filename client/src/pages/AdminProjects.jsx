import { useState, useEffect } from "react";
import API from "../api/axios";

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// Common input styling (sab fields ke liye same)
const inputClass =
  "w-full bg-gray-50/80 text-dark placeholder:text-gray-400 px-5 py-3.5 rounded-xl ring-1 ring-black/[0.07] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/15 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_0_0_4px_rgba(0,0,0,0.03),0_10px_24px_-12px_rgba(16,24,40,0.25)] transition-all duration-300";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    liveLink: "",
    githubLink: "",
  });
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const techArray = formData.techStack.split(",").map((tech) => tech.trim());
      await API.post("/projects", { ...formData, techStack: techArray });
      setFormData({ title: "", description: "", techStack: "", liveLink: "", githubLink: "" });
      fetchProjects();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await API.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Cursor ke saath card ke andar spotlight follow karega
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
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

      {/* Page Title */}
      <div
        className="dash-rise relative overflow-hidden rounded-[2rem] bg-dark px-8 py-12 md:px-14 md:py-16 mb-8 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
        style={{ animationDelay: "0ms" }}
      >
        <div className="dash-aurora-a pointer-events-none absolute -top-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-primary/50 blur-[120px]" />
        <div className="dash-aurora-b pointer-events-none absolute -bottom-48 left-1/4 w-[28rem] h-[28rem] rounded-full bg-primary/25 blur-[130px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.95) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "radial-gradient(ellipse at 85% 0%, black, transparent 65%)",
            maskImage: "radial-gradient(ellipse at 85% 0%, black, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <h1 className="relative text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
          Manage Projects
        </h1>
      </div>

      {error && (
        <div
          role="alert"
          className="dash-rise mb-8 flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-red-600 ring-1 ring-red-200 shadow-[0_10px_24px_-14px_rgba(239,68,68,0.5)]"
          style={{ animationDelay: "0ms" }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.15)]" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Add New Project */}
      <div
        className="dash-rise relative overflow-hidden bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-20px_rgba(16,24,40,0.2)] mb-8"
        style={{ animationDelay: "120ms" }}
      >
        <div className="pointer-events-none absolute -top-28 -right-28 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <h2 className="relative text-2xl font-bold text-dark tracking-tight mb-7">Add New Project</h2>
        <form onSubmit={handleSubmit} className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
          <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} className={inputClass} required />
          <input type="text" name="techStack" placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={handleChange} className={inputClass} required />
          <input type="text" name="liveLink" placeholder="Live Link (Optional)" value={formData.liveLink} onChange={handleChange} className={inputClass} />
          <input type="text" name="githubLink" placeholder="GitHub Link (Optional)" value={formData.githubLink} onChange={handleChange} className={inputClass} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className={`${inputClass} md:col-span-2 resize-none`} rows="3" required></textarea>
          <button
            type="submit"
            className="group relative overflow-hidden md:col-span-2 bg-gradient-to-b from-dark to-black text-white px-9 py-4 rounded-2xl font-medium shadow-[0_16px_30px_-10px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/10 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.25)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="relative z-10">Add Project</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[420%] transition-transform duration-[900ms] ease-out" />
          </button>
        </form>
      </div>

      {/* Existing Projects */}
      <div
        className="dash-rise bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-20px_rgba(16,24,40,0.2)]"
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="text-2xl font-bold text-dark tracking-tight mb-7">Existing Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project._id}
              onMouseMove={handleMove}
              className="dash-rise group relative rounded-3xl shadow-[0_1px_2px_rgba(16,24,40,0.05),0_16px_36px_-16px_rgba(16,24,40,0.16)] hover:-translate-y-1.5 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_32px_60px_-22px_rgba(16,24,40,0.34)] transition-[transform,box-shadow] duration-500 ease-out"
              style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
            >
              {/* Rotating light border */}
              <div className="dash-conic text-primary absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/[0.07] group-hover:ring-transparent transition" />

              <div className="relative m-px h-[calc(100%-2px)] overflow-hidden rounded-[23px] bg-white p-7 flex flex-col justify-between">
                {/* Cursor spotlight */}
                <div
                  className="pointer-events-none absolute inset-0 bg-primary/[0.12] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={spotlightMask}
                />
                <div className="pointer-events-none absolute -top-24 -right-24 w-52 h-52 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />

                <div className="relative">
                  <h3 className="text-xl font-bold text-dark tracking-tight mb-3">{project.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-5">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium text-primary bg-primary/[0.07] ring-1 ring-primary/15 px-3 py-1.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="relative mt-7 w-full bg-white text-red-500 font-medium px-5 py-3 rounded-xl ring-1 ring-red-200 hover:bg-red-500 hover:text-white hover:ring-red-500 hover:shadow-[0_14px_26px_-10px_rgba(239,68,68,0.6)] active:scale-[0.98] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="md:col-span-2 text-gray-500 text-center py-14 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
              No projects found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;