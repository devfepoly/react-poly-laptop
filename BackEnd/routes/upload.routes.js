const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { uploadSingle, uploadMultiple } = require('../middleware/upload.middleware');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// Upload single image - chỉ admin
router.post('/single', verifyToken, authorizeRoles('admin'), uploadSingle, uploadController.uploadSingle);

// Upload multiple images - chỉ admin
router.post('/multiple', verifyToken, authorizeRoles('admin'), uploadMultiple, uploadController.uploadMultiple);

// Delete image - chỉ admin
router.delete('/:filename', verifyToken, authorizeRoles('admin'), uploadController.deleteImage);

// Get all uploaded images - chỉ admin
router.get('/', verifyToken, authorizeRoles('admin'), uploadController.getAllImages);

module.exports = router;
