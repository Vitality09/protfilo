import React, { useState } from 'react';
import Select from 'react-select';
import { useTechStore } from '../../store/techStore';

const categories = [
  { value: 'language', label: 'Programming Language' },
  { value: 'framework', label: 'Framework' },
  { value: 'database', label: 'Database' },
  { value: 'tool', label: 'Development Tool' },
  { value: 'game', label: 'Game Development' }
];

const TechnologyManagement = () => {
  const { technologies, addTechnology, removeTechnology } = useTechStore();
  const [formData, setFormData] = useState({
    name: '',
    category: null,
    logo: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category) return;
    
    addTechnology({
      ...formData,
      category: formData.category.value
    });
    
    setFormData({
      name: '',
      category: null,
      logo: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Technology Management</h2>
      
      {/* Add Technology Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Technology Name"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            required
          />
          <Select
            value={formData.category}
            onChange={(option) => setFormData(prev => ({ ...prev, category: option }))}
            options={categories}
            className="text-black"
            placeholder="Select Category"
            required
          />
        </div>
        <input
          type="url"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          placeholder="Logo URL"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Technology
        </button>
      </form>

      {/* Technologies List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-purple-400">Current Technologies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {technologies.map(tech => (
            <div key={tech.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">{tech.name}</h4>
                  <p className="text-sm text-gray-300">{tech.category}</p>
                </div>
                <button
                  onClick={() => removeTechnology(tech.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyManagement;
