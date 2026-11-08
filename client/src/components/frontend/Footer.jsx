import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import { FiLock, FiArrowUpRight, FiArrowUp } from "react-icons/fi";

// Navbar jaise hi pages (Footer mein quick navigation)
const NAV_LINKS = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Skills", to: "/skills" },
  { name: "Projects", to: "/projects" },
  { name: "Contact", to: "/contact" },
];

const Footer = () => {
  const [socials, setSocials] = useState([]);
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const { data } = await API.get("/socials");
        setSocials(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSocials();
  }, []);

  // Footer screen par aate hi reveal
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
      { threshold: 0.1 }
    );
    if (footerRef.current) io.observe(footerRef.current);
    return () => io.disconnect();
  }, []);

  // Cursor ke saath bade naam mein "bharne" wali spotlight
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const reveal = (delay) => ({
    className: `transition-all duration-700 ease-out ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  const fillMask = {
    WebkitMaskImage: "radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), black, transparent 75%)",
    maskImage: "radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), black, transparent 75%)",
  };

  return (
    <footer
      ref={footerRef}
      className="relative mt-auto overflow-hidden border-t border-black/[0.06] bg-[#f8fafc] font-serif text-black"
    >
      <style>{`
        .footer-word {
          font-size: clamp(4.5rem, 20vw, 19rem) !important;
          line-height: 0.82 !important;
          letter-spacing: -0.05em !important;
          font-weight: 700 !important;
        }
        .footer-word div { font-size: inherit !important; line-height: inherit !important; letter-spacing: inherit !important; }
        .footer-outline { color: transparent; -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.14); }
        .footer-fill { color: #000; }
      `}</style>

      {/* Background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 70%)",
          maskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top: brand + navigation + socials */}
        <div className="grid gap-14 pt-20 pb-16 md:grid-cols-12">

          {/* Logo & Copyright */}
          <div {...reveal(0)} className={`${reveal(0).className} md:col-span-5 text-center md:text-left flex flex-col items-center md:items-start`}>
            <Link to="/" className="group mb-4 block text-4xl md:text-5xl font-bold text-black tracking-tight">
              Arzaan
              <div className="inline-block text-blue-600 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1">.</div>
            </Link>
            <p className="text-black/55 text-sm leading-relaxed">
              © {new Date().getFullYear()} Mohd Arzaan. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div {...reveal(120)} className={`${reveal(120).className} md:col-span-3 text-center md:text-left`}>
            <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Explore</div>
            <ul className="space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group relative inline-block text-lg font-medium text-black/70 transition-colors duration-300 hover:text-black"
                  >
                    {link.name}
                    <div className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-blue-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div {...reveal(240)} className={`${reveal(240).className} md:col-span-4 text-center md:text-left`}>
            <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Connect</div>
            <ul className="space-y-3.5">
              {socials.map((social) => (
                <li key={social._id}>
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-lg font-medium text-black/70 transition-colors duration-300 hover:text-blue-600"
                  >
                    {social.platform}
                    <FiArrowUpRight className="opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </a>
                </li>
              ))}
              {socials.length === 0 && <li className="text-black/40 text-sm">No social links added.</li>}
            </ul>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div
          {...reveal(300)}
          className={`${reveal(300).className} flex flex-col items-center justify-between gap-5 border-t border-black/[0.08] py-7 sm:flex-row`}
        >
          {/* Discreet Admin Login Link */}
          <Link 
            to="/admin" 
            className="group flex items-center gap-2 text-sm text-black/30 transition-colors duration-300 hover:text-blue-600"
            title="Admin Login"
          >
            <FiLock className="transition-colors" /> 
            <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">Admin Panel</div>
          </Link>

          {/* Back to top */}
          <button
            onClick={scrollTop}
            aria-label="Back to top"
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white text-black ring-1 ring-black/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:ring-blue-600 hover:shadow-[0_16px_30px_-12px_rgba(37,99,235,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <FiArrowUp className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Giant wordmark: outline, cursor ke paas fill hota hai */}
      <div
        onMouseMove={handleMove}
        className={`relative mx-auto max-w-[1600px] select-none overflow-hidden px-4 text-center transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
        }`}
        style={{
          transitionDelay: "400ms",
          WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        <div className="footer-word footer-outline pt-4 pb-[0.04em]">
          Arzaan<div className="inline">.</div>
        </div>
        <div
          className="footer-word footer-fill pointer-events-none absolute inset-0 pt-4 pb-[0.04em] opacity-0 transition-opacity duration-500 [div:hover>&]:opacity-100"
          style={fillMask}
        >
          Arzaan<div className="inline text-blue-600">.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;