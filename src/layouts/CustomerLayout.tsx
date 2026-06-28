import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-2xl relative">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;