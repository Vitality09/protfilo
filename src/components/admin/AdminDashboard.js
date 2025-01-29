import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VisitorStats from './VisitorStats';
import VisitorMap from './VisitorMap';
import Settings from './Settings';
import TeamManagement from './TeamManagement';
import ProjectManagement from './ProjectManagement';
import TechnologyManagement from './TechnologyManagement';
import FileManager from './FileManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    messageCount: 0,
    projectCount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      navigate('/admin');
    }

    // Load data
    const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const savedVisitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    
    setMessages(savedMessages);
    setProjects(savedProjects);
    setVisitors(savedVisitors);

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisitors = savedVisitors.filter(v => 
      new Date(v.timestamp) >= today
    ).length;

    setStats({
      totalVisitors: savedVisitors.length,
      todayVisitors,
      messageCount: savedMessages.length,
      projectCount: savedProjects.length
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProject = {
      id: Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image'),
      technologies: formData.get('technologies').split(',').map(tech => tech.trim())
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    e.target.reset();
  };

  const handleDeleteMessage = (id) => {
    const updatedMessages = messages.filter(msg => msg.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'messages', label: 'Messages', icon: '✉️' },
    { id: 'projects', label: 'Projects', icon: '🎮' },
    { id: 'visitors', label: 'Visitors', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'technologies', label: 'Technologies', icon: '💻' },
    { id: 'files', label: 'File Manager', icon: '📁' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <span className="text-xl">🎮</span>
          </div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:text-red-400 transition-colors"
          >
            <span>🚪</span>
            Logout
          </motion.button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Dashboard Overview</h2>
              <div className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleString()}
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Visitors', value: stats.totalVisitors, icon: '👥', color: 'from-blue-600 to-blue-400' },
                { title: "Today's Visitors", value: stats.todayVisitors, icon: '🎯', color: 'from-green-600 to-green-400' },
                { title: 'Total Messages', value: stats.messageCount, icon: '✉️', color: 'from-yellow-600 to-yellow-400' },
                { title: 'Total Projects', value: stats.projectCount, icon: '🎮', color: 'from-purple-600 to-purple-400' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="stat-card"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                      Last 24h
                    </div>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.title}</div>
                </motion.div>
              ))}
            </div>

            <VisitorMap visitors={visitors} />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Messages</h2>
              <div className="text-sm text-gray-400">
                Total messages: {messages.length}
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="admin-card"
              >
                <h2 className="text-2xl font-bold mb-6 text-purple-400">Recent Messages</h2>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="message-card"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{msg.name}</h3>
                        <span className="text-sm text-gray-400">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{msg.email}</p>
                      <p className="text-gray-100">{msg.message}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="btn-primary">Reply</button>
                        <button className="btn-secondary">Archive</button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <VisitorMap visitors={visitors} />
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Projects</h2>
              <div className="text-sm text-gray-400">
                Total projects: {projects.length}
              </div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-card mb-8"
            >
              <h3 className="text-xl font-bold mb-4">Add New Project</h3>
              <form onSubmit={handleAddProject} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                      name="title"
                      required
                      className="modern-input"
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                    <input
                      name="image"
                      required
                      className="modern-input"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    className="modern-input h-24 resize-none"
                    placeholder="Project description..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Technologies</label>
                  <input
                    name="technologies"
                    required
                    className="modern-input"
                    placeholder="React, Three.js, TailwindCSS"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="modern-button justify-center"
                >
                  Add Project
                </motion.button>
              </form>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="admin-card"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm bg-purple-600/20 text-purple-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'visitors' && <VisitorStats />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'team' && <TeamManagement />}
        {activeTab === 'technologies' && <TechnologyManagement />}
        {activeTab === 'files' && <FileManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
