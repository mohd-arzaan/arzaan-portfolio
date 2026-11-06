import { useState, useEffect } from "react";
import API from "../api/axios";

// Common input styling (platform + url dono ke liye same)
const inputClass =
  "w-full bg-gray-50/80 text-black placeholder:text-gray-400 px-5 py-3.5 rounded-xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_10px_24px_-12px_rgba(16,24,40,0.25)] transition-all duration-300";

const AdminSocials = () => {
  const [socials, setSocials] = useState([]);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  const fetchSocials = async () => {
    try {
      const { data } = await API.get("/socials");
      setSocials(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/socials", { platform, url });
      setPlatform("");
      setUrl("");
      fetchSocials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this social link?")) {
      try {
        await API.delete(`/socials/${id}`);
        fetchSocials();
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
          Manage Social Links
        </h1>
      </div>

      {/* Add New Social Link */}
      <div
        className="dash-rise bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)] mb-8"
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-bold text-black tracking-tight mb-7">Add New Social Link</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5 md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-black mb-2">Platform Name</label>
            <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. GitHub, LinkedIn" className={inputClass} required />
          </div>
          <div className="flex-[2]">
            <label className="block text-sm font-semibold text-black mb-2">URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} required />
          </div>
          <button
            type="submit"
            className="bg-primary text-white ring-1 ring-primary px-10 py-3.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Add
          </button>
        </form>
      </div>

      {/* Existing Social Links */}
      <div
        className="dash-rise bg-white p-8 md:p-10 rounded-3xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)]"
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="text-2xl font-bold text-black tracking-tight mb-7">Existing Social Links</h2>
        <div className="space-y-4">
          {socials.map((social, index) => (
            <div
              key={social._id}
              className="dash-rise group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/70 p-5 pl-6 rounded-2xl ring-1 ring-black/[0.07] hover:bg-white hover:ring-primary/40 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-18px_rgba(16,24,40,0.3)] transition-all duration-300"
              style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
            >
              <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5">
                <span className="font-bold text-lg text-black tracking-tight">{social.platform}</span>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm truncate hover:underline underline-offset-4"
                >
                  {social.url}
                </a>
              </div>
              <button
                onClick={() => handleDelete(social._id)}
                className="shrink-0 bg-white text-red-500 font-medium px-6 py-2.5 rounded-xl ring-1 ring-red-200 hover:bg-red-500 hover:text-white hover:ring-red-500 active:scale-[0.97] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Delete
              </button>
            </div>
          ))}
          {socials.length === 0 && (
            <p className="text-black/60 text-center py-14 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
              No social links added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSocials;