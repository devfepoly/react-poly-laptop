const express = require('express');
const router = express.Router();
const sanPhamController = require('../controllers/sanPham.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// Public routes - không cần authentication
router.get('/', sanPhamController.getAll);
router.get('/:id', sanPhamController.getById);
router.get('/loai/:id_loai', sanPhamController.getByLoai);

// Admin-only routes - cần token và role admin
router.post('/', verifyToken, authorizeRoles('admin'), sanPhamController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), sanPhamController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), sanPhamController.delete);

module.exports = router;
