import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';

// Tạm định nghĩa Interface cho Order lấy từ Backend về
interface OrderItem {
  id: string;
  quantity: number;
  note: string | null;
  product: { name: string };
}

interface Order {
  id: string;
  table: { name: string };
  createdAt: string;
  orderItems: OrderItem[];
}

const KitchenKanban = () => {
  const { socket, isConnected } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]); // Danh sách đơn hàng đang chờ nấu

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe sự kiện 'onNewOrder' từ OrderGateway của NestJS
    socket.on('onNewOrder', (newOrder: Order) => {
      console.log('Ting ting! Có đơn mới:', newOrder);
      
      // Đưa đơn hàng mới lên đầu danh sách
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      
      // Bạn có thể play 1 đoạn âm thanh nhỏ ở đây để Bếp chú ý
      // new Audio('/ding.mp3').play();
    });

    // Nhớ dọn dẹp listener để tránh bị lặp sự kiện
    return () => {
      socket.off('onNewOrder');
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Bếp - Đơn Đang Chờ</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Trạng thái kết nối:</span>
          <span className={`flex h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm border border-dashed border-gray-300">
          <p className="text-xl font-medium text-gray-400">Chưa có đơn hàng nào, bếp đang rảnh!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col rounded-xl bg-white shadow-md border-t-4 border-orange-500 overflow-hidden">
              {/* Header của Bill */}
              <div className="bg-orange-50 p-4 border-b border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-orange-700">{order.table.name}</h2>
                  <span className="text-sm font-semibold text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono">Mã ĐH: {order.id.split('-')[0]}</p>
              </div>

              {/* Danh sách món cần nấu */}
              <div className="flex-1 p-4">
                <ul className="space-y-3">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="flex flex-col border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-800 text-lg flex-1">
                          {item.product.name}
                        </span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg text-lg">
                          x{item.quantity}
                        </span>
                      </div>
                      {item.note && (
                        <span className="text-sm text-red-500 italic mt-1 font-medium border-l-2 border-red-500 pl-2">
                          *Ghi chú: {item.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nút thao tác của Bếp */}
              <div className="p-4 bg-gray-50">
                <button className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white font-bold py-3 rounded-lg shadow-sm">
                  Xác nhận Bắt đầu Nấu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenKanban;