import { useEffect, useState } from "react";
import Navbar from "../components/frontend/Navbar";
import API from "../api/axios";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Footer from "../components/frontend/Footer";
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get("/projects");
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-light font-serif">
      <Navbar />
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-black">My Projects</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A collection of my recent work. Click on the links to view the code or live demo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-black mb-4">{project.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full border border-blue-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-black hover:text-blue-600 font-medium transition-colors">
                    <FiExternalLink /> Live Demo
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-black hover:text-blue-600 font-medium transition-colors">
                    <FiGithub /> Source Code
                  </a>
                )}
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-center text-gray-500 w-full col-span-full">No projects found.</p>}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;