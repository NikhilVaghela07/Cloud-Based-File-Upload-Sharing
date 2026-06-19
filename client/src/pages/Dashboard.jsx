import { useState, useEffect } from 'react';
import { FiUploadCloud, FiSearch, FiFolder } from 'react-icons/fi';
import FileCard from '../components/FileCard';
import UploadModal from '../components/UploadModal';
import API from '../api/axios';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const res = await API.get('/files');
        setFiles(res.data.files);
      } catch {
        console.error('Failed to fetch files');
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  const handleUploaded = (newFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleUpdate = (updatedFile) => {
    setFiles((prev) => prev.map((f) => (f._id === updatedFile._id ? updatedFile : f)));
  };

  const handleDelete = (fileId) => {
    setFiles((prev) => prev.filter((f) => f._id !== fileId));
  };

  const filteredFiles = files.filter((f) =>
    f.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Files</h1>
          <p className="dashboard-stats">
            {files.length} file{files.length !== 1 ? 's' : ''} • {formatSize(totalSize)} used
          </p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn btn-primary" id="upload-btn">
          <FiUploadCloud />
          Upload File
        </button>
      </div>

      {files.length > 0 && (
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-files"
          />
        </div>
      )}

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="empty-state">
          <FiFolder className="empty-icon" />
          <h3>{search ? 'No files match your search' : 'No files yet'}</h3>
          <p>{search ? 'Try a different search term' : 'Upload your first file to get started'}</p>
          {!search && (
            <button onClick={() => setShowUpload(true)} className="btn btn-primary">
              <FiUploadCloud /> Upload File
            </button>
          )}
        </div>
      ) : (
        <div className="files-list">
          {filteredFiles.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleUploaded}
      />
    </div>
  );
};

export default Dashboard;
