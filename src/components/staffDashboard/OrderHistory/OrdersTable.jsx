import React from "react";
import OrderRow from "./OrderRow";
import PaginationFooter from "./PaginationFooter";
import EmptyState from "./EmptyState";

const OrdersTable = React.memo(({
  orders = [],
  loading = false,
  formatCurrency = (v) => v,
  formatTime = (v) => v,
  getStatusConfig = () => ({}),
  onViewOrder = () => {},
  onPrintOrder = () => {},
  page = 1,
  totalPages = 1,
  totalOrders = 0,
  onPageChange = () => {},
  itemsPerPage = 10
}) => {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  const safeTotalOrders = Number(totalOrders) || 0;

  return (
    <div className="bg-gradient-to-b from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-2xl overflow-hidden">
      
      {/* 📊 HEADER */}
     

      {/* 🔥 SCROLL AREA */}
      <div className="max-h-[77vh] overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-600/40 scrollbar-track-transparent">
          
          <table className="w-full min-w-[1100px] border-collapse">
            
            {/* 🎯 STICKY HEADER */}
            <thead className="sticky top-0 z-20">
              <tr className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/60">
                
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 w-28">ORDER ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 w-52">CUSTOMER</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 hidden xl:table-cell w-44">PHONE</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 w-36">AMOUNT</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-300 w-32">TYPE</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-300 w-32">STATUS</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-300 w-32">TIME</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 w-36">ACTIONS</th>
              
              </tr>
            </thead>

            {/* 🎯 BODY */}
            <tbody className="divide-y divide-gray-800/40">
              
              {/* 🔄 LOADING */}
              {loading && (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-3 bg-gray-700 rounded w-20" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-700 rounded w-32" /></td>
                    <td className="px-6 py-5 hidden xl:table-cell"><div className="h-3 bg-gray-700 rounded w-24" /></td>
                    <td className="px-6 py-5 text-right"><div className="h-4 bg-gray-700 rounded w-20 ml-auto" /></td>
                    <td className="px-6 py-5 text-center"><div className="h-3 bg-gray-700 rounded w-16 mx-auto" /></td>
                    <td className="px-6 py-5 text-center"><div className="h-3 bg-gray-700 rounded w-16 mx-auto" /></td>
                    <td className="px-6 py-5 text-center"><div className="h-3 bg-gray-700 rounded w-16 mx-auto" /></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-gray-700 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              )}

              {/* 🚫 EMPTY */}
              {!loading && !hasOrders && <EmptyState />}

              {/* ✅ DATA */}
              {!loading && hasOrders && orders.map((order, index) => (
                <OrderRow
                  key={order._id || index} // fallback safe
                  order={order}
                  formatCurrency={formatCurrency}
                  formatTime={formatTime}
                  getStatusConfig={getStatusConfig}
                  onView={() => onViewOrder(order)}
                  onPrint={() => onPrintOrder(order)}
                  evenRow={index % 2 === 0}
                />
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* 📈 PAGINATION */}
      {totalPages > 1 && (
        <div className="border-t border-gray-700/50 bg-gray-900/40 backdrop-blur-xl">
          <PaginationFooter
            page={page}
            totalPages={totalPages}
            totalOrders={safeTotalOrders}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
});

OrdersTable.displayName = "OrdersTable";

export default OrdersTable;