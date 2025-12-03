const express = require('express');
const router = express.Router();
const loaiController = require('../controllers/loai.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// Public routes - không cần authentication
router.get('/', loaiController.getAll);
router.get('/:id', loaiController.getById);

// Admin-only routes - cần token và role admin
router.post('/', verifyToken, authorizeRoles('admin'), loaiController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), loaiController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), loaiController.delete);

module.exports = router;
