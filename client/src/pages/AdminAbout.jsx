import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    tagline: "",
    description: "",
    aboutText: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await API.get("/about");
        setFormData({
          name: data.name || "",
          role: data.role || "",
          tagline: data.tagline || "",
          description: data.description || "",
          aboutText: data.aboutText || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/about", formData);
      setMessage("About section updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update about section.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Edit About Section</h1>
      
      {message && <p className="text-green-600 mb-4 font-semibold">{message}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows="2" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">About Text (Detailed)</label>
            <textarea name="aboutText" value={formData.aboutText} onChange={handleChange} className="w-full border p-2 rounded" rows="5" required></textarea>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAbout;