import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { ordersAPI } from "../../services/api";

import OrdersHeader from "./OrdersHeader";
import OrdersFilters from "./OrdersFilters";
import OrdersSearch from "./OrdersSearch";
import OrdersTable from "./OrdersTable";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyOrders from "./EmptyOrders";

const CustomerOrders = () => {
  // ================ STATE ================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ================ FETCH ORDERS ================
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getCustomerOrders({
        status: filter === "all" ? "" : filter,
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================ ORDER ACTIONS ================
  const approveOrder = useCallback(async (id) => {
    try {
      await ordersAPI.approveOrder(id);
      toast.success("✅ Order approved!");
      fetchOrders();
    } catch (err) {
      toast.error("❌ Approval failed");
    }
  }, [fetchOrders]);

  const completeOrder = useCallback(async (id) => {
    try {
      await ordersAPI.completeOrder(id);
      toast.success("✅ Order completed!");
      fetchOrders();
    } catch (err) {
      toast.error("❌ Completion failed");
    }
  }, [fetchOrders]);

  const cancelOrder = useCallback(async (id, orderNumber) => {
    if (!window.confirm(`Cancel Order #${orderNumber}?`)) return;
    try {
      await ordersAPI.cancelOrder(id, "Customer cancelled");
      toast.success("🗑️ Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error("❌ Cancel failed");
    }
  }, [fetchOrders]);

  // ================ FILTERED ORDERS ================
  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    return orders.filter((order) =>
      order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  // ================ LOADING / EMPTY ================
  if (loading) return <LoadingSkeleton />;
  if (!orders.length && !loading) return <EmptyOrders />;

  return (
    <div className="min-h-screen bg-gray-800  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
       

        {/* CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <OrdersFilters filter={filter} setFilter={setFilter} orders={orders} />
          <OrdersSearch search={search} setSearch={setSearch} />
        </div>

        {/* SCROLLABLE TABLE */}
        <OrdersTable
          orders={filteredOrders}
          onApprove={approveOrder}
          onComplete={completeOrder}
          onCancel={cancelOrder}
        />
      </div>
    </div>
  );
};

export default CustomerOrders;