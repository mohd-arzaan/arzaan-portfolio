import { useEffect, useState } from "react";
import Navbar from "../components/frontend/Navbar";
import Lanyard from "../components/Lanyard";// Agar path alag hai toh yahan badal lena
import Footer from "../components/frontend/Footer";
const AboutPage = () => {
  // Mobile par card beech mein latakna chahiye, warna side se kat jaata hai
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="relative min-h-screen bg-light font-serif text-black overflow-x-hidden">
      <style>{`
        @keyframes page-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .page-rise { opacity: 0; animation: page-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }

        /* Global CSS se heading ke span bigadte hain, isliye scoped fix */
        .about-title { font-size: clamp(3.25rem, 6vw, 5.5rem) !important; line-height: 1.05 !important; letter-spacing: normal !important; }
        .about-title span { font-size: inherit !important; line-height: inherit !important; letter-spacing: inherit !important; font-weight: inherit !important; }

        @media (prefers-reduced-motion: reduce) {
          .page-rise { opacity: 1; animation: none; }
        }
      `}</style>

      {/* Background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black, transparent 75%)",
          maskImage: "radial-gradient(ellipse at 50% 40%, black, transparent 75%)",
        }}
      />

      {/* Lanyard layer: poori screen par phailta hai, isliye card kahin bhi khinch sakte ho (kategi nahi).
          Desktop: fixed full screen | Mobile: page ke upar ek section */}
      <div className="absolute inset-x-0 top-0 z-0 h-[560px] md:fixed md:inset-0 md:h-auto">
        <Lanyard
          frontImage="/arzaan.png"
          backImage="/arzaan.png" // Abhi ke liye same image back mein bhi lagadi hai
          anchor={isMobile ? "center" : "left"}
          size={isMobile ? 0.52 : 0.62}
          strapColor="#2563eb"
        />
      </div>

      <Navbar />

      {/* Content: pointer-events-none taaki neeche ka lanyard grab ho sake */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-[520px] pb-20 md:pt-0 md:pb-0">
        <div className="page-rise w-full md:ml-auto md:w-[46%]" style={{ animationDelay: "150ms" }}>
          <h1 className="about-title font-bold tracking-tight mb-6">
            About <span className="text-blue-600">Me</span>
          </h1>
          <p className="text-xl md:text-2xl text-black/70 leading-relaxed max-w-xl">
            Content will go here...
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;