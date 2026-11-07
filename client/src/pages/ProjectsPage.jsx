import Navbar from "../components/frontend/Navbar";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-light font-serif">
      <Navbar />
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold">My Projects</h1>
        <p className="mt-4 text-xl">Content will go here...</p>
      </div>
    </div>
  );
};

export default ProjectsPage;