import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiFile, FiUser, FiCalendar, FiHardDrive } from 'react-icons/fi';
import API from '../api/axios';

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const SharedFile = () => {
  const { token } = useParams();
  const [fileData, setFileData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedFile = async () => {
      try {
        const res = await API.get(`/share/${token}`);
        setFileData(res.data.file);
        setDownloadUrl(res.data.downloadUrl);
      } catch (err) {
        setError(err.response?.data?.message || 'File not found');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedFile();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-page">
        <div className="shared-card error">
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-page">
      <div className="shared-card" id="shared-file-card">
        <div className="shared-icon">
          <FiFile />
        </div>
        <h2 className="shared-filename">{fileData.displayName}</h2>

        <div className="shared-meta">
          <div className="meta-item">
            <FiUser />
            <span>Shared by {fileData.owner}</span>
          </div>
          <div className="meta-item">
            <FiHardDrive />
            <span>{formatSize(fileData.size)}</span>
          </div>
          <div className="meta-item">
            <FiCalendar />
            <span>{new Date(fileData.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>

        <a href={downloadUrl} className="btn btn-primary btn-lg btn-full" target="_blank" rel="noreferrer" id="shared-download-btn">
          <FiDownload /> Download File
        </a>
        <p className="shared-hint">Download link expires in 5 minutes</p>
      </div>
    </div>
  );
};

export default SharedFile;
