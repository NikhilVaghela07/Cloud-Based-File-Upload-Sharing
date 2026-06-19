const express = require('express');
const router = express.Router();
const { getSharedFile } = require('../controllers/shareController');

router.get('/:shareToken', getSharedFile);

module.exports = router;
