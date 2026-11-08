import { useEffect, useState } from "react";
import Navbar from "../components/frontend/Navbar";
import Footer from "../components/frontend/Footer";
import Lanyard from "../components/Lanyard";
import API from "../api/axios";

const AboutPage = () => {
  const [about, setAbout] = useState(null);

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

  return (
    <div className="min-h-screen bg-light font-serif flex flex-col">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 flex-grow pb-20">
        
        {/* Lanyard Container */}
        <div className="w-full md:w-1/2 h-[600px] relative flex justify-center items-center overflow-hidden">
          <div className="w-full h-full max-w-md mx-auto">
            <Lanyard 
              frontImage="/arzaan.png" 
              backImage="/arzaan.png" 
              imageFit="cover"
              position={[0, 0, 20]} 
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-6xl font-bold mb-6 text-black">About Me</h1>
          
          {about ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-blue-600">{about.role}</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                {about.description}
              </p>
              <div className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {about.aboutText}
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-500">Loading...</p>
          )}
        </div>

      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;