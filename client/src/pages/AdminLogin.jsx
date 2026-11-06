import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

// Common input styling (email + password dono ke liye same)
const inputClass =
  "w-full bg-gray-50/80 text-black placeholder:text-gray-400 px-5 py-3.5 rounded-xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_10px_24px_-12px_rgba(16,24,40,0.25)] transition-all duration-300";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard"); // Login hone ke baad dashboard pe bhejenge
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-light flex items-center justify-center p-4 overflow-hidden">
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

      {/* Background dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
          maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
      />

      <div
        className="dash-rise relative overflow-hidden bg-white p-8 sm:p-12 rounded-[2rem] ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_40px_80px_-30px_rgba(16,24,40,0.3)] w-full max-w-md"
        style={{ animationDelay: "0ms" }}
      >
        {/* Top accent */}
        <div className="pointer-events-none absolute inset-x-12 top-0 h-1 rounded-b-full bg-primary" />

        <h2 className="text-3xl font-bold text-center text-black tracking-tight mb-8">Admin Login</h2>
        
        {error && (
          <div
            role="alert"
            className="dash-rise mb-6 flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-red-600 ring-1 ring-red-200"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.15)]" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-primary text-white ring-1 ring-primary py-3.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;