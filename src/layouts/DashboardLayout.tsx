import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ChefHat, UtensilsCrossed, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  // Menu điều hướng cho nhân viên
  const navItems = [
    { path: '/dashboard/tables', name: 'Sơ đồ bàn', icon: <LayoutDashboard size={20} /> },
    { path: '/dashboard/kitchen', name: 'Nhà bếp', icon: <ChefHat size={20} /> },
    { path: '/dashboard/foods', name: 'Quản lý Menu', icon: <UtensilsCrossed size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar (Thanh điều hướng bên trái) */}
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-center border-b border-gray-100 px-6">
          <h1 className="text-xl font-black tracking-wider text-orange-600">THUCDON<span className="text-gray-800">.COM</span></h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
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

        {/* Nút đăng xuất ở đáy Sidebar */}
        <div className="border-t border-gray-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content (Khu vực hiển thị các trang con như Bếp, Sơ đồ bàn) */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Ca làm việc: Sáng</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
              NV
            </div>
            <span className="text-sm font-medium">Nhân viên Phục vụ</span>
          </div>
        </header>

        {/* Cắm Outlet để render component KitchenKanban hoặc TableOverview vào đây */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;