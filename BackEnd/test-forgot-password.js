const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testForgotPassword() {
    console.log('\n🧪 BẮT ĐẦU TEST FORGOT PASSWORD VỚI OTP\n');

    const testEmail = 'admin01@gmail.com'; // Email test (phải tồn tại trong DB)

    try {
        // ==================== STEP 1: GỬI OTP ====================
        console.log('📋 STEP 1: Gửi OTP đến email');
        console.log('='.repeat(60));

        const forgotResponse = await axios.post(`${BASE_URL}/users/forgot-password`, {
            email: testEmail
        });

        console.log('✓ Response:', forgotResponse.data);
        console.log(`✓ Email đã gửi đến: ${testEmail}`);
        console.log('✓ Vui lòng check email hoặc backend console để lấy mã OTP\n');

        // Đợi user nhập OTP
        console.log('⏳ Đang đợi 5 giây để bạn check email...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // ==================== STEP 2: NHẬP OTP THỦ CÔNG ====================
        console.log('📋 STEP 2: Xác thực OTP');
        console.log('='.repeat(60));
        console.log('⚠️  Vui lòng check:');
        console.log('   1. Backend console để xem OTP');
        console.log('   2. Hoặc email inbox của bạn');
        console.log('   3. Sau đó test verify OTP bằng Postman hoặc curl\n');

        console.log('📝 Ví dụ test với curl:');
        console.log(`curl -X POST ${BASE_URL}/users/verify-otp \\`);
        console.log(`  -H "Content-Type: application/json" \\`);
        console.log(`  -d '{"email":"${testEmail}","otp":"YOUR_OTP_HERE"}'`);
        console.log('');

        console.log('📝 Hoặc với axios (sau khi có OTP):');
        console.log(`const verifyRes = await axios.post('${BASE_URL}/users/verify-otp', {`);
        console.log(`  email: '${testEmail}',`);
        console.log(`  otp: 'YOUR_OTP_HERE'`);
        console.log('});');
        console.log('');

        // ==================== DEMO FLOW ====================
        console.log('📋 FLOW ĐẦY ĐỦ:');
        console.log('='.repeat(60));
        console.log('1. ✓ POST /users/forgot-password → Gửi OTP qua email');
        console.log('2. ⏳ POST /users/verify-otp → Xác thực OTP (cần nhập OTP thật)');
        console.log('3. ⏳ POST /users/reset-password → Đặt lại mật khẩu mới');
        console.log('');

        // ==================== KẾT QUẢ ====================
        console.log('✅ STEP 1 HOÀN THÀNH!');
        console.log('📧 Email đã được gửi thành công');
        console.log('🔐 OTP có hiệu lực trong 5 phút');
        console.log('');
        console.log('📌 HƯỚNG DẪN TIẾP THEO:');
        console.log('1. Check backend console để xem OTP');
        console.log('2. Hoặc check email inbox');
        console.log('3. Test frontend tại: http://localhost:5173/forgot-password');
        console.log('');

    } catch (error) {
        console.error('\n❌ LỖI KHI TEST:');
        console.error('Message:', error.response?.data?.message || error.message);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);

        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  Backend chưa chạy! Hãy start backend trước:');
            console.error('cd BackEnd && node server.js');
        }
    }
}

// Chạy test
console.log('🚀 Starting Forgot Password OTP Test...\n');
testForgotPassword().then(() => {
    console.log('\n✓ Test completed');
}).catch(error => {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
});
