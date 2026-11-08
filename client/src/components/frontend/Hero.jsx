import { FiArrowRight, FiDownload } from "react-icons/fi";
import ProfileCard from "../ProfileCard"; 

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-transparent font-serif text-black">
      <style>{`
        @keyframes hero-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes hero-ping {
          0%   { transform: scale(1); opacity: .6; }
          80%, 100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes hero-spin { to { transform: rotate(360deg); } }
        .hero-rise { opacity: 0; animation: hero-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
        .hero-float { animation: hero-float 7s ease-in-out infinite; }
        .hero-ping { animation: hero-ping 1.8s cubic-bezier(0,0,.2,1) infinite; }
        .hero-spin { animation: hero-spin 36s linear infinite; }
        .hero-spin-rev { animation: hero-spin 52s linear infinite reverse; }

        /* Heading: global CSS se bachane ke liye !important */
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.75rem) !important;
          line-height: 1.05 !important;
          letter-spacing: normal !important;
          font-weight: 700 !important;
        }
        .hero-title span {
          font-size: inherit !important;
          line-height: inherit !important;
          letter-spacing: inherit !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-rise { opacity: 1; animation: none; }
          .hero-float, .hero-ping, .hero-spin, .hero-spin-rev { animation: none; }
        }
      `}</style>

      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black, transparent 75%)",
          maskImage: "radial-gradient(ellipse at 50% 40%, black, transparent 75%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <span
              className="hero-rise inline-flex items-center gap-2.5 py-2 px-4 rounded-full bg-white text-blue-600 font-semibold text-sm mb-6 ring-1 ring-blue-200 shadow-[0_8px_20px_-10px_rgba(37,99,235,0.4)]"
              style={{ animationDelay: "0ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="hero-ping absolute inline-flex h-full w-full rounded-full bg-blue-600" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>
              Available for work
            </span>
            
            {/* Big heading, screen ke hisaab se fit hota hai */}
            <h1
              className="hero-title hero-rise mb-6"
              style={{ animationDelay: "100ms" }}
            >
              <span className="text-black block">Hi, I'm</span>
              <span className="text-blue-600 block mt-1">Mohd Arzaan</span>
            </h1>
            
            <p
              className="hero-rise text-base md:text-lg text-black/70 mb-9 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              style={{ animationDelay: "220ms" }}
            >
              A passionate MERN Stack Developer specializing in building exceptional digital experiences. Currently focused on building scalable and responsive web applications.
            </p>

            <div
              className="hero-rise flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              style={{ animationDelay: "340ms" }}
            >
              <a 
                href="#projects" 
                className="group w-full sm:w-auto px-7 py-3 bg-[#2563eb] text-white ring-1 ring-[#2563eb] rounded-full font-bold text-base shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55)] hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-[0_24px_44px_-14px_rgba(37,99,235,0.4)] active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
              >
                View My Work <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>

              <a 
                href="#contact" 
                className="group w-full sm:w-auto px-7 py-3 bg-white text-black ring-1 ring-black/15 rounded-full font-bold text-base shadow-sm hover:ring-[#2563eb] hover:text-[#2563eb] hover:-translate-y-1 hover:shadow-[0_20px_36px_-16px_rgba(16,24,40,0.35)] active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
              >
                Contact Me <FiDownload className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Profile Card Container */}
          <div
            className="hero-rise flex-1 flex justify-center lg:justify-end w-full"
            style={{ animationDelay: "250ms" }}
          >
            <div className="relative w-full max-w-sm group">
              {/* Card ke peeche layered color block (decoration only) */}
              <div className="pointer-events-none absolute inset-0 hidden sm:block">
                {/* Outline frame (neeche-left) */}
                <div className="absolute -bottom-7 -left-7 right-9 top-12 rounded-[2.5rem] ring-2 ring-black/10 transition-transform duration-700 ease-out group-hover:-translate-x-2 group-hover:translate-y-2" />

                {/* Solid blue block (upar-right) */}
                <div className="absolute -top-7 -right-7 -bottom-7 left-12 overflow-hidden rounded-[2.5rem] bg-[#2563eb] shadow-[0_40px_70px_-30px_rgba(37,99,235,0.55)] transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2">
                  {/* Dot pattern */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "radial-gradient(#fff 1.5px, transparent 1.5px)",
                      backgroundSize: "20px 20px",
                      WebkitMaskImage: "radial-gradient(ellipse at 100% 0%, black, transparent 70%)",
                      maskImage: "radial-gradient(ellipse at 100% 0%, black, transparent 70%)"
                    }}
                  />
                </div>
              </div>

              <div className="hero-float relative z-10">
                <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                  <ProfileCard 
                    name="Mohd Arzaan"
                    title="MERN Stack Developer"
                    handle="arzaan"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/arzaan.png" 
                    showUserInfo={true}
                    enableTilt={true}
                    enableMobileTilt={false}
                    theme="light"
                    statusColor="#2563eb"
                    backdropColor="#2563eb" 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;