const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadFile,
  getUserFiles,
  downloadFile,
  deleteFile,
  renameFile,
  toggleVisibility,
} = require('../controllers/fileController');

router.get('/', auth, getUserFiles);
router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/download/:id', auth, downloadFile);
router.delete('/:id', auth, deleteFile);
router.patch('/:id/rename', auth, renameFile);
router.patch('/:id/visibility', auth, toggleVisibility);

module.exports = router;
