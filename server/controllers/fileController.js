const File = require('../models/File');
const s3Client = require('../config/s3');
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const BUCKET = process.env.AWS_S3_BUCKET;

// POST /api/files/upload
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const s3Key = `uploads/${uuidv4()}-${req.file.originalname}`;

    // Upload to S3
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });
    await s3Client.send(putCommand);

    // Save metadata to MongoDB
    const file = await File.create({
      originalName: req.file.originalname,
      displayName: req.file.originalname,
      s3Key,
      mimeType: req.file.mimetype,
      size: req.file.size,
      owner: req.user.id,
      shareToken: uuidv4(),
    });

    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// GET /api/files
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id }).sort({ uploadDate: -1 });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch files', error: error.message });
  }
};

// GET /api/files/download/:id
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Only owner can download private files
    if (file.visibility === 'private' && file.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate presigned URL (valid for 5 minutes)
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: file.s3Key,
      ResponseContentDisposition: `attachment; filename="${file.displayName}"`,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    res.json({ url, fileName: file.displayName });
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};

// DELETE /api/files/:id
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Only owner can delete
    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: file.s3Key,
    });
    await s3Client.send(deleteCommand);

    // Delete from MongoDB
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

// PATCH /api/files/:id/rename
exports.renameFile = async (req, res) => {
  try {
    const { displayName } = req.body;
    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ message: 'Display name is required' });
    }

    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    file.displayName = displayName.trim();
    await file.save();

    res.json({ message: 'File renamed successfully', file });
  } catch (error) {
    res.status(500).json({ message: 'Rename failed', error: error.message });
  }
};

// PATCH /api/files/:id/visibility
exports.toggleVisibility = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    file.visibility = file.visibility === 'private' ? 'public' : 'private';
    await file.save();

    res.json({ message: `File is now ${file.visibility}`, file });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update visibility', error: error.message });
  }
};
