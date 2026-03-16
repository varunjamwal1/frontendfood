import React, { useEffect, useState, useMemo } from "react";
import { ordersAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import { Eye, RefreshCw, Search } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getAll();

      // Sort newest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= TODAY'S ORDERS =================
  const todaysOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today && orderDate < tomorrow;
    });
  }, [orders]);

  // ================= SEARCH + TYPE FILTER =================
  const filteredOrders = useMemo(() => {
    return todaysOrders.filter((order) => {
      const matchesSearch =
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.includes(searchTerm);

      const matchesType =
        orderTypeFilter === "all" ||
        (orderTypeFilter === "dine-in" && order.table) ||
        (orderTypeFilter === "takeaway" && !order.table);

      return matchesSearch && matchesType;
    });
  }, [todaysOrders, searchTerm, orderTypeFilter]);
const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;
  // ================= CALCULATIONS =================
  const totalCash = useMemo(
    () =>
      todaysOrders
        .filter(
          (o) => o.paymentMethod?.toLowerCase() === "cash" && o.paymentStatus === "paid"
        )
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [todaysOrders]
  );

  const totalOnline = useMemo(
    () =>
      todaysOrders
        .filter(
          (o) => o.paymentMethod?.toLowerCase() === "online" && o.paymentStatus === "paid"
        )
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [todaysOrders]
  );

  const totalEarnings = totalCash + totalOnline;

  const totalCustomers = useMemo(
    () => new Set(todaysOrders.map((o) => o.phone || o._id)).size,
    [todaysOrders]
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-gray-900 text-white">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Today's Order History</h2>

        <div className="flex gap-3 flex-wrap items-center">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Order ID or Name..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TYPE FILTER */}
          <div className="flex gap-2">
            {["all", "dine-in", "takeaway"].map((type) => (
              <button
                key={type}
                onClick={() => setOrderTypeFilter(type)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                  orderTypeFilter === type
                    ? "bg-orange-500 text-white"
                    : "bg-gray-800 border border-gray-700 text-gray-300"
                }`}
              >
                {type === "all" ? "All" : type === "dine-in" ? "Dine-In" : "Takeaway"}
              </button>
            ))}
          </div>

          {/* REFRESH */}
          <button
            onClick={fetchOrders}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <SummaryCard title="Cash Earnings" amount={formatCurrency(totalCash)} color="green-400" />
<SummaryCard title="Online Earnings" amount={formatCurrency(totalOnline)} color="blue-400" />
<SummaryCard title="Total Earnings" amount={formatCurrency(totalEarnings)} color="orange-400" />
<SummaryCard title="Total Customers" amount={totalCustomers} color="purple-400" />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No orders found.
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-300 uppercase text-xs font-bold">
                  {[
                    "Order ID",
                    "Time",
                    "Customer",
                    "Order Type",
                    "Items",
                    "Total",
                    "Method",
                    "Status",
                    "Action",
                  ].map((head, idx) => (
                    <th key={idx} className="p-4 bg-gray-700 sticky top-0 z-20">{head}</th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700 text-sm text-gray-300">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 font-mono text-orange-400 whitespace-nowrap">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{order.customerName || "N/A"}</div>
                      <div className="text-xs text-gray-500">{order.phone || "-"}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {order.table ? (
                        <div className="flex flex-col">
                          <span className="font-semibold">{order.table.name}</span>
                          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1 w-fit">Dine-In</span>
                        </div>
                      ) : (
                        <span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full">Takeaway</span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">{order.items?.length || 0} Items</td>
                    <td className="p-4 font-bold text-white whitespace-nowrap">₹{order.totalAmount}</td>
                    <td className="p-4 capitalize whitespace-nowrap">{order.paymentMethod || "N/A"}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <button className="p-2 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= SUMMARY CARD COMPONENT =================
const SummaryCard = ({ title, amount, color }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
    <h3 className="text-gray-400 text-sm">{title}</h3>
    <p className={`text-2xl font-bold mt-2 text-${color}`}>{amount}</p>
  </div>
);

export default OrderHistory;