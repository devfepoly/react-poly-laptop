const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/donHang.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// Admin-only: xem tất cả đơn hàng
router.get('/', verifyToken, authorizeRoles('admin'), donHangController.getAll);

// User hoặc Admin: xem đơn hàng của user (cần verify userId trong controller)
router.get('/user/:userId', verifyToken, donHangController.getByUserId);

// User hoặc Admin: xem chi tiết đơn hàng (cần verify ownership trong controller)
router.get('/:id', verifyToken, donHangController.getById);

// User: tạo đơn hàng (authenticated user)
router.post('/', verifyToken, donHangController.create);

// Admin-only: cập nhật đơn hàng (thay đổi trạng thái)
router.put('/:id', verifyToken, authorizeRoles('admin'), donHangController.update);

// Admin-only: xóa đơn hàng
router.delete('/:id', verifyToken, authorizeRoles('admin'), donHangController.delete);

module.exports = router;
