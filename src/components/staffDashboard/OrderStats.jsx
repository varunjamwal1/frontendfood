import React from 'react';

const OrderStats = ({ stats, customerOrders }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/30 backdrop-blur-xl rounded-3xl p-8 text-center hover:scale-105 transition-all">
        <div className="text-3xl font-black text-blue-300 mb-2">📦</div>
        <div className="text-2xl font-black text-white">{customerOrders}</div>
        <div className="text-sm text-blue-300 uppercase tracking-wider">My Orders</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/30 backdrop-blur-xl rounded-3xl p-8 text-center hover:scale-105 transition-all">
        <div className="text-3xl font-black text-yellow-300 mb-2">⏳</div>
        <div className="text-2xl font-black text-white">{stats.pendingApprovals || 0}</div>
        <div className="text-sm text-yellow-300 uppercase tracking-wider">Pending</div>
      </div>
    </div>
  );
};

export default OrderStats;