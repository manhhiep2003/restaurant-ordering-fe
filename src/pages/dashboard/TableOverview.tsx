import { useState } from 'react';
import { useTables, useOpenTable } from '../../queries/useTableQueries';
import { useTableBill, useCheckoutTable } from '../../queries/useOrderQueries';
import { Loader2, Users, CheckCircle, Receipt, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatVND } from '@/lib/currency';

const TableOverview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useTables(currentPage);
  const { mutate: openTable, isPending: isOpenPending } = useOpenTable();
  
  // State lưu lại ID của bàn đang được bấm chọn để thanh toán
  const [checkoutTableId, setCheckoutTableId] = useState<string | null>(null);

  // Lấy dữ liệu Hóa đơn dựa vào checkoutTableId
  const { data: billData, isLoading: isBillLoading } = useTableBill(checkoutTableId);
  
  // Hook xử lý thanh toán
  const { mutate: checkoutTable, isPending: isCheckoutPending } = useCheckoutTable();

  if (isLoading && !data) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  if (isError) return <div className="text-center text-red-500 font-medium">Lỗi tải sơ đồ bàn!</div>;

  const tables = data?.data || [];
  const meta = data?.meta;

  const handleTableAction = (tableId: string, currentStatus: 'AVAILABLE' | 'OCCUPIED') => {
    if (currentStatus === 'AVAILABLE') {
      if (confirm('Xác nhận mở phiên ăn mới cho bàn này?')) {
        openTable(tableId);
      }
    } else {
      // THAY ĐỔI: Bàn đang có khách -> Mở Modal thanh toán
      setCheckoutTableId(tableId);
    }
  };

  const handleConfirmCheckout = () => {
    if (!checkoutTableId) return;
    
    checkoutTable(checkoutTableId, {
      onSuccess: () => {
        alert('Thanh toán thành công!');
        setCheckoutTableId(null); 
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán';
        alert(`Lỗi: ${msg}`);
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ đồ quản lý bàn</h1>
          <p className="text-sm text-gray-500">Mở bàn, in hóa đơn và thanh toán</p>
        </div>
        {isFetching && <span className="text-sm text-orange-500 animate-pulse font-medium">Đang cập nhật...</span>}
      </div>

      {/* Lưới hiển thị các bàn */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tables.map((table) => {
          const isOccupied = table.status === 'OCCUPIED';
          const isActionLoading = isOpenPending || (isCheckoutPending && checkoutTableId === table.id);

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
                      <Receipt size={16} /> {/* Đổi icon thành cái Hóa đơn */}
                      Xem Bill / Tính tiền
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Mở bàn cho khách
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phân trang */}
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

      {/* ======================================= */}
      {/* MODAL HÓA ĐƠN (Chỉ hiện khi có checkoutTableId) */}
      {/* ======================================= */}
      {checkoutTableId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between bg-gray-50 p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="text-orange-600" />
                Hóa Đơn Tạm Tính
              </h2>
              <button 
                onClick={() => setCheckoutTableId(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nội dung Bill */}
            <div className="p-5 min-h-50">
              {isBillLoading ? (
                <div className="flex h-full items-center justify-center flex-col text-gray-500">
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-orange-500" />
                  <p>Đang tổng hợp đơn hàng...</p>
                </div>
              ) : !billData || billData.orderCount === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Bàn này chưa gọi món nào.
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-between text-sm text-gray-500 border-b border-dashed border-gray-300 pb-4">
                    <span>Bàn: <strong className="text-gray-900">{billData.table.name}</strong></span>
                    <span>Số lượt gọi món: <strong className="text-gray-900">{billData.orderCount}</strong></span>
                  </div>

                  <div className="max-h-[40vh] overflow-y-auto pr-2">
                    <ul className="space-y-4">
                      {billData.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{item.productName}</span>
                            <span className="text-gray-500 text-xs">
                              {formatVND(item.unitPrice)} x {item.quantity}
                            </span>
                          </div>
                          <span className="font-bold text-gray-900">{formatVND(item.total)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Footer Tính tiền */}
            <div className="bg-gray-50 p-5 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium text-gray-600">TỔNG CỘNG</span>
                <span className="text-3xl font-black text-red-600">
                  {billData ? formatVND(billData.grandTotal) : '0 ₫'}
                </span>
              </div>
              
              <button
                disabled={isCheckoutPending || !billData || billData.orderCount === 0}
                onClick={handleConfirmCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 text-lg font-bold text-white transition-all hover:bg-orange-700 active:scale-95 shadow-md disabled:bg-gray-400 disabled:shadow-none"
              >
                {isCheckoutPending ? <Loader2 className="animate-spin h-6 w-6" /> : <Receipt size={24} />}
                Xác Nhận Thu Tiền & Đóng Bàn
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TableOverview;