import { useState } from "react";
import Navbar from "../components/frontend/Navbar";
import API from "../api/axios";
import { FiSend } from "react-icons/fi";
import Footer from "../components/frontend/Footer";

// Common input styling (name, email, message sab ke liye same)
const inputClass =
  "w-full px-5 py-4 bg-gray-50/80 text-black placeholder:text-gray-400 rounded-2xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:shadow-[0_14px_30px_-14px_rgba(37,99,235,0.35)] transition-all duration-300";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      await API.post("/contacts", formData);
      setStatus({ type: "success", text: "Message sent successfully! I will get back to you soon." });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  // Cursor ke saath card ke andar halki spotlight follow karegi
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(360px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(360px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  return (
    <div className="relative min-h-screen bg-light font-serif text-black overflow-hidden">
      <style>{`
        @keyframes page-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes status-in {
          from { opacity: 0; transform: translateY(-10px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .page-rise { opacity: 0; animation: page-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
        .status-in { animation: status-in .4s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .page-rise { opacity: 1; animation: none; }
          .status-in { animation: none; }
        }
      `}</style>

      {/* Background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black, transparent 75%)",
          maskImage: "radial-gradient(ellipse at 50% 25%, black, transparent 75%)",
        }}
      />

      <Navbar />
      <div className="relative pt-32 px-6 max-w-7xl mx-auto pb-24">
        
        <div className="text-center mb-16">
          <h1
            className="page-rise text-5xl md:text-8xl font-bold mb-6 text-black tracking-tight"
            style={{ animationDelay: "0ms" }}
          >
            Contact Me
          </h1>
          <div
            className="page-rise mx-auto mb-7 h-1 w-14 rounded-full bg-[#2563eb]"
            style={{ animationDelay: "80ms" }}
          />
          <p
            className="page-rise text-lg md:text-xl text-black/65 max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: "160ms" }}
          >
            Have a project in mind or just want to say hi? Feel free to reach out!
          </p>
        </div>

        <div
          onMouseMove={handleMove}
          className="page-rise group relative max-w-2xl mx-auto overflow-hidden bg-white rounded-[2rem] ring-1 ring-black/[0.07] focus-within:ring-[#2563eb]/30 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_40px_80px_-36px_rgba(16,24,40,0.3)] p-8 md:p-12 transition-shadow duration-500"
          style={{ animationDelay: "260ms" }}
        >
          {/* Cursor spotlight */}
          <div
            className="pointer-events-none absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={spotlightMask}
          />
          {/* Giant outline send icon (watermark) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-10 text-black/[0.04] transition-all duration-700 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-[#2563eb]/[0.08]"
          >
            <FiSend size={260} strokeWidth={0.6} />
          </div>
          {/* Top accent */}
          <div className="pointer-events-none absolute inset-x-12 top-0 h-1 rounded-b-full bg-[#2563eb]" />

          <div className="relative">
            {status.text && (
              <div
                role="status"
                className={`status-in mb-8 flex items-center justify-center gap-3 p-4 rounded-2xl text-center font-medium ring-1 ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700 ring-green-200"
                    : "bg-red-50 text-red-700 ring-red-200"
                }`}
              >
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    status.type === "success"
                      ? "bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.18)]"
                      : "bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.18)]"
                  }`}
                />
                <div>{status.text}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-black mb-2">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-black mb-2">Your Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-black mb-2">Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  rows="5"
                  className={`${inputClass} resize-none`}
                  placeholder="How can I help you?"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="group/btn w-full py-4 bg-blue-600 text-white ring-1 ring-blue-600 rounded-2xl font-bold text-lg shadow-[0_20px_40px_-14px_rgba(37,99,235,0.55)] hover:bg-white hover:text-black hover:-translate-y-0.5 hover:shadow-[0_26px_48px_-16px_rgba(37,99,235,0.4)] active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-blue-600 disabled:hover:text-white"
              >
                {loading && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                )}
                {loading ? "Sending..." : "Send Message"}{" "}
                <FiSend className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </button>
            </form>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;