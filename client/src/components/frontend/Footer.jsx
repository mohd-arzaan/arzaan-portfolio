import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import {
  FiLock, FiArrowUpRight, FiArrowUp, FiGithub, FiLinkedin, FiTwitter,
  FiInstagram, FiFacebook, FiYoutube, FiMail, FiGlobe,
} from "react-icons/fi";

const NAV_LINKS = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Skills", to: "/skills" },
  { name: "Projects", to: "/projects" },
  { name: "Contact", to: "/contact" },
];

const LETTERS = ["A", "r", "z", "a", "a", "n", "."];

// Marquee ke liye (Hero se wahi text)
const MARQUEE_ITEMS = ["MERN Stack Developer", "Available for work", "Mohd Arzaan"];

// Social platform ke naam se icon chunna (match na ho to globe)
const socialIcon = (platform = "") => {
  const p = platform.toLowerCase().trim();
  if (p.includes("github")) return FiGithub;
  if (p.includes("linkedin")) return FiLinkedin;
  if (p.includes("twitter") || p === "x") return FiTwitter;
  if (p.includes("instagram")) return FiInstagram;
  if (p.includes("facebook")) return FiFacebook;
  if (p.includes("youtube")) return FiYoutube;
  if (p.includes("mail")) return FiMail;
  return FiGlobe;
};

// Background ki behti hui wave lines (seamless loop)
const WAVE_W = 3200;
const waveLine = (y, amp, cycles, phase) => {
  let d = "";
  for (let x = 0; x <= WAVE_W; x += 16) {
    const yy = y + Math.sin((x / 1600) * cycles * Math.PI * 2 + phase) * amp;
    d += `${x === 0 ? "M" : "L"}${x} ${yy.toFixed(1)} `;
  }
  return d;
};
const WAVES = {
  one: [waveLine(80, 30, 2, 0), waveLine(130, 22, 3, 1.2)],
  two: [waveLine(175, 34, 4, 2.1), waveLine(225, 20, 2, 0.6)],
  three: [waveLine(270, 26, 3, 3.4), waveLine(315, 30, 1, 4.2)],
};

const formatTime = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

