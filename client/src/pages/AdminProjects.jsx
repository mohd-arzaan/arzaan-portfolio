import { useState, useEffect } from "react";
import API from "../api/axios";

// Common input styling (sab fields ke liye same)
const inputClass =
  "w-full bg-gray-50/80 text-black placeholder:text-gray-400 px-5 py-3.5 rounded-xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_10px_24px_-12px_rgba(16,24,40,0.25)] transition-all duration-300";

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

      {/* Page Title */}
      <div
        className="dash-rise relative overflow-hidden rounded-[2rem] bg-white px-8 py-12 md:px-16 md:py-16 mb-8 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-30px_rgba(16,24,40,0.2)]"
        style={{ animationDelay: "0ms" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(rgba(0,0,0,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "radial-gradient(ellipse at 90% 0%, black, transparent 65%)",
            maskImage: "radial-gradient(ellipse at 90% 0%, black, transparent 65%)",
          }}
        />
        <div className="pointer-events-none absolute left-0 top-8 bottom-8 w-1 rounded-r-full bg-primary" />
        <h1 className="relative text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-black">
          Manage Projects
        </h1>
      </div>

      {error && (
        <div
          role="alert"
          className="dash-rise mb-8 flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-red-600 ring-1 ring-red-200"
          style={{ animationDelay: "0ms" }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.15)]" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Add New Project */}
      <div
        className="dash-rise bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)] mb-8"
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-bold text-black tracking-tight mb-7">Add New Project</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} className={inputClass} required />
          <input type="text" name="techStack" placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={handleChange} className={inputClass} required />
          <input type="text" name="liveLink" placeholder="Live Link (Optional)" value={formData.liveLink} onChange={handleChange} className={inputClass} />
          <input type="text" name="githubLink" placeholder="GitHub Link (Optional)" value={formData.githubLink} onChange={handleChange} className={inputClass} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className={`${inputClass} md:col-span-2 resize-none`} rows="3" required></textarea>
          <button
            type="submit"
            className="md:col-span-2 bg-primary text-white ring-1 ring-primary px-9 py-4 rounded-2xl font-medium shadow-lg shadow-primary/25 hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Add Project
          </button>
        </form>
      </div>

      {/* Existing Projects */}
      <div
        className="dash-rise bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)]"
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="text-2xl font-bold text-black tracking-tight mb-7">Existing Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="dash-rise group relative flex flex-col justify-between bg-white p-7 rounded-3xl ring-1 ring-black/[0.08] hover:ring-primary/40 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_16px_36px_-18px_rgba(16,24,40,0.16)] hover:-translate-y-1.5 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_30px_56px_-24px_rgba(16,24,40,0.3)] transition-[transform,box-shadow] duration-500 ease-out"
              style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
            >
              <div>
                <h3 className="text-xl font-bold text-black tracking-tight mb-3">{project.title}</h3>
                <p className="text-black/65 leading-relaxed mb-5">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-black bg-primary/[0.07] ring-1 ring-primary/15 px-3 py-1.5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDelete(project._id)}
                className="mt-7 w-full bg-white text-red-500 font-medium px-5 py-3 rounded-xl ring-1 ring-red-200 hover:bg-red-500 hover:text-white hover:ring-red-500 active:scale-[0.98] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Delete
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="md:col-span-2 text-black/60 text-center py-14 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
              No projects found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;