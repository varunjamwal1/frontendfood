// hooks/useOrderHistory.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { ordersAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import { getStatusConfig } from "../utils/statusConfig";

export const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const tableRef = useRef(null);

  // Fetch orders
  const fetchOrders = useCallback(async (showToast = true) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ordersAPI.getAll();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid orders data received");
      }

      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
      setPage(1);
      
      if (showToast) {
        toast.success("Orders updated successfully");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError(error.message || "Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const itemsPerPage = 10;
  
  // Filtered & paginated orders
  const filteredOrders = useMemo(() => {
    // Apply date filter, search, status, and type filters here
    // Implementation from original filteredOrders logic
    return orders.filter(order => {
      const matchesSearch = 
        (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.phone || '').includes(searchTerm) ||
        (order._id || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [orders, searchTerm]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, page]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Metrics
  const metrics = useMemo(() => {
    const paidOrders = filteredOrders.filter(o => o.paymentStatus === "paid");
    const cashOrders = paidOrders.filter(o => o.paymentMethod === "cash");

    return {
      totalRevenue: paidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
      cashRevenue: cashOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
      totalOrders: filteredOrders.length,
      paidOrders: paidOrders.length,
      pendingOrders: filteredOrders.filter(o => o.paymentStatus === "pending").length,
      uniqueCustomers: new Set(filteredOrders.map(o => o.phone || o.customerName)).size,
      avgOrderValue: paidOrders.length > 0 
        ? (paidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) / paidOrders.length).toFixed(2)
        : "0.00"
    };
  }, [filteredOrders]);

  // Formatters
  const formatCurrency = useCallback((amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }, []);

  const formatDate = useCallback((dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN');
    } catch {
      return 'Invalid Date';
    }
  }, []);

  const formatTime = useCallback((dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Invalid Time';
    }
  }, []);

  // Actions
  const handlePrintOrder = useCallback((order) => {
    // Print implementation from original
  }, [formatDate]);

  const exportCSV = useCallback(() => {
    // CSV export implementation from original
  }, [filteredOrders, formatDate]);

  const goToPage = useCallback((pageNum) => {
    setPage(Math.max(1, Math.min(pageNum, totalPages)));
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [totalPages]);

  return {
    orders,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    filteredOrders,
    paginatedOrders,
    totalPages,
    itemsPerPage,
    metrics,
    formatCurrency,
    formatDate,
    formatTime,
    handlePrintOrder,
    exportCSV,
    fetchOrders,
    goToPage,
    tableRef
  };
};