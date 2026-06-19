import { useState } from 'react';
import {
  FiDownload, FiTrash2, FiEdit3, FiShare2,
  FiLock, FiGlobe, FiCheck, FiX, FiFile,
  FiImage, FiFileText, FiMusic, FiVideo, FiArchive
} from 'react-icons/fi';
import API from '../api/axios';
import ConfirmModal from './ConfirmModal';
import { toast } from './Toast';

const getFileIcon = (mimeType) => {
  if (!mimeType) return <FiFile />;
  if (mimeType.startsWith('image/')) return <FiImage />;
  if (mimeType.startsWith('video/')) return <FiVideo />;
  if (mimeType.startsWith('audio/')) return <FiMusic />;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text'))
    return <FiFileText />;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar'))
    return <FiArchive />;
  return <FiFile />;
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const FileCard = ({ file, onUpdate, onDelete }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.displayName);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDownload = async () => {
    try {
      const res = await API.get(`/files/download/${file._id}`);
      window.open(res.data.url, '_blank');
    } catch (err) {
      toast.error('Download failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/files/${file._id}`);
      onDelete(file._id);
      toast.success(`"${file.displayName}" deleted successfully`);
    } catch (err) {
      toast.error('Delete failed. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === file.displayName) {
      setIsRenaming(false);
      setNewName(file.displayName);
      return;
    }
    try {
      setLoading(true);
      const res = await API.patch(`/files/${file._id}/rename`, { displayName: newName });
      onUpdate(res.data.file);
      setIsRenaming(false);
      toast.success('File renamed successfully');
    } catch (err) {
      toast.error('Rename failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const res = await API.patch(`/files/${file._id}/visibility`);
      onUpdate(res.data.file);
      toast.success(`File is now ${res.data.file.visibility}`);
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const handleShare = () => {
    if (file.visibility === 'private') {
      toast.info('Make the file public first to share it');
      return;
    }
    const shareUrl = `${window.location.origin}/shared/${file.shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  return (
    <>
      <div className="file-card" id={`file-card-${file._id}`}>
        <div className="file-card-icon">
          {getFileIcon(file.mimeType)}
        </div>

        <div className="file-card-info">
          {isRenaming ? (
            <div className="rename-input-group">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                className="rename-input"
                autoFocus
                disabled={loading}
              />
              <button onClick={handleRename} className="btn-icon btn-success" title="Save">
                <FiCheck />
              </button>
              <button onClick={() => { setIsRenaming(false); setNewName(file.displayName); }}
                className="btn-icon btn-danger" title="Cancel">
                <FiX />
              </button>
            </div>
          ) : (
            <h3 className="file-name" title={file.displayName}>{file.displayName}</h3>
          )}

          <div className="file-meta">
            <span className="file-size">{formatSize(file.size)}</span>
            <span className="file-date">{formatDate(file.uploadDate)}</span>
            <span className={`visibility-badge ${file.visibility}`}>
              {file.visibility === 'private' ? <FiLock /> : <FiGlobe />}
              {file.visibility}
            </span>
          </div>
        </div>

        <div className="file-card-actions">
          <button onClick={handleDownload} className="btn-icon" title="Download">
            <FiDownload />
          </button>
          <button onClick={() => setIsRenaming(true)} className="btn-icon" title="Rename">
            <FiEdit3 />
          </button>
          <button onClick={handleShare} className="btn-icon" title="Share">
            <FiShare2 />
          </button>
          <button onClick={handleToggleVisibility} className="btn-icon" title="Toggle visibility">
            {file.visibility === 'private' ? <FiGlobe /> : <FiLock />}
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-icon btn-danger" title="Delete">
            <FiTrash2 />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete File"
        message={`Are you sure you want to delete "${file.displayName}"? This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

export default FileCard;
