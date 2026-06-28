import CheckStatus from '@/pages/customer/CheckStatus';
import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
// import AdminLayout from './layouts/AdminLayout';

// Pages - Khách hàng
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';

// Pages - Nhân viên / Admin
// import Login from './pages/auth/Login';
// import TableOverview from './pages/admin/TableOverview';
// import KitchenKanban from './pages/admin/KitchenKanban';
// import FoodManagement from './pages/admin/FoodManagement';

// Component bảo vệ tuyến đường (FE Guard)
// Tạm thời viết đơn giản, sau này sẽ kết nối với Zustand Store để check token/role thật
const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token'); // Hoặc lấy từ authStore của Zustand
  const userRole = localStorage.getItem('role'); // Ví dụ: 'ADMIN', 'STAFF', 'KITCHEN'

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/login" replace />; // Hoặc trang 403 Unauthorized
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

//   // ==========================================
//   // LUỒNG ĐĂNG NHẬP (Nhân viên / Admin)
//   // ==========================================
//   {
//     path: '/login',
//     element: <Login />,
//   },

//   // ==========================================
//   // LUỒNG QUẢN LÝ / BẾP (Cần Đăng nhập & Phân quyền)
//   // ==========================================
//   {
//     path: '/admin',
//     element: (
//       <ProtectedRoute>
//         <AdminLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       {
//         path: 'tables', // Đường dẫn: /admin/tables (Màn hình tổng quan sơ đồ bàn)
//         element: (
//           <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
//             <TableOverview />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: 'kitchen', // Đường dẫn: /admin/kitchen (Màn hình của Bếp)
//         element: (
//           <ProtectedRoute allowedRoles={['ADMIN', 'KITCHEN']}>
//             <KitchenKanban />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: 'foods', // Đường dẫn: /admin/foods (Màn hình quản lý Menu của Admin)
//         element: (
//           <ProtectedRoute allowedRoles={['ADMIN']}>
//             <FoodManagement />
//           </ProtectedRoute>
//         ),
//       },
//     ],
//   },

  // Tự động chuyển hướng nếu gõ sai đường dẫn
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);