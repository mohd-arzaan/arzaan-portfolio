import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminSocials = () => {
  const [socials, setSocials] = useState([]);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  const fetchSocials = async () => {
    try {
      const { data } = await API.get("/socials");
      setSocials(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/socials", { platform, url });
      setPlatform("");
      setUrl("");
      fetchSocials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this social link?")) {
      try {
        await API.delete(`/socials/${id}`);
        fetchSocials();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Manage Social Links</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Social Link</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Platform Name</label>
            <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. GitHub, LinkedIn" className="w-full border p-2 rounded" required />
          </div>
          <div className="flex-[2]">
            <label className="block text-sm font-medium mb-1">URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full border p-2 rounded" required />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition h-[42px]">Add</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Existing Social Links</h2>
        <div className="space-y-3">
          {socials.map((social) => (
            <div key={social._id} className="flex justify-between items-center bg-gray-50 border p-3 rounded">
              <div>
                <span className="font-bold text-dark">{social.platform}</span>
                <a href={social.url} target="_blank" rel="noreferrer" className="text-primary text-sm ml-4 hover:underline">{social.url}</a>
              </div>
              <button onClick={() => handleDelete(social._id)} className="text-red-500 hover:text-red-700 font-bold px-2">Delete</button>
            </div>
          ))}
          {socials.length === 0 && <p className="text-gray-500">No social links added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminSocials;