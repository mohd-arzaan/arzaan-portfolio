import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FiFolder, FiMail, FiCode, FiArrowRight } from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    skills: 0
  });

  // Data fetch karke dashboard pe count dikhayenge
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, messagesRes, skillsRes] = await Promise.all([
          API.get("/projects"),
          API.get("/contacts"),
          API.get("/skills")
        ]);
        
        setStats({
          projects: projectsRes.data.length,
          messages: messagesRes.data.length,
          skills: skillsRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Projects", value: stats.projects, icon: <FiFolder size={24} strokeWidth={1.5} />, link: "/admin/projects" },
    { title: "Unread Messages", value: stats.messages, icon: <FiMail size={24} strokeWidth={1.5} />, link: "/admin/messages" },
    { title: "Total Skills", value: stats.skills, icon: <FiCode size={24} strokeWidth={1.5} />, link: "/admin/skills" },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-dark mb-2">Welcome back, Arzaan!</h1>
        <p className="text-gray-500 text-lg">Here is an overview of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all group">
            <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h3 className="text-gray-500 font-medium mb-1">{card.title}</h3>
            <div className="text-4xl font-bold text-dark mb-4">{card.value}</div>
            <Link to={card.link} className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              Manage <FiArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-dark mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/projects" className="bg-dark text-white px-8 py-3 rounded-xl hover:bg-black transition-colors font-medium shadow-md">
            Add New Project
          </Link>
          <Link to="/admin/about" className="bg-white text-dark border border-gray-200 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm">
            Edit About Section
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;