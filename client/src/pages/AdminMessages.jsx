import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get("/contacts");
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id, isRead) => {
    if (isRead) return; // Agar pehle se read hai toh kuch mat karo
    try {
      await API.put(`/contacts/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Contact Messages</h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`p-6 rounded-lg shadow-md border-l-4 ${msg.isRead ? "bg-white border-gray-300" : "bg-blue-50 border-primary"}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{msg.name} {!msg.isRead && <span className="text-xs bg-primary text-white px-2 py-1 rounded ml-2">New</span>}</h3>
                <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">{msg.email}</a>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mt-2">{msg.message}</p>
            
            {!msg.isRead && (
              <button 
                onClick={() => markAsRead(msg._id, msg.isRead)} 
                className="mt-4 text-sm bg-gray-800 text-white px-4 py-1 rounded hover:bg-black transition"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
      </div>
    </div>
  );
};

export default AdminMessages;