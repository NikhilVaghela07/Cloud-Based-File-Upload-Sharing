const multer = require('multer');

// Use memory storage — file stays in RAM buffer, then gets pushed to S3
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

module.exports = upload;
