import { useState } from 'react';
import { useTables, useOpenTable, useCloseTable } from '../../queries/useTableQueries';
import { Loader2, Users, CheckCircle, Ban, ChevronLeft, ChevronRight } from 'lucide-react';

const TableOverview = () => {
  // 1. Tạo state quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Truyền currentPage vào hook
  const { data, isLoading, isError, isFetching } = useTables(currentPage);
  
  const { mutate: openTable, isPending: isOpenPending } = useOpenTable();
  const { mutate: closeTable, isPending: isClosePending } = useCloseTable();

  if (isLoading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 font-medium">Lỗi tải sơ đồ bàn!</div>;
  }

  // 3. Tách data và meta từ API trả về
  const tables = data?.data || [];
  const meta = data?.meta;

  const handleTableAction = (tableId: string, currentStatus: 'AVAILABLE' | 'OCCUPIED') => {
    if (currentStatus === 'AVAILABLE') {
      if (confirm('Xác nhận mở phiên ăn mới cho bàn này?')) {
        openTable(tableId);
      }
    } else {
      if (confirm('Xác nhận đóng bàn và kết thúc phiên ăn (Khách đã thanh toán)?')) {
        closeTable(tableId);
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ đồ quản lý bàn</h1>
          <p className="text-sm text-gray-500">Mở/Đóng bàn để kích hoạt mã QR cho khách hàng</p>
        </div>
        
        {/* Nút mờ đi báo hiệu đang tải khi chuyển trang */}
        {isFetching && <span className="text-sm text-orange-500 animate-pulse font-medium">Đang cập nhật...</span>}
      </div>

      {/* Lưới hiển thị các bàn */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tables.map((table) => {
          const isOccupied = table.status === 'OCCUPIED';
          const isActionLoading = isOpenPending || isClosePending;

          return (
            <div
              key={table.id}
              className={`flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md
                ${isOccupied ? 'border-red-100 bg-red-50/10' : 'border-green-100 bg-green-50/10'}
              `}
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className={`text-xl font-bold ${isOccupied ? 'text-red-700' : 'text-green-700'}`}>
                    {table.name}
                  </h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold
                    ${isOccupied ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
                  `}>
                    {isOccupied ? 'Có khách' : 'Bàn trống'}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Users size={16} />
                  <span>Sức chứa: {table.capacity} người</span>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <button
                  disabled={isActionLoading}
                  onClick={() => handleTableAction(table.id, table.status)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50
                    ${isOccupied 
                      ? 'bg-red-500 hover:bg-red-600 shadow-sm shadow-red-100' 
                      : 'bg-green-600 hover:bg-green-700 shadow-sm shadow-green-100'
                    }
                  `}
                >
                  {isOccupied ? (
                    <>
                      <Ban size={16} />
                      Thanh toán
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Mở bàn
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
      {meta && meta.lastPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={meta.prevPage === null}
            onClick={() => setCurrentPage(meta.prevPage as number)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Trang trước
          </button>
          
          <span className="text-sm font-medium text-gray-600">
            Trang <span className="font-bold text-gray-900">{meta.currentPage}</span> / {meta.lastPage}
          </span>
          
          <button
            disabled={meta.nextPage === null}
            onClick={() => setCurrentPage(meta.nextPage as number)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang sau <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableOverview;