import React from "react";

const OrdersHeader = ({ totalOrders = 0 }) => {
  return (
    <div className="mb-8 flex justify-between items-center">

      <div>
        <h1 className="text-4xl font-bold text-white">
          My Orders
        </h1>

        <p className="text-gray-400">
          Track your restaurant orders
        </p>
      </div>

      <div className="bg-gray-800 px-5 py-3 rounded-xl">
        <div className="text-white font-bold text-xl">
          {totalOrders}
        </div>
        <div className="text-gray-400 text-sm">
          Orders
        </div>
      </div>

    </div>
  );
};

export default OrdersHeader;