import { useEffect, useState, lazy, Suspense } from "react";
import Navbar from "../components/frontend/Navbar";
import Footer from "../components/frontend/Footer";
import API from "../api/axios";

const Lanyard = lazy(() => import("../components/Lanyard"));

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

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

        .about-title { font-size: clamp(3.25rem, 6vw, 5.5rem) !important; line-height: 1.05 !important; letter-spacing: normal !important; }
        .about-title span { font-size: inherit !important; line-height: inherit !important; letter-spacing: inherit !important; font-weight: inherit !important; }

        /* Premium 3D Card Shimmer Effect */
        .card-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .page-rise { opacity: 1; animation: none; }
          .card-shimmer { animation: none; }
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

      {/* Lanyard Layer with Premium Card Skeleton */}
      <div className="absolute inset-x-0 top-0 z-0 h-[560px] md:fixed md:inset-0 md:h-auto flex justify-center md:items-center md:justify-start">
        <Suspense fallback={
          <div className={`w-full h-full flex flex-col items-center justify-center ${isMobile ? 'mt-20' : 'md:items-start md:ml-[18%] md:mt-10'}`}>
            {/* 3D Lanyard Card Skeleton */}
            <div className="relative w-[240px] h-[340px] bg-white rounded-[20px] ring-1 ring-black/[0.05] shadow-xl flex flex-col items-center justify-center overflow-hidden transform rotate-[-2deg]">
              <div className="absolute inset-0 card-shimmer opacity-50" />
              {/* Photo Area */}
              <div className="w-[160px] h-[160px] bg-gray-200/50 rounded-full mb-6 ring-4 ring-white shadow-inner" />
              {/* Text Lines */}
              <div className="h-4 bg-gray-200/60 rounded-full w-[120px] mb-3" />
              <div className="h-3 bg-gray-200/40 rounded-full w-[80px]" />
              
              {/* Blue Strap hint at top */}
              <div className="absolute top-0 w-4 h-full bg-blue-600/10 blur-sm -left-4 rotate-12" />
            </div>
          </div>
        }>
          <Lanyard
            frontImage="/arzaan.png"
            backImage="/arzaan.png"
            anchor={isMobile ? "center" : "left"}
            size={isMobile ? 0.52 : 0.62}
            strapColor="#2563eb"
          />
        </Suspense>
      </div>

      <Navbar />

      {/* Content */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-[520px] pb-20 md:pt-0 md:pb-0">
        <div className="page-rise w-full md:ml-auto md:w-[46%]" style={{ animationDelay: "150ms" }}>
          <h1 className="about-title font-bold tracking-tight mb-6">
            About <span className="text-blue-600">Me</span>
          </h1>
          
          {/* Premium Text Skeleton */}
          {about ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-blue-600 pointer-events-auto">
                {about.role}
              </h2>
              <p className="text-xl md:text-2xl text-black/70 leading-relaxed max-w-xl pointer-events-auto">
                {about.description}
              </p>
              <div className="text-lg md:text-xl text-black/60 leading-relaxed max-w-xl whitespace-pre-line pointer-events-auto">
                {about.aboutText}
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-pulse mt-4">
              <div className="h-8 bg-blue-100/60 rounded-lg w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200/60 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200/60 rounded-md w-11/12"></div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-gray-200/40 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200/40 rounded-md w-5/6"></div>
                <div className="h-4 bg-gray-200/40 rounded-md w-4/6"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;