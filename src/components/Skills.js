import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: "Game Development",
    skills: [
      { name: "Unity", level: 90 },
      { name: "Unreal Engine", level: 85 },
      { name: "C#", level: 90 },
      { name: "C++", level: 85 },
      { name: "Game Design", level: 88 },
      { name: "Level Design", level: 85 }
    ]
  },
  {
    title: "MERN Stack",
    skills: [
      { name: "MongoDB", level: 90 },
      { name: "Express.js", level: 85 },
      { name: "React", level: 95 },
      { name: "Node.js", level: 88 },
      { name: "REST APIs", level: 85 },
      { name: "JWT & Auth", level: 80 }
    ]
  },
  {
    title: "3D & Graphics",
    skills: [
      { name: "Blender", level: 85 },
      { name: "Maya", level: 80 },
      { name: "3D Modeling", level: 85 },
      { name: "Texturing", level: 80 },
      { name: "Animation", level: 75 },
      { name: "VFX", level: 70 }
    ]
  },
  {
    title: "Additional Technologies",
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "WebGL", level: 75 },
      { name: "Three.js", level: 80 },
      { name: "Shader Programming", level: 75 },
      { name: "AWS", level: 70 },
      { name: "Docker", level: 75 }
    ]
  }
];

const Skills = () => {
  return (
    <div className="py-20 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 gradient-text"
        >
          Technical Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass p-6 rounded-xl"
            >
              <h3 className="text-2xl font-semibold mb-6 text-purple-400">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-purple-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
