import create from 'zustand';

export const useFileStore = create((set, get) => ({
  files: [],
  currentDirectory: '/',
  selectedFiles: [],
  loading: false,
  error: null,

  // File operations
  addFiles: (newFiles) => set((state) => ({
    files: [...state.files, ...newFiles.map(file => ({
      id: Date.now() + Math.random(),
      ...file,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))]
  })),

  deleteFiles: (fileIds) => set((state) => ({
    files: state.files.filter(file => !fileIds.includes(file.id)),
    selectedFiles: state.selectedFiles.filter(id => !fileIds.includes(id))
  })),

  moveFiles: (fileIds, targetDirectory) => set((state) => ({
    files: state.files.map(file => 
      fileIds.includes(file.id) 
        ? { ...file, path: `${targetDirectory}/${file.name}`, updatedAt: new Date().toISOString() }
        : file
    )
  })),

  // Directory operations
  createDirectory: (name, parentPath = get().currentDirectory) => {
    const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
    set((state) => ({
      files: [...state.files, {
        id: Date.now() + Math.random(),
        name,
        path: newPath,
        type: 'directory',
        size: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }));
  },

  setCurrentDirectory: (path) => set({ currentDirectory: path }),

  // Selection operations
  toggleFileSelection: (fileId) => set((state) => ({
    selectedFiles: state.selectedFiles.includes(fileId)
      ? state.selectedFiles.filter(id => id !== fileId)
      : [...state.selectedFiles, fileId]
  })),

  clearSelection: () => set({ selectedFiles: [] }),

  // Search operations
  searchFiles: (query) => {
    const { files } = get();
    const searchResults = files.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.path.toLowerCase().includes(query.toLowerCase())
    );
    return searchResults;
  },

  // Status operations
  setLoading: (status) => set({ loading: status }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Get current directory contents
  getCurrentDirectoryContents: () => {
    const { files, currentDirectory } = get();
    return files.filter(file => {
      const parentDir = file.path.substring(0, file.path.lastIndexOf('/')) || '/';
      return parentDir === currentDirectory;
    });
  },

  // Get directory size
  getDirectorySize: (dirPath) => {
    const { files } = get();
    return files
      .filter(file => file.path.startsWith(dirPath) && file.type !== 'directory')
      .reduce((total, file) => total + file.size, 0);
  }
}));
