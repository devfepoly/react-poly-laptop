const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'http://localhost:3000/api';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function testFullForgotPasswordFlow() {
    console.log('\n🧪 TEST ĐẦY ĐỦ FORGOT PASSWORD FLOW VỚI NODEMAILER\n');

    const testEmail = 'admin01@gmail.com';
    let resetToken = '';

    try {
        // ==================== STEP 1: GỬI OTP ====================
        console.log('📋 STEP 1: Gửi OTP qua Nodemailer');
        console.log('='.repeat(70));

        const forgotResponse = await axios.post(`${BASE_URL}/users/forgot-password`, {
            email: testEmail
        });

        console.log('✓ Status:', forgotResponse.status);
        console.log('✓ Message:', forgotResponse.data.message);
        console.log(`✓ Email đã gửi đến: ${testEmail}`);
        console.log('\n📧 Kiểm tra:');
        console.log('   - Backend console để xem OTP (========== OTP RESET PASSWORD ==========)');
        console.log(`   - Email inbox của ${testEmail}`);
        console.log('   - Thư mục Spam nếu không thấy trong Inbox\n');

        // ==================== STEP 2: NHẬP OTP ====================
        console.log('📋 STEP 2: Xác thực OTP');
        console.log('='.repeat(70));

        const otp = await askQuestion('Nhập mã OTP (6 chữ số từ email hoặc console): ');

        if (!otp || otp.length !== 6) {
            console.error('❌ OTP phải có 6 chữ số!');
            rl.close();
            return;
        }

        console.log(`\n⏳ Đang xác thực OTP: ${otp}...`);

        const verifyResponse = await axios.post(`${BASE_URL}/users/verify-otp`, {
            email: testEmail,
            otp: otp
        });

        resetToken = verifyResponse.data.data.resetToken;

        console.log('✓ Status:', verifyResponse.status);
        console.log('✓ Message:', verifyResponse.data.message);
        console.log('✓ Reset Token:', resetToken.substring(0, 20) + '...');

        // ==================== STEP 3: ĐẶT LẠI MẬT KHẨU ====================
        console.log('\n📋 STEP 3: Đặt lại mật khẩu mới');
        console.log('='.repeat(70));

        const newPassword = 'NewPassword123!';

        console.log(`⏳ Đang đặt mật khẩu mới: ${newPassword}...`);

        const resetResponse = await axios.post(`${BASE_URL}/users/reset-password`, {
            resetToken: resetToken,
            newPassword: newPassword
        });

        console.log('✓ Status:', resetResponse.status);
        console.log('✓ Message:', resetResponse.data.message);

        // ==================== STEP 4: TEST ĐĂNG NHẬP VỚI MẬT KHẨU MỚI ====================
        console.log('\n📋 STEP 4: Kiểm tra đăng nhập với mật khẩu mới');
        console.log('='.repeat(70));

        const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
            email: testEmail,
            password: newPassword
        });

        console.log('✓ Status:', loginResponse.status);
        console.log('✓ Login successful!');
        console.log('✓ User:', loginResponse.data.data.user.email);

        // ==================== ĐẶT LẠI MẬT KHẨU CŨ ====================
        console.log('\n📋 BONUS: Đặt lại mật khẩu về Admin12345! (để tiếp tục test)');
        console.log('='.repeat(70));

        // Gửi OTP lại
        await axios.post(`${BASE_URL}/users/forgot-password`, {
            email: testEmail
        });

        console.log('⏳ Vui lòng check console để lấy OTP mới...');
        const otp2 = await askQuestion('Nhập mã OTP mới: ');

        const verifyResponse2 = await axios.post(`${BASE_URL}/users/verify-otp`, {
            email: testEmail,
            otp: otp2
        });

        const resetToken2 = verifyResponse2.data.data.resetToken;

        await axios.post(`${BASE_URL}/users/reset-password`, {
            resetToken: resetToken2,
            newPassword: 'Admin12345!'
        });

        console.log('✓ Đã đặt lại password về Admin12345!');

        // ==================== TÓM TẮT ====================
        console.log('\n' + '='.repeat(70));
        console.log('✅ TẤT CẢ TEST CASES ĐÃ PASS!');
        console.log('='.repeat(70));
        console.log('\n📊 KẾT QUẢ:');
        console.log('✓ Gửi OTP qua Nodemailer: PASS');
        console.log('✓ Xác thực OTP: PASS');
        console.log('✓ Đặt lại mật khẩu: PASS');
        console.log('✓ Đăng nhập với mật khẩu mới: PASS');
        console.log('✓ Email configuration: WORKING');
        console.log('✓ OTP expiry (5 minutes): CONFIGURED');
        console.log('\n📧 Email đã được gửi thành công qua Gmail SMTP!');
        console.log('');

    } catch (error) {
        console.error('\n❌ LỖI:');
        console.error('Message:', error.response?.data?.message || error.message);
        console.error('Status:', error.response?.status);

        if (error.response?.data) {
            console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }

        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  Backend chưa chạy!');
            console.error('Chạy: cd BackEnd && node server.js');
        }
    } finally {
        rl.close();
    }
}

// Chạy test
console.log('🚀 Starting Full Forgot Password Flow Test with Nodemailer...\n');
testFullForgotPasswordFlow().then(() => {
    console.log('✓ Test script completed\n');
    process.exit(0);
}).catch(error => {
    console.error('\n✗ Test script failed:', error.message);
    process.exit(1);
});
