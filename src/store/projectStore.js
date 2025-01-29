import create from 'zustand';

export const useProjectStore = create((set) => ({
  projects: [],
  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: Date.now() }]
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id)
  })),
  updateProject: (id, updatedProject) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id ? { ...project, ...updatedProject } : project
    )
  })),
  searchProjects: (query, category) => set((state) => {
    const filtered = state.projects.filter(project => {
      const matchesQuery = project.title.toLowerCase().includes(query.toLowerCase()) ||
                          project.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || project.category === category;
      return matchesQuery && matchesCategory;
    });
    return { searchResults: filtered };
  }),
  getFeaturedProjects: () => set((state) => ({
    featuredProjects: state.projects.filter(project => project.featured)
  }))
}));
