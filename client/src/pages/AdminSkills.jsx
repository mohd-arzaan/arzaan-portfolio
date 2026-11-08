import { useState, useEffect, useRef } from "react";
import { FiMonitor, FiServer, FiDatabase, FiTool, FiTag, FiTrash2 } from "react-icons/fi";
import API from "../api/axios";

// Common input styling
const inputClass =
  "w-full bg-gray-50/80 text-black placeholder:text-gray-400 px-5 py-3.5 rounded-xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_10px_24px_-12px_rgba(16,24,40,0.25)] transition-all duration-300";

const CATEGORIES = ["Frontend", "Backend", "Database", "Tools"];

// Har category ka apna icon (naya category aaye to FiTag)
const CATEGORY_ICONS = {
  Frontend: FiMonitor,
  Backend: FiServer,
  Database: FiDatabase,
  Tools: FiTool,
};
const iconFor = (category) => CATEGORY_ICONS[category] || FiTag;

// Category chunne ke liye sliding segmented control
const CategoryPicker = ({ value, onChange }) => {
  const index = Math.max(0, CATEGORIES.indexOf(value));
  return (
    <div
      role="radiogroup"
      className="relative grid grid-cols-4 rounded-2xl bg-gray-100/80 p-1.5 ring-1 ring-black/[0.06] shadow-[inset_0_1px_2px_rgba(16,24,40,0.05)]"
    >
      {/* Sliding highlight */}
      <div
        className="pointer-events-none absolute bottom-1.5 left-1.5 top-1.5 rounded-xl bg-white shadow-[0_8px_18px_-8px_rgba(16,24,40,0.35)] ring-1 ring-black/[0.06] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          width: "calc((100% - 0.75rem) / 4)",
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {CATEGORIES.map((cat) => {
        const Icon = iconFor(cat);
        const selected = cat === value;
        return (
          <button
            key={cat}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(cat)}
            className={`relative z-10 flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-row sm:gap-2.5 ${
              selected ? "text-primary" : "text-black/55 hover:text-black"
            }`}
          >
            <Icon size={17} className="shrink-0" />
            <div className={`text-xs sm:text-sm ${selected ? "font-semibold" : "font-medium"}`}>{cat}</div>
          </button>
        );
      })}
    </div>
  );
};

// Category ka share dikhane wala chhota donut
const Donut = ({ count, total }) => {
  const r = 17;
  const c = 2 * Math.PI * r;
  const pct = total ? count / total : 0;
  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${pct * c} ${c}`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-black">
        {count}
      </div>
    </div>
  );
};

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [freshIds, setFreshIds] = useState(new Set()); // abhi add hui skills
  const knownIds = useRef(null);

  const fetchSkills = async () => {
    try {
      const { data } = await API.get("/skills");
      // Pehli baar load pe animation nahi, baad mein naye rows highlight honge
      if (knownIds.current) {
        const fresh = new Set(data.filter((s) => !knownIds.current.has(s._id)).map((s) => s._id));
        if (fresh.size) {
          setFreshIds(fresh);
          setTimeout(() => setFreshIds(new Set()), 2000);
        }
      }
      knownIds.current = new Set(data.map((s) => s._id));
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

  // Columns: pehle 4 fixed categories, phir data ki extra categories
  const extra = [...new Set(skills.map((s) => s.category))].filter((c) => !CATEGORIES.includes(c));
  const columns = [...CATEGORIES, ...extra];

  return (
    <div className="max-w-6xl">
      <style>{`
        @keyframes dash-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes row-in {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes row-flash {
          0%   { opacity: 0; transform: translateY(-8px) scale(.97); background-color: rgba(37,99,235,.18); }
          40%  { opacity: 1; transform: translateY(0) scale(1); background-color: rgba(37,99,235,.14); }
          100% { opacity: 1; background-color: rgba(37,99,235,0); }
        }
        .dash-rise { opacity: 0; animation: dash-rise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .row-in { animation: row-in .5s cubic-bezier(.2,.7,.2,1) backwards; }
        .row-flash { animation: row-flash 1.6s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .dash-rise { opacity: 1; animation: none; }
          .row-in, .row-flash { animation: none; }
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
        className="dash-rise relative bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)] mb-10"
        style={{ animationDelay: "120ms" }}
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 h-1 rounded-b-full bg-primary/80" />
        <h2 className="text-2xl font-bold text-black tracking-tight mb-7">Add New Skill</h2>
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <label className="block text-sm font-semibold text-black mb-2">Skill Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          </div>
          <div className="lg:col-span-6">
            <label className="block text-sm font-semibold text-black mb-2">Category</label>
            <CategoryPicker value={category} onChange={setCategory} />
          </div>
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary text-white ring-1 ring-primary px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Existing Skills (board) */}
      <div className="dash-rise" style={{ animationDelay: "240ms" }}>
        <h2 className="text-2xl font-bold text-black tracking-tight mb-6">Existing Skills</h2>

        {skills.length === 0 ? (
          <p className="w-full text-black/60 text-center py-14 rounded-3xl border border-dashed border-gray-300 bg-white/70">
            No skills added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 items-start">
            {columns.map((cat, ci) => {
              const Icon = iconFor(cat);
              const items = skills.filter((s) => s.category === cat);
              return (
                <div
                  key={cat}
                  className="dash-rise group relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-black/[0.07] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_18px_40px_-24px_rgba(16,24,40,0.22)] hover:ring-primary/30 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_30px_56px_-28px_rgba(16,24,40,0.32)] transition-all duration-500"
                  style={{ animationDelay: `${300 + ci * 90}ms` }}
                >
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-1 rounded-b-full bg-primary/70" />

                  {/* Column header */}
                  <div className="mb-4 flex items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.07] text-primary ring-1 ring-primary/15 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:-rotate-6">
                        <Icon size={19} />
                      </div>
                      <div className="truncate text-lg font-bold tracking-tight text-black">{cat}</div>
                    </div>
                    <Donut count={items.length} total={skills.length} />
                  </div>

                  {/* Rows */}
                  <ul className="space-y-1">
                    {items.map((skill, i) => (
                      <li
                        key={skill._id}
                        className={`group/row flex items-center justify-between gap-2 rounded-xl py-2 pl-4 pr-2 transition-colors duration-200 hover:bg-gray-50 ${
                          freshIds.has(skill._id) ? "row-flash" : "row-in"
                        }`}
                        style={{ animationDelay: freshIds.has(skill._id) ? "0ms" : `${380 + ci * 90 + Math.min(i, 10) * 40}ms` }}
                      >
                        <div className="min-w-0 truncate font-medium text-black">{skill.name}</div>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          aria-label={`Delete ${skill.name}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/30 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-90 group-hover/row:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </li>
                    ))}
                    {items.length === 0 && (
                      <li className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 py-6" />
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSkills;