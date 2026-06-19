const File = require('../models/File');
const s3Client = require('../config/s3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const BUCKET = process.env.AWS_S3_BUCKET;

// GET /api/share/:shareToken
exports.getSharedFile = async (req, res) => {
  try {
    const file = await File.findOne({ shareToken: req.params.shareToken }).populate('owner', 'name');

    if (!file) {
      return res.status(404).json({ message: 'Shared file not found' });
    }

    // Only public files can be accessed via share link
    if (file.visibility === 'private') {
      return res.status(403).json({ message: 'This file is private' });
    }

    // Generate presigned download URL
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: file.s3Key,
      ResponseContentDisposition: `attachment; filename="${file.displayName}"`,
    });
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    res.json({
      file: {
        displayName: file.displayName,
        mimeType: file.mimeType,
        size: file.size,
        uploadDate: file.uploadDate,
        owner: file.owner.name,
        downloadCount: file.downloadCount,
      },
      downloadUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get shared file', error: error.message });
  }
};
