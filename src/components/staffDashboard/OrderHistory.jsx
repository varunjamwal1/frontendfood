import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ordersAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import OrderHeader from "./OrderHistory/OrderHeader";
import OrderMetrics from "./OrderHistory/OrderMetrics";
import OrderFilters from "./OrderHistory/OrderFilters";
import OrdersTable from "./OrderHistory/OrdersTable";
import OrderModal from "./OrderHistory/OrderModal";
import LoadingSkeleton from "./OrderHistory/LoadingSkeleton";
import ErrorState from "./OrderHistory/EmptyState";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);

  const searchTimeoutRef = useRef(null);
  const tableRef = useRef(null);

  // ================= FETCH =================
  const fetchOrders = useCallback(async (showToast = true) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await ordersAPI.getAll();

      if (!Array.isArray(data)) throw new Error("Invalid orders data");

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);
      setPage(1);

      if (showToast) toast.success("Orders updated");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= SEARCH =================
  useEffect(() => {
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm]);

  // ================= DATE FILTER (FIXED BUG) =================
  const dateFilteredOrders = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let start = new Date(0);
    let end = new Date();

    if (dateRange === "today") {
      start = new Date(now);
      end = new Date(now);
      end.setDate(end.getDate() + 1);
    }

    if (dateRange === "week") {
      start = new Date(now);
      start.setDate(start.getDate() - start.getDay());
      end = new Date();
    }

    if (dateRange === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date();
    }

    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d < end;
    });
  }, [orders, dateRange]);

  // ================= FILTER =================
  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return dateFilteredOrders.filter((order) => {
      return (
        ((order.customerName || "").toLowerCase().includes(search) ||
          (order.phone || "").includes(searchTerm) ||
          (order._id || "").toLowerCase().includes(search)) &&
        (statusFilter === "all" || order.paymentStatus === statusFilter) &&
        (orderTypeFilter === "all" ||
          (orderTypeFilter === "dine-in" && order.table) ||
          (orderTypeFilter === "takeaway" && !order.table))
      );
    });
  }, [dateFilteredOrders, searchTerm, statusFilter, orderTypeFilter]);

  // ================= PAGINATION =================
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, page]);

  // ================= METRICS =================
  const metrics = useMemo(() => {
    const paid = filteredOrders.filter((o) => o.paymentStatus === "paid");

    return {
      totalRevenue: paid.reduce((s, o) => s + (+o.totalAmount || 0), 0),
      cashRevenue: paid
        .filter((o) => o.paymentMethod === "cash")
        .reduce((s, o) => s + (+o.totalAmount || 0), 0),
      uniqueCustomers: new Set(
        filteredOrders.map((o) => o.phone || o.customerName)
      ).size,
      totalOrders: filteredOrders.length,
      pendingOrders: filteredOrders.filter(
        (o) => o.paymentStatus === "pending"
      ).length,
      avgOrderValue:
        paid.length > 0
          ? paid.reduce((s, o) => s + (+o.totalAmount || 0), 0) / paid.length
          : 0,
    };
  }, [filteredOrders]);

  // ================= UTILS =================
  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusConfig = (status) =>
    ({
      paid: "bg-green-500/15 text-green-400",
      pending: "bg-yellow-500/15 text-yellow-400",
      failed: "bg-red-500/15 text-red-400",
    }[status] || "bg-gray-500/15");

  // ================= SCROLL =================
  const goToPage = (p) => {
    const safePage = Math.max(1, Math.min(p, totalPages));
    setPage(safePage);

    requestAnimationFrame(() => {
      tableRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  // ================= UI =================
  if (loading && !orders.length) return <LoadingSkeleton />;
  if (error && !orders.length) return <ErrorState onRetry={fetchOrders} />;

  return (
    <div className="h-screen overflow-y-auto scroll-smooth bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      
      {/* 🔥 SCROLLBAR */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #888; }
      `}</style>

      <OrderHeader
        filteredOrders={filteredOrders}
        formatCurrency={formatCurrency}
        metrics={metrics}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={fetchOrders}
        loading={loading}
        onExport={() => console.log("export")}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <OrderMetrics metrics={metrics} formatCurrency={formatCurrency} />

        <OrderFilters
          dateRange={dateRange}
          statusFilter={statusFilter}
          orderTypeFilter={orderTypeFilter}
          onDateRangeChange={setDateRange}
          onStatusChange={setStatusFilter}
          onTypeChange={setOrderTypeFilter}
        />

        {/* TABLE */}
        <div ref={tableRef} className="scroll-mt-32 mb-10">
          <OrdersTable
            orders={paginatedOrders}
            loading={loading}
            formatCurrency={formatCurrency}
            formatTime={formatTime}
            getStatusConfig={getStatusConfig}
            onViewOrder={setSelectedOrder}
            onPrintOrder={(o) => console.log(o)}
            page={page}
            totalPages={totalPages}
            totalOrders={filteredOrders.length}
            onPageChange={goToPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrint={() => console.log(selectedOrder)}
          formatCurrency={formatCurrency}
          formatTime={formatTime}
          getStatusConfig={getStatusConfig}
        />
      )}
    </div>
  );
};

export default OrderHistory;