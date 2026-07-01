import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useUpdateOrderStatus } from '../../queries/useOrderQueries';
import type { Order } from '@/types/order';


const KitchenKanban = () => {
  const { socket, isConnected } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  useEffect(() => {
    if (!socket) return;

    // 1. Lắng nghe đơn mới từ khách
    socket.on('onNewOrder', (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    // 2. Lắng nghe sự thay đổi trạng thái (để đồng bộ nếu có nhiều iPad trong bếp)
    socket.on('onOrderStatusChanged', (updatedOrder: Order) => {
      setOrders((prev) => {
        // Nếu đơn đã thành SERVED (Nấu xong), xóa nó khỏi màn hình Bếp
        if (updatedOrder.status === 'SERVED') {
          return prev.filter((o) => o.id !== updatedOrder.id);
        }
        // Ngược lại, cập nhật trạng thái mới (VD: PENDING -> COOKING)
        return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
      });
    });

    return () => {
      socket.off('onNewOrder');
      socket.off('onOrderStatusChanged');
    };
  }, [socket]);

  const handleUpdateStatus = (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PENDING' ? 'COOKING' : 'SERVED';
    updateStatus({ orderId, status: nextStatus });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Bếp - Đơn Đang Chờ</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
          <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.map((order) => {
          const isPending = order.status === 'PENDING';

          return (
            <div key={order.id} className={`flex flex-col rounded-xl bg-white shadow-md border-t-4 overflow-hidden
              ${isPending ? 'border-red-500' : 'border-yellow-500'}
            `}>
              <div className={`p-4 border-b ${isPending ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className={`text-2xl font-bold ${isPending ? 'text-red-700' : 'text-yellow-700'}`}>
                    {/*order.table.name*/}
                  </h2>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${isPending ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {isPending ? 'CHỜ XÁC NHẬN' : 'ĐANG NẤU'}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-4">
                <ul className="space-y-3">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-2">
                      <span className="font-semibold text-gray-800 text-lg flex-1">{item.product.name}</span>
                      <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg text-lg">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50">
                <button 
                  onClick={() => handleUpdateStatus(order.id, order.status)}
                  className={`w-full py-3 rounded-lg font-bold text-white shadow-sm transition-all active:scale-95
                    ${isPending ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}
                  `}
                >
                  {isPending ? 'Nhận đơn & Bắt đầu nấu' : 'Đã nấu xong (Gọi Phục vụ)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenKanban;