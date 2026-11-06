import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get("/contacts");
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id, isRead) => {
    if (isRead) return; // Agar pehle se read hai toh kuch mat karo
    try {
      await API.put(`/contacts/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
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
          Contact Messages
        </h1>
      </div>

      <div className="space-y-5">
        {messages.map((msg, index) => (
          <div
            key={msg._id}
            className={`dash-rise group relative overflow-hidden p-7 md:p-8 pl-9 md:pl-10 rounded-3xl ring-1 hover:-translate-y-1 transition-all duration-300 ${
              msg.isRead
                ? "bg-white ring-black/[0.07] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_16px_36px_-20px_rgba(16,24,40,0.16)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_28px_52px_-24px_rgba(16,24,40,0.3)]"
                : "bg-primary/[0.04] ring-primary/25 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_18px_40px_-20px_rgba(16,24,40,0.22)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_30px_56px_-24px_rgba(16,24,40,0.34)]"
            }`}
            style={{ animationDelay: `${120 + Math.min(index, 8) * 70}ms` }}
          >
            {/* Left accent bar */}
            <div
              className={`pointer-events-none absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full ${
                msg.isRead ? "bg-gray-300" : "bg-primary"
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div className="min-w-0">
                <h3 className="font-bold text-xl text-black tracking-tight flex items-center flex-wrap gap-2">
                  {msg.name}
                  {!msg.isRead && (
                    <span className="text-xs font-semibold bg-primary text-white px-2.5 py-1 rounded-full">
                      New
                    </span>
                  )}
                </h3>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-sm text-primary hover:underline underline-offset-4 break-all"
                >
                  {msg.email}
                </a>
              </div>
              <span className="shrink-0 text-xs font-medium text-black/55 bg-white ring-1 ring-black/[0.08] px-3 py-1.5 rounded-full">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-black/75 leading-relaxed mt-3 whitespace-pre-line break-words">
              {msg.message}
            </p>

            {!msg.isRead && (
              <button
                onClick={() => markAsRead(msg._id, msg.isRead)}
                className="mt-6 text-sm font-medium bg-black text-white ring-1 ring-black px-6 py-2.5 rounded-xl shadow-lg shadow-black/15 hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="dash-rise text-black/60 text-center py-16 rounded-3xl border border-dashed border-gray-200 bg-white/70" style={{ animationDelay: "120ms" }}>
            No messages yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;