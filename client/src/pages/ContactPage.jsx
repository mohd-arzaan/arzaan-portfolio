import { useState } from "react";
import Navbar from "../components/frontend/Navbar";
import API from "../api/axios";
import { FiSend, FiUser, FiMail, FiMessageSquare } from "react-icons/fi";
import Footer from "../components/frontend/Footer";

// Common input styling (name, email, message sab ke liye same)
const inputClass =
  "w-full pl-12 pr-10 py-3 bg-gray-50/80 text-black placeholder:text-gray-400 rounded-xl ring-1 ring-black/[0.08] shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] hover:bg-white hover:ring-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:shadow-[0_14px_30px_-14px_rgba(37,99,235,0.35)] transition-all duration-300";

const labelClass =
  "block text-base font-semibold text-black mb-1.5 transition-colors duration-300 group-focus-within/field:text-blue-600";

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
      <div className="pointer-events-none absolute left-4 top-[0.85rem] z-10 text-black/35 transition-colors duration-300 group-focus-within/field:text-blue-600">
        {icon}
      </div>
      {children}
      {valid !== undefined && (
        <div
          className={`pointer-events-none absolute right-4 top-[0.8rem] transition-all duration-300 ${
            valid ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
  const [justSent, setJustSent] = useState(false);

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

  const nameOk = formData.name.trim().length > 1;
  const emailOk = /^\S+@\S+\.\S+$/.test(formData.email);
  const messageOk = formData.message.trim().length > 0;
  const filled = (nameOk ? 1 : 0) + (emailOk ? 1 : 0) + (messageOk ? 1 : 0);

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(380px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(380px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  const handlePageMove = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    el.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
    el.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
  };

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
    <div
      onMouseMove={handlePageMove}
      className="relative min-h-screen bg-light font-serif text-black overflow-hidden"
    >
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
        @keyframes chat-a {
          0%   { opacity: 0; transform: translateY(14px) scale(.96); }
          6%, 92% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes chat-typing {
          0%, 14% { opacity: 0; transform: translateY(10px); }
          18%, 36% { opacity: 1; transform: translateY(0); }
          40%, 100% { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes chat-b {
          0%, 40% { opacity: 0; transform: translateY(14px) scale(.94); }
          46%, 92% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes chat-tick {
          0%, 56% { opacity: 0; }
          62%, 92% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes dot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: .35; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .chat-a { animation: chat-a 10s ease-out infinite; }
        .chat-typing { animation: chat-typing 10s ease-out infinite; opacity: 0; }
        .chat-b { animation: chat-b 10s ease-out infinite; opacity: 0; }
        .chat-tick { animation: chat-tick 10s ease-out infinite; opacity: 0; }
        .typing-dot { animation: dot-bounce 1.2s ease-in-out infinite; }
        .page-rise { opacity: 0; animation: page-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
        .letter-rise { opacity: 0; animation: letter-rise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .status-in { animation: status-in .4s cubic-bezier(.2,.7,.2,1) both; }
        .check-path { stroke-dasharray: 24; animation: check-draw .5s .15s ease-out both; }
        .send-out { animation: plane-out 1.1s ease-in-out both; }
        .sent-ring { animation: sent-ring 1s ease-out both; }
        .breathe { animation: ring-breathe 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .page-rise, .letter-rise { opacity: 1; animation: none; }
          .status-in, .check-path, .send-out, .sent-ring, .breathe, .typing-dot { animation: none; }
          .chat-a, .chat-b, .chat-tick { animation: none; opacity: 1; }
          .chat-typing { animation: none; opacity: 0; }
        }
      `}</style>

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

          {/* Left: heading + chat preview */}
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

            {/* Chat preview animation */}
            <div
              aria-hidden="true"
              className="page-rise relative mt-14 hidden h-[230px] w-[340px] lg:block"
              style={{ animationDelay: "720ms" }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2"
                style={{ transform: "translate3d(calc(var(--px, 0) * -26px), calc(var(--py, 0) * -18px), 0)" }}
              >
                <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/[0.06] breathe" />
                <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/[0.045] breathe" style={{ animationDelay: "-3s" }} />
                <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/[0.03] breathe" style={{ animationDelay: "-6s" }} />
              </div>

              <div
                className="relative flex h-full flex-col justify-center gap-4"
                style={{ transform: "translate3d(calc(var(--px, 0) * -12px), calc(var(--py, 0) * -8px), 0)" }}
              >
                <div className="chat-a flex items-end gap-3">
                  <div className="relative h-10 w-10 shrink-0 rounded-full bg-black/[0.07] ring-1 ring-black/10">
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-white p-4 shadow-[0_18px_36px_-18px_rgba(16,24,40,0.3)] ring-1 ring-black/[0.07]">
                    <div className="h-2.5 w-44 rounded-full bg-black/10" />
                    <div className="mt-2.5 h-2.5 w-28 rounded-full bg-black/10" />
                  </div>
                </div>

                <div className="relative h-[68px]">
                  <div className="chat-typing absolute left-[52px] top-0 flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-5 py-4 shadow-[0_18px_36px_-18px_rgba(16,24,40,0.3)] ring-1 ring-black/[0.07]">
                    <div className="typing-dot h-2 w-2 rounded-full bg-black/60" />
                    <div className="typing-dot h-2 w-2 rounded-full bg-black/60" style={{ animationDelay: "0.15s" }} />
                    <div className="typing-dot h-2 w-2 rounded-full bg-black/60" style={{ animationDelay: "0.3s" }} />
                  </div>
                  <div className="chat-b absolute right-0 top-0 rounded-2xl rounded-br-md bg-blue-600 p-4 shadow-[0_18px_36px_-14px_rgba(37,99,235,0.6)]">
                    <div className="h-2.5 w-36 rounded-full bg-white/45" />
                    <div className="mt-2.5 h-2.5 w-20 rounded-full bg-white/45" />
                  </div>
                </div>

                <div className="chat-tick flex justify-end pr-1">
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 6.5l3.5 3.5L11 2" />
                    <path d="M8 9.5l1 1L17 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form card (Size Chota Kiya Gaya Hai) */}
          <div
            onMouseMove={handleMove}
            className="page-rise group relative lg:col-span-3 overflow-hidden bg-white rounded-[2rem] ring-1 ring-black/[0.07] focus-within:ring-[#2563eb]/30 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_40px_80px_-36px_rgba(16,24,40,0.3)] p-6 md:p-8 max-w-2xl mx-auto w-full transition-shadow duration-500"
            style={{ animationDelay: "220ms" }}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={spotlightMask}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -right-10 text-black/[0.04] transition-all duration-700 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-[#2563eb]/[0.08]"
            >
              <FiSend size={260} strokeWidth={0.6} />
            </div>
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
                  className={`status-in mb-6 flex items-center justify-center gap-3 p-3 rounded-xl text-center font-medium ring-1 text-sm ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700 ring-green-200"
                      : "bg-red-50 text-red-700 ring-red-200"
                  }`}
                >
                  {status.type === "success" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <circle cx="12" cy="12" r="11" fill="#22c55e" fillOpacity="0.18" />
                      <path className="check-path" d="M7 12.5l3.2 3.2L17 9" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.18)]" />
                  )}
                  <div>{status.text}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Your Name" icon={<FiUser size={16} />} valid={nameOk} delay={360}>
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
                <Field label="Your Email" icon={<FiMail size={16} />} valid={emailOk} delay={440}>
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
                <Field label="Message" icon={<FiMessageSquare size={16} />} delay={520}>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    rows="4"
                    className={`${inputClass} resize-none`}
                    placeholder="How can I help you?"
                  ></textarea>
                </Field>
                
                <div className="relative pt-2">
                  {justSent && (
                    <div className="sent-ring pointer-events-none absolute inset-0 rounded-xl ring-2 ring-blue-600" />
                  )}
                  <button 
                    type="submit" 
                    disabled={loading}
                    onMouseMove={handleBtnMove}
                    onMouseLeave={handleBtnLeave}
                    className="group/btn w-full py-3 bg-blue-600 text-white ring-1 ring-blue-600 rounded-xl font-bold text-base shadow-[0_20px_40px_-14px_rgba(37,99,235,0.55)] hover:bg-white hover:text-black hover:shadow-[0_26px_48px_-16px_rgba(37,99,235,0.4)] transition-[background-color,color,box-shadow,transform] duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:text-white"
                  >
                    {loading && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                    )}
                    {loading ? "Sending..." : "Send Message"}{" "}
                    <div className={justSent ? "send-out" : ""}>
                      <FiSend className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" size={18} />
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