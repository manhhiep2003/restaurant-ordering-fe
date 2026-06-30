import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ChefHat, UtensilsCrossed, LogOut, BellRing, Tags } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

const DashboardLayout = () => {
  // 1. Lấy thông tin user và hàm logout từ Zustand
  const { user, logout } = useAuthStore();

  // 2. Định nghĩa toàn bộ Menu kèm theo Quyền truy cập (roles)
  const allNavItems = [
    { path: '/dashboard/tables', name: 'Sơ đồ bàn', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'STAFF'] },
    { path: '/dashboard/orders', name: 'Trạm phục vụ', icon: <BellRing size={20} />, roles: ['ADMIN', 'STAFF'] },
    { path: '/dashboard/kitchen', name: 'Nhà bếp', icon: <ChefHat size={20} />, roles: ['ADMIN', 'KITCHEN'] },
    { path: '/dashboard/categories', name: 'Quản lý Danh mục', icon: <Tags size={20} />, roles: ['ADMIN'] },
    { path: '/dashboard/foods', name: 'Quản lý Menu', icon: <UtensilsCrossed size={20} />, roles: ['ADMIN'] },
  ];

  // 3. Lọc ra những menu mà user này được phép nhìn thấy
  const allowedNavItems = allNavItems.filter((item) => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-center border-b border-gray-100 px-6">
          <h1 className="text-xl font-black tracking-wider text-orange-600">THUCDON<span className="text-gray-800">.COM</span></h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {/* Render các menu đã được lọc quyền */}
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* 4. Gắn sự kiện đăng xuất */}
        <div className="border-t border-gray-100 p-4">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Bảng điều khiển</h2>
          <div className="flex items-center gap-3">
            {/* Lấy chữ cái đầu tiên trong tên để làm Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold uppercase">
              {user?.fullName ? user.fullName.charAt(0) : 'NV'}
            </div>
            {/* Hiển thị tên thật và chức vụ */}
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">{user?.fullName || 'Người dùng'}</span>
              <span className="text-xs text-gray-500 font-medium">{user?.role}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;