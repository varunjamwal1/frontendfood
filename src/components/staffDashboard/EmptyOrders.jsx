import React from "react";

const EmptyOrders = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-800">
      
      {/* Icon */}
      <div className="w-24 h-24 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">📦</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-3">
        No Orders Found
      </h2>

      {/* Description */}
      <p className="text-gray-400 max-w-md mb-6">
        You haven't placed any orders yet. Once you create an order, it will appear here.
      </p>

      {/* Action Button */}
     

    </div>
  );
};

export default EmptyOrders;