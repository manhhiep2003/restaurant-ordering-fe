import CheckStatus from '@/pages/customer/CheckStatus';
import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages - Khách hàng
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';

// Pages - Nhân viên / Admin
import Login from './pages/auth/Login';
import KitchenKanban from './pages/dashboard/KitchenKanban';
import TableOverview from '@/pages/dashboard/TableOverview';
import StaffOrders from '@/pages/dashboard/StaffOrders';
import FoodManagement from '@/pages/dashboard/FoodManagement';
import CategoryManagement from '@/pages/dashboard/CategoryManagement';

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles?: string[] }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // 1. Nếu chưa có token -> Đá ra trang login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu có token nhưng không đủ quyền (VD: Bếp cố tình vào sửa Menu) -> Báo lỗi hoặc đá ra
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-red-600">403 - KHÔNG CÓ QUYỀN TRUY CẬP</h1>
        <p className="mt-2">Bạn không được phép truy cập chức năng này.</p>
        <button onClick={() => window.history.back()} className="mt-4 text-blue-600 underline">Quay lại</button>
      </div>
    );
  }

  return children; 
};

export const router = createBrowserRouter([
  // ==========================================
  // LUỒNG KHÁCH HÀNG (Tối ưu Mobile Giao diện)
  // ==========================================
  {
    path: '/menu',
    element: <CustomerLayout />,
    children: [
      {
        index: true, // Đường dẫn gốc: /menu (Trang quét mã QR xong sẽ vào đây kiểm tra)
        element: <CheckStatus />,
      },
      {
        path: 'items', // Đường dẫn: /menu/items (Trang xem danh sách món ăn)
        element: <Menu />,
      },
      {
        path: 'cart', // Đường dẫn: /menu/cart (Trang giỏ hàng của khách)
        element: <Cart />,
      },
    ],
  },

  // ==========================================
  // LUỒNG ĐĂNG NHẬP (Nhân viên / Admin)
  // ==========================================
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },

  // ==========================================
  // LUỒNG QUẢN LÝ / BẾP (Cần Đăng nhập & Phân quyền)
  // ==========================================
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'tables', // Đường dẫn: /dashboard/tables (Màn hình tổng quan sơ đồ bàn)
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <TableOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: 'kitchen',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'KITCHEN']}>
            <KitchenKanban />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <StaffOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'foods',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <FoodManagement />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'categories', 
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CategoryManagement />
          </ProtectedRoute>
        ) 
      },
    ],
  },

  // Tự động chuyển hướng nếu gõ sai đường dẫn
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);