import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    liveLink: "",
    githubLink: "",
  });
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const techArray = formData.techStack.split(",").map((tech) => tech.trim());
      await API.post("/projects", { ...formData, techStack: techArray });
      setFormData({ title: "", description: "", techStack: "", liveLink: "", githubLink: "" });
      fetchProjects();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await API.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Manage Projects</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="techStack" placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="liveLink" placeholder="Live Link (Optional)" value={formData.liveLink} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="githubLink" placeholder="GitHub Link (Optional)" value={formData.githubLink} onChange={handleChange} className="border p-2 rounded" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded md:col-span-2" rows="3" required></textarea>
          <button type="submit" className="bg-primary text-white p-2 rounded md:col-span-2 hover:bg-primary-dark transition">Add Project</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Existing Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="border p-4 rounded-lg flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <p className="text-xs text-primary font-medium">{project.techStack.join(", ")}</p>
              </div>
              <button onClick={() => handleDelete(project._id)} className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">Delete</button>
            </div>
          ))}
          {projects.length === 0 && <p className="text-gray-500">No projects found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;