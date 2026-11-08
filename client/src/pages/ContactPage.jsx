import { useState } from "react";
import Navbar from "../components/frontend/Navbar";
import API from "../api/axios";
import { FiSend, FiUser, FiMail, FiMessageSquare } from "react-icons/fi";
import Footer from "../components/frontend/Footer";

// Common input styling (name, email, message sab ke liye same)
const inputClass =
  "w-full pl-14 pr-12 py-4 bg-gray-50/80 text-black placeholder:text-gray-400 rounded-2xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:shadow-[0_14px_30px_-14px_rgba(37,99,235,0.35)] transition-all duration-300";

const labelClass =
  "block text-lg font-semibold text-black mb-2 transition-colors duration-300 group-focus-within/field:text-blue-600";

const PLANE_PATH = "M10 200 C 90 200, 60 70, 160 100 S 270 170, 330 40";

// Heading ke akshar ek ke baad ek upar aate hain
const Letters = ({ text, delay = 0, className = "" }) =>
  text.split("").map((ch, i) => (
    <i
      key={i}
      className={`letter-rise not-italic inline-block ${className}`}
      style={{ animationDelay: `${delay + i * 40}ms` }}
    >
      {ch === " " ? "\u00A0" : ch}
    </i>
  ));

// Icon + valid tick wala input wrapper
const Field = ({ label, icon, valid, delay, children }) => (
  <div className="group/field page-rise" style={{ animationDelay: `${delay}ms` }}>
    <label className={labelClass}>{label}</label>
    <div className="relative">
      <div className="pointer-events-none absolute left-5 top-[1.2rem] z-10 text-black/35 transition-colors duration-300 group-focus-within/field:text-blue-600">
        {icon}
      </div>
      {children}
      {valid !== undefined && (
        <div
          className={`pointer-events-none absolute right-5 top-[1.1rem] transition-all duration-300 ${
            valid ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#2563eb" />
            <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [justSent, setJustSent] = useState(false); // bhejne ke baad plane udta hai

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
      setJustSent(true);
      setTimeout(() => setJustSent(false), 2400);
    } catch (err) {
      setStatus({ type: "error", text: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  // Form kitna bhara hai (top ki progress line ke liye)
  const nameOk = formData.name.trim().length > 1;
  const emailOk = /^\S+@\S+\.\S+$/.test(formData.email);
  const messageOk = formData.message.trim().length > 0;
  const filled = (nameOk ? 1 : 0) + (emailOk ? 1 : 0) + (messageOk ? 1 : 0);

  // Cursor ke saath card ke andar halki spotlight follow karegi
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(380px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(380px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  // Button cursor ki taraf halka khinchta hai (magnetic)
  const handleBtnMove = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || loading) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.1;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleBtnLeave = (e) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <div className="relative min-h-screen bg-light font-serif text-black overflow-hidden">
      <style>{`
        @keyframes page-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes letter-rise {
          from { opacity: 0; transform: translateY(0.6em) rotate(4deg); }
          to   { opacity: 1; transform: translateY(0) rotate(0); }
        }
        @keyframes status-in {
          from { opacity: 0; transform: translateY(-10px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes plane-fly {
          from { offset-distance: 0%; }
          to   { offset-distance: 100%; }
        }
        @keyframes check-draw {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes plane-out {
          0%   { transform: translate(0, 0); opacity: 1; }
          45%  { transform: translate(60px, -60px) scale(.6); opacity: 0; }
          46%  { transform: translate(-40px, 40px) scale(.6); opacity: 0; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes sent-ring {
          0%   { transform: scale(1); opacity: .55; }
          100% { transform: scale(1.12, 1.35); opacity: 0; }
        }
        @keyframes ring-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%      { transform: translate(-50%, -50%) scale(1.04); }
        }
        .page-rise { opacity: 0; animation: page-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
        .letter-rise { opacity: 0; animation: letter-rise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .status-in { animation: status-in .4s cubic-bezier(.2,.7,.2,1) both; }
        .plane {
          offset-path: path("${PLANE_PATH}");
          offset-rotate: auto 45deg;
          offset-anchor: center;
          animation: plane-fly 7s ease-in-out infinite alternate;
        }
        .check-path { stroke-dasharray: 24; animation: check-draw .5s .15s ease-out both; }
        .send-out { animation: plane-out 1.1s ease-in-out both; }
        .sent-ring { animation: sent-ring 1s ease-out both; }
        .breathe { animation: ring-breathe 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .page-rise, .letter-rise { opacity: 1; animation: none; }
          .status-in, .check-path, .send-out, .sent-ring, .breathe { animation: none; }
          .plane { animation: none; offset-distance: 100%; }
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
        <div className="grid items-start gap-14 lg:grid-cols-5 lg:gap-16">

          {/* Left: heading + paper plane */}
          <div className="lg:col-span-2 lg:sticky lg:top-32">
            <h1
              aria-label="Contact Me"
              className="text-5xl md:text-7xl font-bold mb-6 text-black tracking-tight"
            >
              <Letters text="Contact" delay={0} />
              <Letters text=" " delay={280} />
              <Letters text="Me" delay={320} className="text-blue-600" />
            </h1>
            <div
              className="page-rise mb-7 h-1 w-14 rounded-full bg-[#2563eb]"
              style={{ animationDelay: "500ms" }}
            />
            <p
              className="page-rise text-lg md:text-xl text-black/65 max-w-md leading-relaxed"
              style={{ animationDelay: "600ms" }}
            >
              Have a project in mind or just want to say hi? Feel free to reach out!
            </p>

            {/* Paper plane animation (sirf decoration) */}
            <div
              aria-hidden="true"
              className="page-rise relative mt-12 hidden h-[220px] w-[340px] lg:block"
              style={{ animationDelay: "720ms" }}
            >
              {/* Concentric rings peeche */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full ring-1 ring-black/[0.06] breathe" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[460px] rounded-full ring-1 ring-black/[0.045] breathe" style={{ animationDelay: "-3s" }} />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[620px] w-[620px] rounded-full ring-1 ring-black/[0.03] breathe" style={{ animationDelay: "-6s" }} />

              <svg width="340" height="220" viewBox="0 0 340 220" fill="none" className="absolute inset-0">
                <path d={PLANE_PATH} stroke="#2563eb" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
                <circle cx="10" cy="200" r="5" fill="#2563eb" fillOpacity="0.25" />
                <circle cx="330" cy="40" r="5" fill="none" stroke="#2563eb" strokeOpacity="0.5" strokeWidth="2" />
              </svg>
              <div className="plane absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_14px_26px_-10px_rgba(37,99,235,0.6)]">
                <FiSend size={18} />
              </div>
            </div>
          </div>

          {/* Right: form card */}
          <div
            onMouseMove={handleMove}
            className="page-rise group relative lg:col-span-3 overflow-hidden bg-white rounded-[2rem] ring-1 ring-black/[0.07] focus-within:ring-[#2563eb]/30 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_40px_80px_-36px_rgba(16,24,40,0.3)] p-8 md:p-12 transition-shadow duration-500"
            style={{ animationDelay: "220ms" }}
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
            {/* Progress line (form bharte hi blue bharti hai) */}
            <div className="pointer-events-none absolute inset-x-12 top-0 h-1 rounded-b-full bg-black/[0.06]">
              <div
                className="h-full rounded-b-full bg-[#2563eb] transition-all duration-700 ease-out"
                style={{ width: `${(filled / 3) * 100}%` }}
              />
            </div>

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
                  {status.type === "success" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <circle cx="12" cy="12" r="11" fill="#22c55e" fillOpacity="0.18" />
                      <path className="check-path" d="M7 12.5l3.2 3.2L17 9" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.18)]" />
                  )}
                  <div>{status.text}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Field label="Your Name" icon={<FiUser size={18} />} valid={nameOk} delay={360}>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </Field>
                <Field label="Your Email" icon={<FiMail size={18} />} valid={emailOk} delay={440}>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </Field>
                <Field label="Message" icon={<FiMessageSquare size={18} />} delay={520}>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    rows="5"
                    className={`${inputClass} resize-none`}
                    placeholder="How can I help you?"
                  ></textarea>
                </Field>
                
                <div className="relative">
                  {/* Bhejne par ring pulse */}
                  {justSent && (
                    <div className="sent-ring pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-blue-600" />
                  )}
                  <button 
                    type="submit" 
                    disabled={loading}
                    onMouseMove={handleBtnMove}
                    onMouseLeave={handleBtnLeave}
                    className="group/btn w-full py-4 bg-blue-600 text-white ring-1 ring-blue-600 rounded-2xl font-bold text-lg shadow-[0_20px_40px_-14px_rgba(37,99,235,0.55)] hover:bg-white hover:text-black hover:shadow-[0_26px_48px_-16px_rgba(37,99,235,0.4)] transition-[background-color,color,box-shadow,transform] duration-300 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:text-white"
                  >
                    {loading && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                    )}
                    {loading ? "Sending..." : "Send Message"}{" "}
                    <div className={justSent ? "send-out" : ""}>
                      <FiSend className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;