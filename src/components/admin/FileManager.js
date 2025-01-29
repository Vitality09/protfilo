import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import db from '../../services/DatabaseService';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newDirName, setNewDirName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');

  // Load files
  useEffect(() => {
    const loadFiles = async () => {
      await db.load();
      const files = await db.getFilesByDirectory(currentDirectory);
      setFiles(files);
    };
    loadFiles();
  }, [currentDirectory]);

  // File upload handling
  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        const newFile = {
          name: file.name,
          path: `${currentDirectory}${currentDirectory.endsWith('/') ? '' : '/'}${file.name}`,
          type: 'file',
          size: file.size,
          mimeType: file.type,
          data: base64Data
        };
        await db.create('files', newFile);
        const updatedFiles = await db.getFilesByDirectory(currentDirectory);
        setFiles(updatedFiles);
      };
      reader.readAsDataURL(file);
    }
  }, [currentDirectory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true
  });

  // Directory creation
  const handleCreateDirectory = async (e) => {
    e.preventDefault();
    if (newDirName) {
      const newDir = {
        name: newDirName,
        path: `${currentDirectory}${currentDirectory.endsWith('/') ? '' : '/'}${newDirName}`,
        type: 'directory',
        size: 0
      };

      await db.create('files', newDir);
      const updatedFiles = await db.getFilesByDirectory(currentDirectory);
      setFiles(updatedFiles);
      setNewDirName('');
    }
  };

  // Navigation
  const handleNavigate = async (path) => {
    setSelectedFiles([]);
    setCurrentDirectory(path);
  };

  // Delete files
  const handleDelete = async (fileIds) => {
    for (const id of fileIds) {
      await db.delete('files', id);
    }
    const updatedFiles = await db.getFilesByDirectory(currentDirectory);
    setFiles(updatedFiles);
    setSelectedFiles([]);
  };

  // Download file
  const handleDownload = async (file) => {
    if (file.type === 'directory') return;

    const base64Data = file.data;
    const binaryData = atob(base64Data);
    const byteArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: file.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Search files
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      const results = await db.search('files', query);
      setFiles(results);
    } else {
      const files = await db.getFilesByDirectory(currentDirectory);
      setFiles(files);
    }
  };

  // File selection
  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Breadcrumb navigation
  const renderBreadcrumbs = () => {
    const parts = currentDirectory.split('/').filter(Boolean);
    return (
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => handleNavigate('/')}
          className="text-purple-400 hover:text-purple-300"
        >
          Home
        </button>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="text-gray-500">/</span>
            <button
              onClick={() => handleNavigate('/' + parts.slice(0, index + 1).join('/'))}
              className="text-purple-400 hover:text-purple-300"
            >
              {part}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">File Manager</h2>

      {/* Breadcrumb Navigation */}
      {renderBreadcrumbs()}

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <form onSubmit={handleCreateDirectory} className="flex space-x-2">
            <input
              type="text"
              value={newDirName}
              onChange={(e) => setNewDirName(e.target.value)}
              placeholder="New folder name"
              className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Folder
            </button>
          </form>
          {selectedFiles.length > 0 && (
            <button
              onClick={() => handleDelete(selectedFiles)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete Selected
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search files..."
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="text-purple-400 hover:text-purple-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {view === 'grid' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? 'border-purple-500 bg-purple-500 bg-opacity-10' : 'border-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-purple-400">Drop the files here...</p>
        ) : (
          <p className="text-gray-400">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>

      {/* File Grid/List */}
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'space-y-2'
        }
      >
        {files.map((item) => (
          <div
            key={item.id}
            className={`relative p-4 rounded-lg ${
              selectedFiles.includes(item.id) ? 'bg-purple-600' : 'bg-gray-700'
            } hover:bg-purple-500 transition-colors cursor-pointer group`}
            onClick={(e) => {
              if (!e.target.closest('button')) {
                if (item.type === 'directory') {
                  handleNavigate(item.path);
                } else {
                  toggleFileSelection(item.id);
                }
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <svg
                className={`w-6 h-6 ${selectedFiles.includes(item.id) ? 'text-white' : 'text-purple-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.type === 'directory' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                )}
              </svg>
              <div className="flex-1">
                <p className={`font-medium ${selectedFiles.includes(item.id) ? 'text-white' : 'text-gray-200'}`}>
                  {item.name}
                </p>
                <p className={`text-sm ${selectedFiles.includes(item.id) ? 'text-gray-200' : 'text-gray-400'}`}>
                  {item.type === 'file' ? formatFileSize(item.size) : ''}
                </p>
              </div>
              {item.type === 'file' && (
                <button
                  onClick={() => handleDownload(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManager;
