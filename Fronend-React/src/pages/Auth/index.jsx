import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@services/auth.service';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        ho_ten: '',
        dien_thoai: '',
        dia_chi: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (!isLogin && formData.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        } else if (!isLogin) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt';
            }
        }

        // Name validation (chỉ cho register)
        if (!isLogin && !formData.ho_ten) {
            newErrors.ho_ten = 'Họ tên là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error khi user nhập
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            if (isLogin) {
                // Login
                const result = await authService.login(formData.email, formData.password);
                if (result.success) {
                    // Redirect dựa vào role
                    if (result.user.vai_tro === 1) {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                } else {
                    setMessage(result.message || 'Đăng nhập thất bại');
                }
            } else {
                // Register
                const result = await authService.register(formData);
                if (result.success) {
                    navigate('/');
                } else {
                    setMessage(result.message || 'Đăng ký thất bại');
                }
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    // Toggle between login and register
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            ho_ten: '',
            dien_thoai: '',
            dia_chi: ''
        });
        setErrors({});
        setMessage('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                {/* Header */}
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isLogin ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản mới'}
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                value={formData.password}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}

                            {/* Forgot Password - Only show in login mode */}
                            {isLogin && (
                                <div className="text-right">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Register fields */}
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="ho_ten" className="block text-sm font-medium text-gray-700">
                                        Họ tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="ho_ten"
                                        name="ho_ten"
                                        type="text"
                                        autoComplete="name"
                                        value={formData.ho_ten}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.ho_ten ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {errors.ho_ten && <p className="mt-1 text-sm text-red-500">{errors.ho_ten}</p>}
                                </div>

                                <div>
                                    <label htmlFor="dien_thoai" className="block text-sm font-medium text-gray-700">
                                        Số điện thoại
                                    </label>
                                    <input
                                        id="dien_thoai"
                                        name="dien_thoai"
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.dien_thoai}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0123456789"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dia_chi" className="block text-sm font-medium text-gray-700">
                                        Địa chỉ
                                    </label>
                                    <input
                                        id="dia_chi"
                                        name="dia_chi"
                                        type="text"
                                        autoComplete="street-address"
                                        value={formData.dia_chi}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Hà Nội, Việt Nam"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{message}</p>
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </button>

                    {/* Toggle mode */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                        </button>
                    </div>

                    {/* Back to home */}
                    <div className="text-center">
                        <Link to="/" className="text-sm text-gray-600 hover:text-gray-500">
                            ← Quay lại trang chủ
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
