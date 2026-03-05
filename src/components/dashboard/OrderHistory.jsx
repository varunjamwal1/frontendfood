import React, { useState, useEffect, useMemo } from "react";
import { ordersAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import { CreditCard, Banknote, ShoppingBag } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("1day");

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getAll();

      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FORMAT DATE =================
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= DATE FILTER =================
  const filterOrdersByRange = (orders, days) => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - days);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= past && orderDate <= now;
    });
  };

  // ================= STATS =================
  const stats = useMemo(() => {
    let filtered = [];

    if (filter === "1day") filtered = filterOrdersByRange(orders, 1);
    if (filter === "10days") filtered = filterOrdersByRange(orders, 10);
    if (filter === "1month") filtered = filterOrdersByRange(orders, 30);

    const total = filtered.reduce(
      (acc, curr) => acc + Number(curr.totalAmount || 0),
      0
    );

    const cash = filtered
      .filter((o) => o.paymentMethod === "cash")
      .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

    const online = filtered
      .filter((o) => o.paymentMethod === "online")
      .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

    return {
      totalOrders: filtered.length,
      totalEarnings: total,
      cashEarnings: cash,
      onlineEarnings: online,
      filteredOrders: filtered,
    };
  }, [orders, filter]);

  const getFilterLabel = () => {
    if (filter === "1day") return "Last 24 Hours";
    if (filter === "10days") return "Last 10 Days";
    if (filter === "1month") return "Last 30 Days";
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Order History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing: <span className="font-semibold">{getFilterLabel()}</span>
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg shadow border dark:border-slate-700">
          {[
            { key: "1day", label: "1 Day" },
            { key: "10days", label: "10 Days" },
            { key: "1month", label: "1 Month" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN SUMMARY */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 mb-6 shadow-lg">
        <p className="text-sm opacity-90">Total Earnings</p>
        <h1 className="text-4xl font-bold mt-1">
          ₹{stats.totalEarnings.toFixed(2)}
        </h1>
        <p className="text-sm mt-2 opacity-80">
          {stats.totalOrders} Orders in {getFilterLabel()}
        </p>
      </div>

      {/* DETAIL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Cash Earnings"
          value={`₹${stats.cashEarnings.toFixed(2)}`}
          icon={<Banknote size={22} />}
          bg="bg-green-500"
        />

        <StatCard
          title="Online Earnings"
          value={`₹${stats.onlineEarnings.toFixed(2)}`}
          icon={<CreditCard size={22} />}
          bg="bg-purple-500"
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag size={22} />}
          bg="bg-blue-500"
        />
      </div>

      {/* ORDERS LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700">
        <div className="p-4 border-b dark:border-slate-700 flex justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Orders
          </h3>
          <button
            onClick={fetchOrders}
            className="text-sm text-orange-500 hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : stats.filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          stats.filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 border-b last:border-none dark:border-slate-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Order #{order._id.slice(-6)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-orange-600 text-lg">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ================= STAT CARD =================
const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow border dark:border-slate-700">
    <div className="flex items-center justify-between mb-3">
      <div className={`${bg} text-white p-2 rounded-lg`}>
        {icon}
      </div>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
      {value}
    </h3>
  </div>
);

export default OrderHistory;