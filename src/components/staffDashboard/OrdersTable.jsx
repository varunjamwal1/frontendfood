import React from "react";
import StatusBadge from "./StatusBadge";
import OrderActions from "./OrderActions";

const OrdersTable = ({ orders, onApprove, onComplete, onCancel }) => {
  return (
    <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-orange-900 no-scrollbar">
        <table className="w-full text-sm ">
          <thead className="bg-white/5 sticky top-0 z-10 bg-gray-800">
            <tr>
              <th className="p-6 text-left font-semibold bg-gray-800 text-white/90">Order #</th>
              <th className="p-6 text-left font-semibold bg-gray-800 text-white/90">Customer</th>
              <th className="p-6 text-left font-semibold bg-gray-800 text-white/90">Items</th>
              <th className="p-6 text-left font-semibold bg-gray-800 text-white/90">Amount</th>
              <th className="p-6 text-left font-semibold bg-gray-800 text-white/90">Status</th>
              <th className="p-6 text-left font-semibold bg-gray-800 text-white/90">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t border-white/10 hover:bg-white/5 transition-all duration-200"
              >
                <td className="p-6 font-mono text-orange-400">
                  #{order.orderNumber}
                </td>
                <td className="p-6">
                  <div>
                    <div className="font-semibold text-white">
                      {order.customerName}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {order.phone || "No phone"}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="text-gray-300 text-sm">
                    {order.items.length} items
                  </div>
                </td>
                <td className="p-6 font-mono text-2xl font-bold text-emerald-400">
                  ₹{order.totalAmount?.toFixed(0)}
                </td>
                <td className="p-6">
                  <StatusBadge status={order.status} />
                </td>
                <td className="p-6">
                  <OrderActions
                    order={order}
                    onApprove={onApprove}
                    onComplete={onComplete}
                    onCancel={onCancel}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;