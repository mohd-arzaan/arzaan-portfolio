import { useEffect, useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import API from "../../api/axios";

const About = () => {
  const [about, setAbout] = useState(null);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await API.get("/about");
        setAbout(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAbout();
  }, []);

  // Section screen par aane par halka reveal animation
  useEffect(() => {
    if (!about || !cardRef.current) return;
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
    io.observe(cardRef.current);
    return () => io.disconnect();
  }, [about]);

  if (!about) return null;

  // Cursor ke saath card ke andar halki spotlight follow karegi
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const spotlightMask = {
    WebkitMaskImage: "radial-gradient(320px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
    maskImage: "radial-gradient(320px circle at var(--x, 50%) var(--y, 0%), black, transparent 70%)",
  };

  const item = (delay) => ({
    transitionDelay: `${delay}ms`,
  });

  const itemClass = `transition-all duration-700 ease-out ${
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`;

  return (
    <section id="about" className="relative py-28 bg-white font-serif text-black overflow-hidden">
      <style>{`
        /* Paragraph ka pehla akshar bada (drop cap) */
        .about-text::first-letter {
          float: left;
          font-size: 4.6rem;
          line-height: 0.82;
          font-weight: 700;
          color: #2563eb;
          padding: 0.3rem 0.7rem 0 0;
        }
        .about-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.07);
        }
      `}</style>

      {/* Background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 75%)",
          maskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 75%)",
        }}
      />

      {/* Giant outline watermark */}
      <div
        aria-hidden="true"
        className={`about-outline pointer-events-none select-none absolute left-0 top-2 w-full text-center font-bold leading-none tracking-tighter transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ fontSize: "clamp(6rem, 18vw, 16rem)" }}
      >
        About
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div
              ref={cardRef}
              onMouseMove={handleMove}
              className={`group relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#f8fafc] p-8 sm:p-12 md:p-16 ring-1 ring-black/[0.06] hover:ring-[#2563eb]/30 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_40px_80px_-36px_rgba(16,24,40,0.3)] transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {/* Cursor spotlight */}
              <div
                className="pointer-events-none absolute inset-0 bg-black/[0.035] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={spotlightMask}
              />
              {/* Dot pattern (top-right) */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: "radial-gradient(rgba(0,0,0,0.9) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  WebkitMaskImage: "radial-gradient(ellipse at 100% 0%, black, transparent 55%)",
                  maskImage: "radial-gradient(ellipse at 100% 0%, black, transparent 55%)",
                }}
              />
              {/* Left accent bar */}
              <div className="pointer-events-none absolute left-0 top-10 bottom-10 w-1 rounded-r-full bg-[#2563eb]" />

              <div className="relative grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] md:gap-16 items-start">
                {/* Left: heading */}
                <div className={itemClass} style={item(150)}>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                    About <span className="text-blue-600">Me</span>
                  </h2>
                  <div className="h-1 w-14 rounded-full bg-[#2563eb]" />
                </div>

                {/* Right: text + button (beech mein patli divider line) */}
                <div className="relative md:pl-16">
                  <div className="pointer-events-none absolute left-0 top-1 bottom-1 hidden w-px bg-black/10 md:block" />

                  <p
                    className={`about-text ${itemClass} text-lg md:text-xl text-black/70 leading-relaxed mb-10 whitespace-pre-line`}
                    style={item(300)}
                  >
                    {about.aboutText}
                  </p>

                  <div className={`${itemClass} flex gap-4`} style={item(450)}>
                    <a 
                      href="#contact" 
                      className="group/btn inline-flex items-center gap-2.5 px-7 py-3 bg-[#2563eb] text-white rounded-full font-bold ring-1 ring-[#2563eb] shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55)] hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-[0_24px_44px_-14px_rgba(37,99,235,0.4)] active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
                    >
                      Let's Talk
                      <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;