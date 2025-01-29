import create from 'zustand';

export const useTechStore = create((set) => ({
  technologies: [],
  addTechnology: (tech) => set((state) => ({
    technologies: [...state.technologies, { ...tech, id: Date.now() }]
  })),
  removeTechnology: (id) => set((state) => ({
    technologies: state.technologies.filter(tech => tech.id !== id)
  })),
  updateTechnology: (id, updatedTech) => set((state) => ({
    technologies: state.technologies.map(tech =>
      tech.id === id ? { ...tech, ...updatedTech } : tech
    )
  })),
  searchTechnologies: (query, category) => set((state) => {
    const filtered = state.technologies.filter(tech => {
      const matchesQuery = tech.name.toLowerCase().includes(query.toLowerCase()) ||
                          tech.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || tech.category === category;
      return matchesQuery && matchesCategory;
    });
    return { searchResults: filtered };
  })
}));
