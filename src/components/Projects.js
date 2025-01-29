import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "AI Game Engine",
    description: "Advanced game engine built with C++ and AI integration",
    tech: ["C++", "OpenGL", "TensorFlow"],
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "3D Character Creator",
    description: "AI-powered character creation tool",
    tech: ["React", "Three.js", "Python"],
    image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "VR Gaming Experience",
    description: "Immersive VR game developed with Unity",
    tech: ["C#", "Unity", "VR SDK"],
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const Projects = () => {
  return (
    <section className="py-20 px-8 bg-black/50 relative">
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
      >
        Featured Projects
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
          >
            <div className="h-48 overflow-hidden relative group">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {project.title}
              </h3>
              <p className="text-gray-300 mb-4 h-12">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-purple-600/20 rounded-full text-sm border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-full py-2 bg-purple-600/20 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
