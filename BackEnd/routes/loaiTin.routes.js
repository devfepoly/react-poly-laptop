const express = require('express');
const router = express.Router();
const loaiTinController = require('../controllers/loaiTin.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// Public routes - không cần authentication
router.get('/', loaiTinController.getAll);
router.get('/:id', loaiTinController.getById);

// Admin-only routes - cần token và role admin
router.post('/', verifyToken, authorizeRoles('admin'), loaiTinController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), loaiTinController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), loaiTinController.delete);

module.exports = router;
