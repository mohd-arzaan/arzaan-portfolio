import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");

  const fetchSkills = async () => {
    try {
      const { data } = await API.get("/skills");
      setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/skills", { name, category });
      setName("");
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this skill?")) {
      try {
        await API.delete(`/skills/${id}`);
        fetchSkills();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Manage Skills</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Skill Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded">
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Tools">Tools</option>
            </select>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition h-[42px]">Add</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Existing Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div key={skill._id} className="flex items-center gap-2 bg-gray-100 border px-3 py-1 rounded-full">
              <span className="font-medium">{skill.name}</span>
              <span className="text-xs text-gray-500">({skill.category})</span>
              <button onClick={() => handleDelete(skill._id)} className="text-red-500 hover:text-red-700 font-bold ml-2">×</button>
            </div>
          ))}
          {skills.length === 0 && <p className="text-gray-500">No skills added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;