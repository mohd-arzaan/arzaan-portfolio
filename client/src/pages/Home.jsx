import Navbar from "../components/frontend/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-light font-sans">
      <Navbar />
      
      {/* Baaki content baad mein aayega */}
      <div className="pt-32 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-dark mb-4">Welcome to My Portfolio</h1>
        <p className="text-gray-600 text-lg">Frontend content will be built here.</p>
      </div>
    </div>
  );
};

export default Home;