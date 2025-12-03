import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loading from '@components/common/Loading';
import { AuthGuard, AdminGuard, GuestGuard } from '@components/common/Guards';
import HomeTemplate from '@pages/HomeTemplate';
import AdminTemplate from '@pages/AdminTemplate';

// Lazy load pages
const Home = lazy(() => import('@pages/HomeTemplate/Home'));
const Products = lazy(() => import('@pages/HomeTemplate/Products'));
const ProductDetail = lazy(() => import('@pages/HomeTemplate/ProductDetail'));
const News = lazy(() => import('@pages/HomeTemplate/News'));
const Contact = lazy(() => import('@pages/HomeTemplate/Contact'));
const About = lazy(() => import('@pages/HomeTemplate/About'));
const Cart = lazy(() => import('@pages/HomeTemplate/Cart'));
const Compare = lazy(() => import('@pages/HomeTemplate/Compare'));
const OrderHistory = lazy(() => import('@pages/HomeTemplate/OrderHistory'));
const NotFound = lazy(() => import('@pages/HomeTemplate/NotFound'));
const Auth = lazy(() => import('@pages/Auth'));
const ForgotPassword = lazy(() => import('@pages/HomeTemplate/ForgotPassword'));

// Admin pages
const AdminDashboard = lazy(() => import('@pages/AdminTemplate/Dashboard'));
const AdminProducts = lazy(() => import('@pages/AdminTemplate/Products'));
const AdminProductForm = lazy(() => import('@pages/AdminTemplate/Products/ProductForm'));
const AdminOrders = lazy(() => import('@pages/AdminTemplate/Orders'));
const AdminOrderDetail = lazy(() => import('@pages/AdminTemplate/Orders/OrderDetail'));
const AdminCategories = lazy(() => import('@pages/AdminTemplate/Categories'));
const AdminNews = lazy(() => import('@pages/AdminTemplate/News'));
const AdminNewsForm = lazy(() => import('@pages/AdminTemplate/News/NewsForm'));
const AdminUsers = lazy(() => import('@pages/AdminTemplate/Users'));

export default function AppRoutes({ isDark, toggleTheme }) {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<HomeTemplate isDark={isDark} toggleTheme={toggleTheme} />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="category/:id" element={<Products />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="news" element={<News />} />
                    <Route path="news/:id" element={<News />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="compare" element={<Compare />} />

                    {/* Protected Route - Yêu cầu đăng nhập */}
                    <Route
                        path="order-history"
                        element={
                            <AuthGuard>
                                <OrderHistory />
                            </AuthGuard>
                        }
                    />

                    <Route path="contact" element={<Contact />} />
                    <Route path="about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* ============================================ */}
                {/* AUTH ROUTES - Guest Only */}
                {/* ============================================ */}
                <Route
                    path="/login"
                    element={
                        <GuestGuard>
                            <Auth />
                        </GuestGuard>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <GuestGuard>
                            <Auth />
                        </GuestGuard>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <GuestGuard>
                            <ForgotPassword />
                        </GuestGuard>
                    }
                />

                {/* ============================================ */}
                {/* ADMIN TEMPLATE - Admin Only Routes */}
                {/* ============================================ */}
                <Route
                    path="/admin"
                    element={
                        <AdminGuard>
                            <AdminTemplate />
                        </AdminGuard>
                    }
                >
                    <Route index element={<AdminDashboard />} />

                    {/* Products Management */}
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/create" element={<AdminProductForm />} />
                    <Route path="products/edit/:id" element={<AdminProductForm />} />

                    {/* Orders Management */}
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/:id" element={<AdminOrderDetail />} />

                    {/* Categories Management */}
                    <Route path="categories" element={<AdminCategories />} />

                    {/* News Management */}
                    <Route path="news" element={<AdminNews />} />
                    <Route path="news/create" element={<AdminNewsForm />} />
                    <Route path="news/edit/:id" element={<AdminNewsForm />} />

                    {/* Users Management */}
                    <Route path="users" element={<AdminUsers />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
