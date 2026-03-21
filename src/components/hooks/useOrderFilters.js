// hooks/useOrderFilters.js
import { useState, useMemo } from "react";

export const useOrderFilters = () => {
  const [dateRange, setDateRange] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const dateFilteredOrders = useMemo(() => {
    // Date filtering logic from original
  }, [orders, dateRange]);

  return {
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    orderTypeFilter,
    setOrderTypeFilter,
    isFiltersOpen,
    setIsFiltersOpen,
    dateFilteredOrders
  };
};