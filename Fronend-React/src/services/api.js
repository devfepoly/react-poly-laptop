import axios from 'axios';
import { authService } from './auth.service';

const API_BASE_URL = 'http://localhost:3000/api';

// ===== API CLIENT =====
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

/**
 * Request Interceptor - Tự động gắn JWT token vào header
 * Lấy token từ localStorage và gắn vào Authorization header
 */
const handleRequestSuccess = (config) => {
    try {
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
            // Token được lưu dưới dạng JSON, cần parse
            const token = JSON.parse(tokenString);
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch {
        // Nếu token không parse được, thử lấy trực tiếp
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
};
//**8* */
const handleRequestError = (error) => {
    return Promise.reject(error);
};

/**
 * Response Interceptor - Xử lý lỗi authentication/authorization
 * 401 Unauthorized: Token không hợp lệ/hết hạn
 * 403 Forbidden: Không có quyền truy cập
 */
const handleResponseSuccess = (response) => {
    return response;
};

const handleResponseError = (error) => {
    if (error.response?.status === 401) {
        // Token không hợp lệ hoặc đã hết hạn
        console.warn('🔒 401 Unauthorized - Token invalid or expired:', error.config?.url);

        // Xóa token và user khỏi localStorage
        authService.logout();

        // Redirect về trang login nếu không ở trang login/register
        if (!window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/register') &&
            !window.location.pathname.includes('/forgot-password')) {
            window.location.href = '/login';
        }
    } else if (error.response?.status === 403) {
        // User không có quyền truy cập resource này
        console.warn('🚫 403 Forbidden - Insufficient permissions:', error.config?.url);

        // Hiển thị thông báo cho user
        if (typeof window !== 'undefined') {
            alert('Bạn không có quyền thực hiện thao tác này!');
        }

        // Redirect về trang chủ nếu đang ở trang admin
        if (window.location.pathname.includes('/admin')) {
            window.location.href = '/';
        }
    }

    return Promise.reject(error);
};

// Áp dụng interceptors
api.interceptors.request.use(handleRequestSuccess, handleRequestError);
api.interceptors.response.use(handleResponseSuccess, handleResponseError);

// ===== LOẠI SẢN PHẨM API =====
export const loaiAPI = {
    getAll: () => api.get('/loai'),
    getById: (id) => api.get(`/loai/${id}`),
    create: (data) => api.post('/loai', data),
    update: (id, data) => api.put(`/loai/${id}`, data),
    delete: (id) => api.delete(`/loai/${id}`),
};

// ===== SẢN PHẨM API =====
export const sanPhamAPI = {
    getAll: (params) => api.get('/san-pham', { params }),
    getById: (id) => api.get(`/san-pham/${id}`),
    getByLoai: (idLoai) => api.get(`/san-pham/loai/${idLoai}`),
    create: (data) => api.post('/san-pham', data),
    update: (id, data) => api.put(`/san-pham/${id}`, data),
    delete: (id) => api.delete(`/san-pham/${id}`),
};

// ===== LOẠI TIN API =====
export const loaiTinAPI = {
    getAll: () => api.get('/loai-tin'),
    getById: (id) => api.get(`/loai-tin/${id}`),
    create: (data) => api.post('/loai-tin', data),
    update: (id, data) => api.put(`/loai-tin/${id}`, data),
    delete: (id) => api.delete(`/loai-tin/${id}`),
};

// ===== TIN TỨC API =====
export const tinTucAPI = {
    getAll: () => api.get('/tin-tuc'),
    getById: (id) => api.get(`/tin-tuc/${id}`),
    getByLoai: (idLoai) => api.get(`/tin-tuc/loai/${idLoai}`),
    create: (data) => api.post('/tin-tuc', data),
    update: (id, data) => api.put(`/tin-tuc/${id}`, data),
    delete: (id) => api.delete(`/tin-tuc/${id}`),
};

// ===== ĐỚN HÀNG API =====
export const donHangAPI = {
    getAll: () => api.get('/don-hang'),
    getById: (id) => api.get(`/don-hang/${id}`),
    getByUserId: (userId) => api.get(`/don-hang/user/${userId}`),
    create: (data) => api.post('/don-hang', data),
    update: (id, data) => api.put(`/don-hang/${id}`, data),
    delete: (id) => api.delete(`/don-hang/${id}`),
};

// ===== USERS API =====
export const usersAPI = {
    register: (data) => api.post('/users/register', data),
    login: (data) => api.post('/users/login', data),
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    forgotPassword: (email) => api.post('/users/forgot-password', { email }),
    verifyOTP: (email, otp) => api.post('/users/verify-otp', { email, otp }),
    resetPassword: (resetToken, newPassword) => api.post('/users/reset-password', { resetToken, newPassword }),
};

// ===== UPLOAD API =====
export const uploadAPI = {
    uploadSingle: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        // Ensure token is included in multipart body as well for servers that
        // prefer/require token in the payload (some middlewares/readers).
        try {
            const token = authService.getToken();
            if (token) formData.append('token', token);
        } catch {
            // ignore
        }

        return api.post('/upload/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadMultiple: async (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        // Append token to form data as well
        try {
            const token = authService.getToken();
            if (token) formData.append('token', token);
        } catch {
            // ignore
        }

        return api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteImage: (filename) => api.delete(`/upload/${filename}`),
    getAllImages: () => api.get('/upload'),
};

export default api;
