import Navbar from "../components/frontend/Navbar";
import Hero from "../components/frontend/Hero";
import Footer from "../components/frontend/Footer"; // <-- Import karo

const Home = () => {
  return (
    <div className="min-h-screen bg-light font-serif flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Hero />
      </div>
      <Footer /> {/* <-- Add karo */}
    </div>
  );
};

export default Home;