class DatabaseService {
  constructor() {
    this.dbKey = 'portfolio_db';
    this.data = null;
  }

  // Load database
  async load() {
    try {
      const data = localStorage.getItem(this.dbKey);
      this.data = data ? JSON.parse(data) : {
        files: [],
        projects: [],
        technologies: [],
        team: []
      };
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = {
        files: [],
        projects: [],
        technologies: [],
        team: []
      };
    }
  }

  // Save database
  async save() {
    try {
      localStorage.setItem(this.dbKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving database:', error);
      throw error;
    }
  }

  // Create backup
  async backup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupKey = `${this.dbKey}_backup_${timestamp}`;
      localStorage.setItem(backupKey, JSON.stringify(this.data));
      return backupKey;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  // Generic CRUD operations
  async create(collection, item) {
    if (!this.data) await this.load();
    
    const newItem = {
      id: Date.now().toString(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.data[collection].push(newItem);
    await this.save();
    return newItem;
  }

  async read(collection, id) {
    if (!this.data) await this.load();
    return id 
      ? this.data[collection].find(item => item.id === id)
      : this.data[collection];
  }

  async update(collection, id, updates) {
    if (!this.data) await this.load();
    
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.data[collection][index] = updatedItem;
    await this.save();
    return updatedItem;
  }

  async delete(collection, id) {
    if (!this.data) await this.load();
    
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data[collection].splice(index, 1);
    await this.save();
    return true;
  }

  // Search functionality
  async search(collection, query) {
    if (!this.data) await this.load();
    
    const searchableFields = {
      files: ['name', 'path', 'type'],
      projects: ['title', 'description', 'category'],
      technologies: ['name', 'category'],
      team: ['name', 'role', 'bio']
    };

    const fields = searchableFields[collection];
    if (!fields) return [];

    const lowerQuery = query.toLowerCase();
    return this.data[collection].filter(item =>
      fields.some(field =>
        item[field] && item[field].toLowerCase().includes(lowerQuery)
      )
    );
  }

  // File specific operations
  async getFilesByDirectory(directoryPath) {
    if (!this.data) await this.load();
    return this.data.files.filter(file => 
      file.path.startsWith(directoryPath) && 
      file.path !== directoryPath
    );
  }

  async moveFile(fileId, newPath) {
    if (!this.data) await this.load();
    
    const file = await this.update('files', fileId, { path: newPath });
    if (!file) return null;

    // Update paths of all children if it's a directory
    if (file.type === 'directory') {
      const children = this.data.files.filter(f => 
        f.path.startsWith(file.path) && f.id !== file.id
      );

      for (const child of children) {
        const newChildPath = child.path.replace(file.path, newPath);
        await this.update('files', child.id, { path: newChildPath });
      }
    }

    return file;
  }

  // Project specific operations
  async getFeaturedProjects() {
    if (!this.data) await this.load();
    return this.data.projects.filter(project => project.featured);
  }

  async getProjectsByTechnology(technologyId) {
    if (!this.data) await this.load();
    return this.data.projects.filter(project => 
      project.technologies && project.technologies.includes(technologyId)
    );
  }

  // Technology specific operations
  async getTechnologiesByCategory(category) {
    if (!this.data) await this.load();
    return this.data.technologies.filter(tech => tech.category === category);
  }

  // Team specific operations
  async getTeamMembersByRole(role) {
    if (!this.data) await this.load();
    return this.data.team.filter(member => member.role === role);
  }
}

// Create a singleton instance
const db = new DatabaseService();
export default db;
