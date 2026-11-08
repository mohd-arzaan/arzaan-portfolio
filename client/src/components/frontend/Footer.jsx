import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

const Footer = () => {
  const [socials, setSocials] = useState([]);

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

  return (
    <footer className="bg-white border-t border-gray-100 py-12 font-serif mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo & Copyright */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <Link to="/" className="text-2xl font-bold text-black tracking-tight mb-2 block">
            Arzaan<span className="text-blue-600">.</span>
          </Link>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Mohd Arzaan. All rights reserved.
          </p>
        </div>

        {/* Social Links & Admin */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a 
                key={social._id} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {social.platform}
              </a>
            ))}
            {socials.length === 0 && <span className="text-gray-400 text-sm">No social links added.</span>}
          </div>

          {/* Discreet Admin Login Link */}
          <Link 
            to="/admin" 
            className="text-gray-300 hover:text-blue-600 text-sm flex items-center gap-1 transition-colors duration-300 group"
            title="Admin Login"
          >
            <FiLock className="text-gray-300 group-hover:text-blue-600" /> 
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Admin Panel</span>
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;