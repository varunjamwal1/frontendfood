const OrdersFilters = ({ filter, setFilter, orders }) => (
  <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="w-full p-3 bg-gray-800 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
    >
      <option value="all">All Orders ({orders.length})</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="preparing">Preparing</option>
      <option value="ready">Ready</option>
    </select>
  </div>
);

export default OrdersFilters;