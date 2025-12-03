const express = require('express');
const router = express.Router();
const tinTucController = require('../controllers/tinTuc.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// Public routes - không cần authentication
router.get('/', tinTucController.getAll);
router.get('/:id', tinTucController.getById);
router.get('/loai/:id_loai', tinTucController.getByLoai);

// Admin-only routes - cần token và role admin
router.post('/', verifyToken, authorizeRoles('admin'), tinTucController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), tinTucController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), tinTucController.delete);

module.exports = router;
