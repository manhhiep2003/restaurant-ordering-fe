import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Bell, CheckCircle } from 'lucide-react';
import type { Order } from '@/types/order';

const StaffOrders = () => {
  const { socket, isConnected } = useSocket();
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe sự thay đổi trạng thái từ Bếp
    socket.on('onOrderStatusChanged', (updatedOrder: Order) => {
      if (updatedOrder.status === 'SERVED') {
        // Có món nấu xong -> Thêm vào danh sách chờ bưng
        setReadyOrders((prev) => [updatedOrder, ...prev]);
        
        // Cảnh báo âm thanh (Tùy chọn)
        // new Audio('/ding.mp3').play();
      }
    });

    return () => {
      socket.off('onOrderStatusChanged');
    };
  }, [socket]);

  // Khi nhân viên đã mang ra bàn xong, bấm nút này để ẩn đơn khỏi màn hình
  const handleMarkAsDelivered = (orderId: string) => {
    setReadyOrders((prev) => prev.filter((o) => o.id !== orderId));
    // Vì Database không có trạng thái "DELIVERED" (Đã giao), 
    // nên ở đây chỉ ẩn nó khỏi màn hình của nhân viên.
    // Đơn này sẽ giữ trạng thái SERVED cho đến khi khách ra quầy tính tiền (thành PAID).
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Trạm Phục Vụ (Ra đồ)</h1>
          <p className="text-gray-500">Các món đã nấu xong, chờ mang ra bàn cho khách</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
          <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
        </div>
      </div>

      {readyOrders.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white">
          <Bell className="mb-4 h-12 w-12 text-gray-300" />
          <p className="text-xl font-medium text-gray-400">Chưa có đồ ăn nào cần bưng!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {readyOrders.map((order) => (
            <div key={order.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg border border-green-100">
              {/* Header */}
              <div className="bg-green-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black">{order.table.name}</h2>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-green-600 shadow-sm">
                    SẴN SÀNG
                  </span>
                </div>
              </div>

              {/* Danh sách món */}
              <div className="flex-1 p-4">
                <ul className="space-y-2">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-2">
                      <span className="text-lg font-medium text-gray-800">{item.product.name}</span>
                      <span className="text-xl font-black text-green-600">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nút xác nhận */}
              <div className="bg-gray-50 p-4">
                <button
                  onClick={() => handleMarkAsDelivered(order.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 py-3 font-bold text-white transition-all hover:bg-gray-900 active:scale-95 shadow-md"
                >
                  <CheckCircle size={20} />
                  Xác nhận đã mang ra bàn
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffOrders;