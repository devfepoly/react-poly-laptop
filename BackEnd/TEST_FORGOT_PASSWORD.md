# TEST FORGOT PASSWORD VỚI NODEMAILER OTP

## ✅ Đã cấu hình:
- Nodemailer với Gmail SMTP
- Email: duyvo0506a@gmail.com
- OTP 6 chữ số, hết hạn sau 5 phút
- Route: /forgot-password đã được thêm vào AppRoutes

## 🧪 TEST BACKEND

### Test 1: Gửi OTP (Quick Test)
```bash
cd BackEnd
node test-forgot-password.js
```

### Test 2: Full Flow (Interactive)
```bash
cd BackEnd
node test-forgot-password-full.js
```

Sau đó:
1. Check backend console để lấy OTP
2. Nhập OTP khi được yêu cầu
3. Script sẽ test toàn bộ flow

## 🌐 TEST FRONTEND

### Cách 1: Truy cập trực tiếp
```
http://localhost:5173/forgot-password
```

### Cách 2: Từ trang login
```
http://localhost:5173/login
```
→ Click "Quên mật khẩu?"

### Flow hoàn chỉnh:
1. **Step 1**: Nhập email → Click "Gửi mã OTP"
2. **Step 2**: Check email hoặc backend console → Nhập OTP → Click "Xác thực"
3. **Step 3**: Nhập mật khẩu mới → Click "Đặt lại mật khẩu"

## 📧 Kiểm tra Email

OTP sẽ được gửi đến email với:
- **Subject**: Mã OTP đặt lại mật khẩu
- **From**: ShopApp Support
- **Content**: Template đẹp với mã OTP 6 chữ số
- **Expiry**: 5 phút

### Nếu không nhận được email:
1. Check thư mục **Spam**
2. Check backend console (OTP hiển thị ở đây)
3. Verify EMAIL_USER và EMAIL_PASS trong .env
4. Check Gmail "App Password" còn valid không

## 🔐 Backend Console

Khi gửi OTP, console sẽ hiển thị:
```
========== OTP RESET PASSWORD ==========
Email: admin01@gmail.com
OTP: 123456
Expires in: 5 minutes
========================================
```

## 📝 Test Cases

### TC1: Gửi OTP thành công
- Input: Email hợp lệ (admin01@gmail.com)
- Expected: Email nhận được OTP, console hiển thị OTP
- Status: ✅ PASS

### TC2: Email không tồn tại
- Input: Email không có trong DB
- Expected: "Email không tồn tại trong hệ thống"
- Status: ✅ PASS

### TC3: OTP hết hạn
- Input: OTP sau 5 phút
- Expected: "Mã OTP không đúng hoặc đã hết hạn"
- Status: ✅ PASS

### TC4: OTP sai
- Input: OTP không đúng
- Expected: "Mã OTP không đúng hoặc đã hết hạn"
- Status: ✅ PASS

### TC5: Đặt lại mật khẩu thành công
- Input: Reset token hợp lệ + mật khẩu mới
- Expected: Đổi mật khẩu thành công, đăng nhập được
- Status: ✅ PASS

## 🚀 Quick Start

```bash
# Terminal 1: Start Backend
cd BackEnd
node server.js

# Terminal 2: Start Frontend  
cd Fronend-React
npm run dev

# Terminal 3: Run test
cd BackEnd
node test-forgot-password.js
```

## 📌 API Endpoints

### 1. POST /api/users/forgot-password
```json
{
  "email": "admin01@gmail.com"
}
```

### 2. POST /api/users/verify-otp
```json
{
  "email": "admin01@gmail.com",
  "otp": "123456"
}
```

### 3. POST /api/users/reset-password
```json
{
  "resetToken": "token_from_verify_otp",
  "newPassword": "NewPassword123!"
}
```

## ✅ Kết quả test
- ✅ Nodemailer gửi email thành công
- ✅ OTP được tạo và lưu trong memory
- ✅ OTP expire sau 5 phút
- ✅ Verify OTP hoạt động
- ✅ Reset password thành công
- ✅ Frontend route /forgot-password đã được thêm
- ✅ Full flow hoạt động end-to-end
