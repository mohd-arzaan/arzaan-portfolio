import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GooeyNav from "../GooeyNav"; 

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo (Left) */}
          <div className="flex-shrink-0 z-10">
            <Link to="/" className="text-2xl font-bold text-dark tracking-tight">
              Arzaan<span className="text-primary">.</span>
            </Link>
          </div>

          {/* GooeyNav (Center) - Now with Light Theme & Blue Pill */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <GooeyNav
              items={items}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              theme="light"            // White background frame
              color="#2563eb"          // Blue active pill
              activeTextColor="#ffffff" // White text inside blue pill
              colors={["#3b82f6", "#60a5fa", "#1d4ed8"]} // Blue particles
            />
          </div>

          {/* Empty div for flex balance */}
          <div className="w-10"></div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;