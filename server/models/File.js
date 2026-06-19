const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    default: 'application/octet-stream',
  },
  size: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private',
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('File', fileSchema);
