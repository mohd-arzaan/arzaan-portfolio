import { useState, useEffect, useRef } from "react";
import API from "../api/axios";

// Common input styling (name + category dono ke liye same)
const inputClass =
  "w-full bg-gray-50/80 text-black placeholder:text-gray-400 px-5 py-3.5 rounded-xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_10px_24px_-12px_rgba(16,24,40,0.25)] transition-all duration-300";

const CATEGORIES = ["Frontend", "Backend", "Database", "Tools"];

// Custom dropdown (native select ki jagah)
const CategorySelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${inputClass} flex items-center justify-between text-left cursor-pointer ${
          open ? "bg-white ring-2 ring-primary shadow-[0_10px_24px_-12px_rgba(16,24,40,0.25)]" : ""
        }`}
      >
        <span>{value}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-black/55 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="dash-pop absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-black/[0.08] shadow-[0_24px_48px_-16px_rgba(16,24,40,0.3)]"
        >
          {CATEGORIES.map((cat) => {
            const selected = cat === value;
            return (
              <li key={cat} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(cat);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-black transition-colors duration-200 ${
                    selected
                      ? "bg-primary/[0.07] font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span>{cat}</span>
                  {selected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");

  const fetchSkills = async () => {
    try {
      const { data } = await API.get("/skills");
      setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/skills", { name, category });
      setName("");
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this skill?")) {
      try {
        await API.delete(`/skills/${id}`);
        fetchSkills();
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
        @keyframes dash-pop {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dash-rise { opacity: 0; animation: dash-rise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .dash-pop { animation: dash-pop .2s cubic-bezier(.2,.7,.2,1) both; transform-origin: top; }
        @media (prefers-reduced-motion: reduce) {
          .dash-rise { opacity: 1; animation: none; }
          .dash-pop { animation: none; }
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
          Manage Skills
        </h1>
      </div>

      {/* Add New Skill */}
      <div
        className="dash-rise relative z-[5] bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)] mb-8"
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-bold text-black tracking-tight mb-7">Add New Skill</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5 md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-black mb-2">Skill Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-black mb-2">Category</label>
            <CategorySelect value={category} onChange={setCategory} />
          </div>
          <button
            type="submit"
            className="bg-primary text-white ring-1 ring-primary px-10 py-3.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Add
          </button>
        </form>
      </div>

      {/* Existing Skills */}
      <div
        className="dash-rise bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)]"
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="text-2xl font-bold text-black tracking-tight mb-7">Existing Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div
              key={skill._id}
              className="dash-rise group flex items-center gap-2 bg-gray-50 pl-5 pr-2 py-2 rounded-full ring-1 ring-black/[0.08] hover:bg-white hover:ring-primary/40 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-14px_rgba(16,24,40,0.3)] transition-all duration-300"
              style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
            >
              <span className="font-semibold text-black">{skill.name}</span>
              <span className="text-xs text-black/50">({skill.category})</span>
              <button
                onClick={() => handleDelete(skill._id)}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-red-500 font-bold leading-none hover:bg-red-500 hover:text-white active:scale-90 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                ×
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="w-full text-black/60 text-center py-14 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
              No skills added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;