const Footer = () => {
  const [socials, setSocials] = useState([]);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [time, setTime] = useState(formatTime());
  const [lifts, setLifts] = useState(() => LETTERS.map(() => 0));
  const footerRef = useRef(null);
  const letterRefs = useRef([]);
  const raf = useRef(0);
  const scrollRaf = useRef(0);

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

  // Live India time
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 15000);
    return () => clearInterval(id);
  }, []);

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

  // Scroll ke saath parallax: wordmark upar uthta hai, waves thodi khisakti hain
  useEffect(() => {
    const el = footerRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const update = () => {
      scrollRaf.current = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height * 0.9)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!scrollRaf.current) scrollRaf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    };
  }, []);

  // Poore footer mein halki cursor-follow roshni
  const handleFooterMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--fx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };

  // Bade naam par: akshar upar uthte hain (dock effect) + spotlight follow
  const handleMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - box.top}px`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mx = e.clientX;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      setLifts(
        letterRefs.current.map((el) => {
          if (!el) return 0;
          const r = el.getBoundingClientRect();
          const dx = Math.abs(mx - (r.left + r.width / 2));
          const influence = Math.max(0, 1 - dx / 260);
          return influence * influence;
        })
      );
    });
  };

  const handleEnter = () => setHovering(true);
  const handleLeave = () => {
    setHovering(false);
    setLifts(LETTERS.map(() => 0));
  };

  // Back-to-top button cursor ki taraf halka khinchta hai (magnetic)
  const handleBtnMove = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.35;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleBtnLeave = (e) => {
    e.currentTarget.style.transform = "";
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const reveal = (delay) => ({
    className: `transition-all duration-700 ease-out ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  // Link rows ka common style
  const rowClass =
    "group flex items-center justify-between gap-4 py-4 text-xl font-medium text-white/75 transition-all duration-300 hover:pl-3 hover:text-white";
  const arrowClass =
    "shrink-0 opacity-0 -translate-x-2 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0";

  // Divider line jo screen par aate hi left se right "draw" hoti hai
  // (component nahi, function: re-render par remount na ho)
  const line = (delay, top = false) => (
    <div
      className={`pointer-events-none absolute left-0 ${top ? "top-0" : "bottom-0"} h-px w-full origin-left bg-white/20 transition-transform duration-1000 ease-out ${
        visible ? "scale-x-100" : "scale-x-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    />
  );

  // Bade naam ke akshar (dono layers mein same)
  const renderLetters = (withRefs) =>
    LETTERS.map((ch, i) => (
      <span
        key={i}
        className={`transition-all duration-[1100ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-[70%] opacity-0"
        }`}
        style={{ transitionDelay: `${600 + i * 80}ms` }}
        ref={withRefs ? (el) => (letterRefs.current[i] = el) : undefined}
      >
        <span
          style={{
            transform: `translateY(${-lifts[i] * 34}px) scale(${1 + lifts[i] * 0.07})`,
            transition: "transform .25s ease-out",
            transformOrigin: "50% 100%",
          }}
        >
          {ch}
        </span>
      </span>
    ));

  // Marquee ka ek group (do baar render hota hai seamless loop ke liye)
  const marqueeGroup = (key) => (
    <div key={key} className="flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14">
      {MARQUEE_ITEMS.map((text, i) => (
        <div key={`${key}-${i}`} className="flex items-center gap-10 md:gap-14">
          <div
            className={`whitespace-nowrap text-4xl font-bold tracking-tight md:text-6xl ${
              i % 2 === 0 ? "text-white" : "footer-outline"
            }`}
          >
            {text}
          </div>
          <svg width="26" height="26" viewBox="0 0 24 24" className="shrink-0 text-white/70" fill="currentColor">
            <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
          </svg>
        </div>
      ))}
    </div>
  );

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleFooterMove}
      className="group/f relative mt-auto overflow-hidden rounded-t-[2.5rem] bg-[#2563eb] font-serif text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] md:rounded-t-[4rem]"
    >
      <style>{`
        @property --sweep { syntax: '<percentage>'; inherits: true; initial-value: -15%; }
        @keyframes sweep { from { --sweep: -15%; } to { --sweep: 115%; } }
        @keyframes wave-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes footer-spin { to { transform: rotate(360deg); } }
        @keyframes marquee-run { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ripple {
          0%   { transform: scale(1); opacity: .55; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes arrow-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes time-ping {
          0%   { transform: scale(1); opacity: .7; }
          80%, 100% { transform: scale(2.6); opacity: 0; }
        }

        .footer-word {
          font-size: clamp(5rem, 25vw, 22rem) !important; 
          line-height: 0.8 !important;
          letter-spacing: -0.04em !important;
          font-weight: 700 !important;
          white-space: nowrap;
        }
        .footer-word span { 
          font-size: inherit !important; 
          line-height: inherit !important; 
          letter-spacing: inherit !important; 
          display: inline-block;
        }

        .footer-outline { color: transparent; -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.7); }

        /* Solid white layer: cursor ke paas, warna apne aap ghoomti roshni */
        .reveal-layer {
          -webkit-mask-image: radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), #000 20%, transparent 80%);
          mask-image: radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), #000 20%, transparent 80%);
        }
        .wordmark-idle .reveal-layer {
          -webkit-mask-image: radial-gradient(340px circle at var(--sweep) 55%, #000 20%, transparent 80%);
          mask-image: radial-gradient(340px circle at var(--sweep) 55%, #000 20%, transparent 80%);
          animation: sweep 7s ease-in-out infinite alternate;
        }

        .wave-one   { animation: wave-scroll 70s linear infinite; }
        .wave-two   { animation: wave-scroll 95s linear infinite reverse; }
        .wave-three { animation: wave-scroll 120s linear infinite; }
        .ring-spin     { animation: footer-spin 80s linear infinite; }
        .ring-spin-rev { animation: footer-spin 110s linear infinite reverse; }
        .ripple-a { animation: ripple 2.6s ease-out infinite; }
        .ripple-b { animation: ripple 2.6s ease-out 1.3s infinite; }
        .arrow-bob { animation: arrow-bob 1.8s ease-in-out infinite; }
        .time-ping { animation: time-ping 1.8s cubic-bezier(0,0,.2,1) infinite; }
        .marquee-track { animation: marquee-run 45s linear infinite; }
        .marquee-wrap:hover .marquee-track { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .wordmark-idle .reveal-layer, .wave-one, .wave-two, .wave-three,
          .ring-spin, .ring-spin-rev, .ripple-a, .ripple-b, .arrow-bob,
          .time-ping, .marquee-track { animation: none; }
        }
      `}</style>

      {/* Cursor-follow halki roshni (poore footer mein) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/f:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--fx, 50%) var(--fy, 30%), rgba(255,255,255,0.10), transparent 65%)" }}
      />

      {/* Background: behti hui wave lines (scroll par halka parallax) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[75%] overflow-hidden"
        style={{
          transform: "translateY(calc((var(--p, 0) - 0.5) * -70px))",
          WebkitMaskImage: "linear-gradient(to bottom, #000 40%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, #000 40%, transparent 100%)",
        }}
      >
        {Object.entries(WAVES).map(([key, paths], idx) => (
          <svg
            key={key}
            viewBox={`0 0 ${WAVE_W} 360`}
            preserveAspectRatio="none"
            className={`wave-${key} absolute left-0 top-0 h-full w-[200%]`}
            fill="none"
          >
            {paths.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="#fff"
                strokeOpacity={0.12 + ((idx + i) % 3) * 0.05}
                strokeWidth="1.3"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        ))}
      </div>

      {/* Background: kone mein ghoomti rings */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem]">
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="ring-spin absolute inset-10 rounded-full border border-dashed border-white/25" />
        <div className="ring-spin-rev absolute inset-24 rounded-full border border-white/15">
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/70" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* Columns */}
        <div className="grid gap-14 pt-20 pb-16 md:grid-cols-12 md:pt-24">

          {/* Brand: akshar neeche se upar uthte hain */}
          <div className="md:col-span-5">
            <Link to="/" aria-label="Arzaan" className="group block w-fit text-6xl font-bold tracking-tight text-white md:text-7xl">
              {LETTERS.map((ch, i) => (
                <div key={i} className="inline-block overflow-hidden align-bottom">
                  <div
                    className={`inline-block transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                      visible ? "translate-y-0" : "translate-y-[110%]"
                    } ${i === LETTERS.length - 1 ? "text-white/60 group-hover:text-white" : ""}`}
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    {ch}
                  </div>
                </div>
              ))}
            </Link>
          </div>

          {/* Navigation (numbers ke saath) */}
          <div {...reveal(120)} className={`${reveal(120).className} md:col-span-3`}>
            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Explore</div>
            <ul className="relative">
              {line(200, true)}
              {NAV_LINKS.map((link, i) => (
                <li key={link.name} className="relative">
                  <Link to={link.to} className={rowClass}>
                    <div className="flex items-baseline gap-4">
                      <div className="font-mono text-xs tabular-nums text-white/40 transition-colors duration-300 group-hover:text-white/80">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {link.name}
                    </div>
                    <FiArrowUpRight className={arrowClass} />
                  </Link>
                  {line(300 + i * 110)}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links (icons ke saath) */}
          <div {...reveal(240)} className={`${reveal(240).className} md:col-span-4`}>
            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Connect</div>
            <ul className="relative">
              {line(300, true)}
              {socials.map((social, i) => {
                const Icon = socialIcon(social.platform);
                return (
                  <li key={social._id} className="relative">
                    <a href={social.url} target="_blank" rel="noreferrer" className={rowClass}>
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 transition-all duration-300 group-hover:-rotate-6 group-hover:bg-white group-hover:text-[#2563eb] group-hover:ring-white">
                          <Icon size={17} />
                        </div>
                        {social.platform}
                      </div>
                      <FiArrowUpRight className={arrowClass} />
                    </a>
                    {line(400 + i * 110)}
                  </li>
                );
              })}
              {socials.length === 0 && <li className="py-4 text-sm text-white/55">No social links added.</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Marquee band (full width) */}
      <div
        aria-hidden="true"
        className="marquee-wrap relative z-10 overflow-hidden border-y border-white/20 py-6"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <div className="marquee-track flex w-max">
          {marqueeGroup("a")}
          {marqueeGroup("b")}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Bottom bar */}
        <div
          {...reveal(360)}
          className={`${reveal(360).className} flex flex-col-reverse items-center justify-between gap-5 py-7 sm:flex-row`}
        >
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} Mohd Arzaan. All rights reserved.
            </p>

            {/* Live time */}
            <div className="flex items-center gap-2.5 text-sm text-white/70">
              <div className="relative flex h-2 w-2">
                <div className="time-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300" />
                <div className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </div>
              <div className="tabular-nums">{time} IST</div>
            </div>

            {/* Discreet Admin Login Link */}
            <Link 
              to="/admin" 
              className="group flex items-center gap-2 text-sm text-white/40 transition-colors duration-300 hover:text-white"
              title="Admin Login"
            >
              <FiLock className="transition-colors" /> 
              <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">Admin Panel</div>
            </Link>
          </div>

          {/* Back to top (peeche ripple chalti rehti hai) */}
          <div className="relative h-12 w-12">
            <div className="ripple-a pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/60" />
            <div className="ripple-b pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/60" />
            <button
              onClick={scrollTop}
              onMouseMove={handleBtnMove}
              onMouseLeave={handleBtnLeave}
              aria-label="Back to top"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2563eb] shadow-[0_14px_28px_-12px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_20px_36px_-12px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2563eb]"
            >
              <FiArrowUp className="arrow-bob" />
            </button>
          </div>
        </div>
      </div>

      {/* Giant wordmark (scroll par upar uthta hai) */}
      <div style={{ transform: "translateY(calc((1 - var(--p, 1)) * 90px))" }}>
        <div
          onMouseMove={handleMove}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className={`wordmark-container relative w-full select-none overflow-hidden text-center ${
            hovering ? "" : "wordmark-idle"
          }`}
          aria-hidden="true"
        >
          {/* Layer 1: halka translucent white base */}
          <div className="footer-word pt-4 pb-[0.04em] text-white/[0.14]">{renderLetters(true)}</div>

          {/* Layer 2: solid white (cursor ke paas, ya apne aap sweep hoti hai) */}
          <div className="footer-word reveal-layer pointer-events-none absolute inset-0 pt-4 pb-[0.04em] text-white">
            {renderLetters(false)}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;