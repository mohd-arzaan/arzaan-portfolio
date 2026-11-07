import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GooeyNav from "../GooeyNav"; 
import TextPressure from "../TextPressure";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Skills", href: "/skills" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  const activeIndex = items.findIndex(item => item.href === location.pathname);
  const currentIndex = activeIndex !== -1 ? activeIndex : 0;

  const solid = isScrolled || isOpen;

  // Yahan hum GooeyNav se click receive karenge
  const handleNavClick = (index, item) => {
    if (location.pathname === item.href) return;
    
    // Hum navigate nahi karenge, bas URL change karenge thodi der baad
    // Taaki GooeyNav apna animation khatam kar le
    setTimeout(() => {
      navigate(item.href);
    }, 650); // 650ms delay diya hai
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 font-serif transition-all duration-500 ease-out ${
        solid ? "px-4 pt-3" : "px-0 pt-0"
      }`}
    >
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 -z-10 bg-black/25 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`relative mx-auto transition-all duration-500 ease-out ${
          solid
            ? "max-w-6xl rounded-full bg-white/90 backdrop-blur-xl ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_20px_40px_-18px_rgba(16,24,40,0.25)]"
            : "max-w-7xl rounded-none bg-transparent ring-0 shadow-none"
        }`}
      >
        <div
          className={`flex justify-between items-center px-6 lg:px-8 transition-all duration-500 ease-out ${
            solid ? "h-16" : "h-20"
          }`}
        >
          
          <div className="flex-shrink-0 z-10 flex items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
              <div className="scale-110 origin-left">
                <TextPressure 
                  text="Arzaan" flex={true} alpha={false} stroke={false} width={true} weight={true} italic={false} textColor="#0f172a" strokeColor="#0f172a" minFontSize={30} 
                />
              </div>
              <span className="text-primary text-3xl font-bold ml-1">.</span>
            </Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <GooeyNav
              items={items}
              onChange={handleNavClick} 
              initialActiveIndex={currentIndex} 
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              animationTime={600}
              timeVariance={300}
              theme="light"
              color="#2563eb"
              activeTextColor="#ffffff"
              colors={["#3b82f6", "#60a5fa", "#1d4ed8"]}
            />
          </div>

          <div className="w-10 flex justify-end z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden relative flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-all duration-300 ${
                isOpen ? "bg-[#2563eb] ring-[#2563eb]" : "bg-white ring-black/10"
              }`}
            >
              <span className={`absolute h-0.5 w-5 rounded-full ${isOpen ? "bg-white rotate-45" : "bg-black -translate-y-1.5"}`} />
              <span className={`absolute h-0.5 w-5 rounded-full ${isOpen ? "bg-white opacity-0" : "bg-black"}`} />
              <span className={`absolute h-0.5 w-5 rounded-full ${isOpen ? "bg-white -rotate-45" : "bg-black translate-y-1.5"}`} />
            </button>
          </div>
        </div>

        <div className={`md:hidden absolute top-full left-0 w-full mt-3 overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}>
          <div className="p-3">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-medium hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;