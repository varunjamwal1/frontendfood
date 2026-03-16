const OrdersSearch = ({ search, setSearch }) => (
  <div className="bg-gray-800 p-4 rounded-2xl border border-white/20">
    <input
      type="text"
      placeholder="Search by name or order #..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-white/70"
    />
  </div>
);

export default OrdersSearch;