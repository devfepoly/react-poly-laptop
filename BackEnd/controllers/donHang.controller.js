const DonHang = require('../models/donHang.model');

// Lấy tất cả đơn hàng
exports.getAll = async (req, res) => {
  try {
    const donHang = await DonHang.getAll();
    res.json({ success: true, data: donHang });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy đơn hàng theo ID
exports.getById = async (req, res) => {
  try {
    const donHang = await DonHang.getById(req.params.id);
    if (!donHang) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    // Kiểm tra ownership: user chỉ được xem đơn hàng của mình, admin xem tất cả
    if (req.user.vai_tro !== 1) { // Không phải admin
      if (donHang.id_user !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xem đơn hàng này'
        });
      }
    }

    // Lấy chi tiết đơn hàng
    const chiTiet = await DonHang.getChiTiet(req.params.id);
    donHang.chi_tiet = chiTiet;
    res.json({ success: true, data: donHang });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo đơn hàng mới
exports.create = async (req, res) => {
  try {
    console.log('=== Received order request ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { don_hang, chi_tiet } = req.body;

    // Validate dữ liệu cơ bản
    if (!don_hang || !don_hang.ho_ten || !don_hang.sdt || !don_hang.dia_chi) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: họ tên, số điện thoại và địa chỉ'
      });
    }

    if (!chi_tiet || chi_tiet.length === 0) {
      console.log('❌ Validation failed: No products');
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng phải có ít nhất 1 sản phẩm'
      });
    }

    console.log('✅ Validation passed, creating order...');

    // Tạo đơn hàng (id_user có thể null cho khách vãng lai)
    const id = await DonHang.create(don_hang);
    console.log(`✅ Order created with ID: ${id}`);

    // Thêm chi tiết đơn hàng
    console.log(`Adding ${chi_tiet.length} order items...`);
    for (const item of chi_tiet) {
      if (!item.id_sp || !item.so_luong) {
        console.log('⚠️ Skipping invalid item:', item);
        continue; // Bỏ qua item không hợp lệ
      }
      await DonHang.addChiTiet({ ...item, id_dh: id });
      console.log(`✅ Added item: Product ID ${item.id_sp}, Quantity ${item.so_luong}`);
    }

    console.log('=== Order created successfully ===');
    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      id,
      data: { id }
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng: ' + error.message
    });
  }
};

// Cập nhật đơn hàng
exports.update = async (req, res) => {
  try {
    const affected = await DonHang.update(req.params.id, req.body);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ success: true, message: 'Cập nhật đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa đơn hàng
exports.delete = async (req, res) => {
  try {
    const affected = await DonHang.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ success: true, message: 'Xóa đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy đơn hàng theo user ID
exports.getByUserId = async (req, res) => {
  try {
    // Sử dụng getByUserInfo để lấy cả đơn hàng có id_user và đơn hàng khách vãng lai có cùng email/sdt
    const userId = parseInt(req.params.userId);

    console.log('=== Getting orders for userId:', userId);

    // Kiểm tra ownership: user chỉ được xem đơn hàng của mình, admin xem tất cả
    if (req.user.vai_tro !== 1) { // Không phải admin
      if (req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xem đơn hàng của người dùng khác'
        });
      }
    }

    // Lấy thông tin user để match với email/sdt
    const Users = require('../models/users.model');
    const user = await Users.getById(userId);

    console.log('User info:', user);

    let donHang;
    if (user) {
      console.log('Querying by user info:', { userId, email: user.email, phone: user.dien_thoai });
      donHang = await DonHang.getByUserInfo(userId, user.email, user.dien_thoai);
    } else {
      console.log('User not found, querying by userId only');
      donHang = await DonHang.getByUserId(userId);
    }

    console.log('Found orders:', donHang.length);

    res.json({ success: true, data: donHang });
  } catch (error) {
    console.error('Error in getByUserId:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};