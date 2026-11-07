import { useEffect, useRef, useState } from "react";
import Navbar from "../components/frontend/Navbar";
import API from "../api/axios";
import Footer from "../components/frontend/Footer";

// Bento layout: 3 columns par pattern (2+1, 1+2, ...)
const spanFor = (index) =>
  index % 4 === 0 || index % 4 === 3 ? "lg:col-span-2" : "lg:col-span-1";

const CategoryCard = ({ category, items, index }) => {
  const outerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Card screen par aate hi reveal
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (outerRef.current) io.observe(outerRef.current);
    return () => io.disconnect();
  }, []);

  // Cursor ke saath halka 3D tilt + spotlight
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 5}deg`);
    el.style.setProperty("--rx", `${(0.5 - y / r.height) * 5}deg`);
  };

  const handleLeave = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(300px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(300px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={outerRef}
      className={`${spanFor(index)} transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative h-full overflow-hidden bg-white p-8 md:p-10 rounded-[2rem] ring-1 ring-black/[0.07] hover:ring-[#2563eb]/30 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-26px_rgba(16,24,40,0.2)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_44px_80px_-32px_rgba(16,24,40,0.38)] transition-[box-shadow] duration-500"
        style={{
          transform: "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition: "transform .25s ease-out, box-shadow .5s",
        }}
      >
        {/* Cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 bg-black/[0.035] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={spotlightMask}
        />

        {/* Giant outline number (watermark) */}
        <div
          aria-hidden="true"
          className="skill-outline pointer-events-none select-none absolute -bottom-8 -right-2 font-bold leading-none tracking-tighter transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-105"
          style={{ fontSize: "9rem" }}
        >
          {number}
        </div>

        <div className="relative">
          {/* Top row: number + count */}
          <div className="mb-8 flex items-center justify-between">
            <div className="font-mono text-sm tracking-widest text-black/40">{number}</div>
            <div className="rounded-full bg-[#2563eb]/[0.08] px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-[#2563eb]/15">
              {items.length}
            </div>
          </div>

          {/* Category title */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-9 w-1.5 rounded-full bg-[#2563eb]" />
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 tracking-tight">{category}</h2>
          </div>

          {/* Skill chips */}
          <ul className="flex flex-wrap gap-3">
            {items.map((skill, i) => (
              <li
                key={skill._id}
                className={`px-5 py-2.5 bg-gray-50 text-black rounded-2xl font-medium ring-1 ring-black/[0.08] hover:bg-white hover:ring-[#2563eb] hover:text-blue-600 hover:-translate-y-1 hover:shadow-[0_14px_24px_-12px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-default ${
                  visible ? "chip-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${300 + i * 45}ms` }}
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Ek row jo lagatar side mein chalti rehti hai (sirf decoration, same skills ka naam)
const MarqueeRow = ({ names, reverse = false, outline = false }) => {
  const group = (key) => (
    <div key={key} className="flex shrink-0 items-center gap-8 md:gap-12 pr-8 md:pr-12">
      {names.map((name, i) => (
        <div key={`${key}-${i}`} className="flex items-center gap-8 md:gap-12">
          <div
            className={`whitespace-nowrap text-4xl md:text-6xl font-bold tracking-tight ${
              outline ? "skill-outline" : "text-black"
            }`}
          >
            {name}
          </div>
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#2563eb]" />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="marquee group relative overflow-hidden py-2"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}>
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
};

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await API.get("/skills");
        setSkills(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSkills();
  }, []);

  // Categories ke hisaab se skills group karna
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Marquee ke liye skill names (kam hon to repeat karke lamba bana dete hain)
  const baseNames = skills.map((s) => s.name);
  const names =
    baseNames.length > 0
      ? Array.from({ length: Math.max(1, Math.ceil(8 / baseNames.length)) }).flatMap(() => baseNames)
      : [];
  const half = Math.ceil(names.length / 2);
  const rowOne = names;
  const rowTwo = [...names.slice(half), ...names.slice(0, half)];

  return (
    <div className="relative min-h-screen bg-light font-serif text-black overflow-hidden">
      <style>{`
        @keyframes page-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chip-in {
          from { opacity: 0; transform: translateY(12px) scale(.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .page-rise { opacity: 0; animation: page-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
        .chip-in { animation: chip-in .5s cubic-bezier(.2,.7,.2,1) backwards; }
        .marquee-track { animation: marquee 50s linear infinite; }
        .marquee-reverse { animation-direction: reverse; animation-duration: 60s; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        .skill-outline { color: transparent; -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.22); }
        @media (prefers-reduced-motion: reduce) {
          .page-rise { opacity: 1; animation: none; }
          .chip-in { animation: none; }
          .marquee-track { animation: none; }
        }
      `}</style>

      {/* Background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, black, transparent 75%)",
          maskImage: "radial-gradient(ellipse at 50% 20%, black, transparent 75%)",
        }}
      />

      <Navbar />
      <div className="relative pt-32 pb-24">
        
        {/* Header */}
        <div className="text-center mb-14 px-6 max-w-7xl mx-auto">
          <h1
            className="page-rise text-5xl md:text-8xl font-bold mb-6 text-black tracking-tight"
            style={{ animationDelay: "0ms" }}
          >
            My Skills
          </h1>
          <div
            className="page-rise mx-auto mb-7 h-1 w-14 rounded-full bg-[#2563eb]"
            style={{ animationDelay: "80ms" }}
          />
          <p
            className="page-rise text-lg md:text-xl text-black/65 max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: "160ms" }}
          >
            Technologies and tools I use to build scalable and responsive web applications.
          </p>
        </div>

        {/* Marquee (full width) */}
        {names.length > 0 && (
          <div
            className="page-rise mb-20 space-y-3 md:space-y-4"
            style={{ animationDelay: "260ms" }}
            aria-hidden="true"
          >
            <MarqueeRow names={rowOne} />
            <MarqueeRow names={rowTwo} reverse outline />
          </div>
        )}

        {/* Category cards (bento grid) */}
        <div className="px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(groupedSkills).map(([category, items], index) => (
              <CategoryCard key={category} category={category} items={items} index={index} />
            ))}
            {skills.length === 0 && (
              <p className="col-span-full w-full text-center text-black/60 py-16 rounded-3xl border border-dashed border-gray-200 bg-white/70">
                No skills added yet.
              </p>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default SkillsPage;