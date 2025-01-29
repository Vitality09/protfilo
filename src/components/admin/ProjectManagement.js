import React, { useState } from 'react';
import Select from 'react-select';
import { useTechStore } from '../../store/techStore';
import { useProjectStore } from '../../store/projectStore';

const ProjectManagement = () => {
  const { technologies } = useTechStore();
  const { projects, addProject, removeProject, updateProject } = useProjectStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    demoUrl: '',
    githubUrl: '',
    technologies: [],
    category: '',
    featured: false
  });

  const techOptions = technologies.map(tech => ({
    value: tech.id,
    label: tech.name
  }));

  const categoryOptions = [
    { value: 'game', label: 'Game Development' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'desktop', label: 'Desktop Application' },
    { value: 'ai', label: 'AI/ML Project' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({
      ...formData,
      technologies: formData.technologies.map(tech => tech.value)
    });
    setFormData({
      title: '',
      description: '',
      image: '',
      demoUrl: '',
      githubUrl: '',
      technologies: [],
      category: '',
      featured: false
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Project Management</h2>
      
      {/* Add Project Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Project Title"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            required
          />
          <Select
            value={categoryOptions.find(opt => opt.value === formData.category)}
            onChange={(option) => setFormData(prev => ({ ...prev, category: option.value }))}
            options={categoryOptions}
            className="text-black"
            placeholder="Select Category"
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg h-32"
          required
        />

        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Project Image URL"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="url"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="Demo URL"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
        </div>

        <Select
          isMulti
          value={formData.technologies}
          onChange={(options) => setFormData(prev => ({ ...prev, technologies: options }))}
          options={techOptions}
          className="text-black"
          placeholder="Select Technologies"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="featured" className="text-white">Featured Project</label>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Project
        </button>
      </form>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-purple-400">Current Projects</h3>
          <Select
            className="w-48 text-black"
            options={categoryOptions}
            placeholder="Filter by Category"
            isClearable
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                <p className="text-sm text-gray-300 mb-2">{project.category}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map(techId => {
                    const tech = technologies.find(t => t.id === techId);
                    return tech ? (
                      <span key={tech.id} className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                        {tech.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setFormData(project);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeProject(project.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
