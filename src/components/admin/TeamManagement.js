import React, { useState } from 'react';
import { useTeamStore } from '../../store/teamStore';

const TeamManagement = () => {
  const { teamMembers, addTeamMember, removeTeamMember, updateTeamMember } = useTeamStore();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    social: {
      github: '',
      linkedin: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTeamMember(formData);
    setFormData({
      name: '',
      role: '',
      bio: '',
      image: '',
      social: {
        github: '',
        linkedin: ''
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Team Management</h2>
      
      {/* Add Team Member Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            required
          />
        </div>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
          required
        />
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="url"
            name="social.github"
            value={formData.social.github}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
          <input
            type="url"
            name="social.linkedin"
            value={formData.social.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Team Member
        </button>
      </form>

      {/* Team Members List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-purple-400">Current Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">{member.name}</h4>
                  <p className="text-gray-300">{member.role}</p>
                </div>
                <button
                  onClick={() => removeTeamMember(member.id)}
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

export default TeamManagement;
