import { useEffect, useRef, useState } from "react";
import Navbar from "../components/frontend/Navbar";
import API from "../api/axios";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Footer from "../components/frontend/Footer";

// Pehla card (aur har 3rd) poori width ka featured card banega
const spanFor = (index) => (index % 3 === 0 ? "md:col-span-2" : "md:col-span-1");

const ProjectCard = ({ project, index }) => {
  const outerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const featured = index % 3 === 0;

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
      { threshold: 0.12 }
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
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 4}deg`);
    el.style.setProperty("--rx", `${(0.5 - y / r.height) * 4}deg`);
  };

  const handleLeave = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(340px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(340px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={outerRef}
      className={`${spanFor(index)} transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${(index % 2) * 120}ms` }}
    >
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative flex h-full flex-col overflow-hidden bg-white p-8 md:p-10 rounded-[2rem] ring-1 ring-black/[0.07] hover:ring-[#2563eb]/30 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-26px_rgba(16,24,40,0.2)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_44px_80px_-32px_rgba(16,24,40,0.38)]"
        style={{
          transform: "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
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
          className="project-outline pointer-events-none select-none absolute -top-6 -right-2 font-bold leading-none tracking-tighter transition-transform duration-700 group-hover:translate-y-2 group-hover:scale-105"
          style={{ fontSize: featured ? "13rem" : "10rem" }}
        >
          {number}
        </div>

        <div className="relative flex-1">
          {/* Left accent + number */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-8 w-1.5 rounded-full bg-[#2563eb]" />
            <div className="font-mono text-sm tracking-widest text-black/40">{number}</div>
          </div>

          <h2
            className={`font-bold text-black tracking-tight mb-4 ${
              featured ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
            }`}
          >
            {project.title}
          </h2>
          <p className={`text-black/65 mb-8 leading-relaxed ${featured ? "text-lg max-w-3xl" : ""}`}>
            {project.description}
          </p>

          {/* Tech Stack */}
          <ul className="flex flex-wrap gap-2.5 mb-10">
            {project.techStack.map((tech, i) => (
              <li
                key={i}
                className={`px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full ring-1 ring-blue-100 hover:bg-white hover:ring-[#2563eb] hover:-translate-y-0.5 transition-all duration-300 cursor-default ${
                  visible ? "chip-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${300 + i * 45}ms` }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="relative flex flex-wrap gap-3 pt-7 border-t border-gray-100">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-center gap-2.5 px-6 py-3 bg-[#2563eb] text-white ring-1 ring-[#2563eb] rounded-full font-bold shadow-[0_16px_30px_-12px_rgba(37,99,235,0.55)] hover:bg-white hover:text-black hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-14px_rgba(37,99,235,0.4)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
            >
              <FiExternalLink className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" /> Live Demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-center gap-2.5 px-6 py-3 bg-white text-black ring-1 ring-black/15 rounded-full font-bold shadow-sm hover:ring-[#2563eb] hover:text-blue-600 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-14px_rgba(16,24,40,0.35)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
            >
              <FiGithub className="transition-transform duration-300 group-hover/link:rotate-[-12deg] group-hover/link:scale-110" /> Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get("/projects");
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

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
        .page-rise { opacity: 0; animation: page-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
        .chip-in { animation: chip-in .5s cubic-bezier(.2,.7,.2,1) backwards; }
        .project-outline { color: transparent; -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.1); }
        @media (prefers-reduced-motion: reduce) {
          .page-rise { opacity: 1; animation: none; }
          .chip-in { animation: none; }
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
      <div className="relative pt-32 px-6 max-w-7xl mx-auto pb-24">
        
        <div className="text-center mb-16">
          <h1
            className="page-rise text-5xl md:text-8xl font-bold mb-6 text-black tracking-tight"
            style={{ animationDelay: "0ms" }}
          >
            My Projects
          </h1>
          <div
            className="page-rise mx-auto mb-7 h-1 w-14 rounded-full bg-[#2563eb]"
            style={{ animationDelay: "80ms" }}
          />
          <p
            className="page-rise text-lg md:text-xl text-black/65 max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: "160ms" }}
          >
            A collection of my recent work. Click on the links to view the code or live demo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
          {projects.length === 0 && (
            <p className="text-center text-black/60 w-full col-span-full py-16 rounded-3xl border border-dashed border-gray-200 bg-white/70">
              No projects found.
            </p>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;