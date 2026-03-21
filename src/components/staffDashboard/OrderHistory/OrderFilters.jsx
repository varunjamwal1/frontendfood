// components/OrderFilters.jsx
import React, { useState, useCallback } from "react";
import { Filter, ChevronUp, RotateCcw } from "lucide-react";
import FilterSelect from "./FilterSelect";

// ✅ Badge
const FilterBadge = React.memo(({ label }) => (
  <span className="px-3 py-1.5 bg-gray-700/50 text-gray-300 rounded-xl text-xs font-medium border border-gray-600/40">
    {label}
  </span>
));

// ✅ SAFE label formatter (FIXED ERROR HERE)
const formatLabel = (type, value) => {
  // 🔥 MAIN FIX → prevent undefined crash
  if (!value) return "All";

  if (type === "date") {
    return {
      today: "Today",
      week: "This Week",
      month: "This Month",
      all: "All Time",
    }[value] || "All Time";
  }

  if (type === "status") {
    return value === "all"
      ? "All Status"
      : value.charAt(0).toUpperCase() + value.slice(1);
  }

  if (type === "type") {
    return value === "all"
      ? "All Types"
      : value
          .replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return value;
};

const OrderFilters = React.memo(
  ({
    // ✅ DEFAULT VALUES (IMPORTANT FIX)
    dateRange = "today",
    statusFilter = "all",
    orderTypeFilter = "all",

    onDateRangeChange = () => {},
    onStatusChange = () => {},
    onTypeChange = () => {},
  }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggle = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const resetFilters = useCallback(() => {
      onDateRangeChange("today");
      onStatusChange("all");
      onTypeChange("all");
    }, [onDateRangeChange, onStatusChange, onTypeChange]);

    return (
      <section className="bg-gray-800/40 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-6 md:p-8">
        
        {/* HEADER */}
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between mb-6 p-5 bg-gray-900/50 rounded-2xl hover:bg-gray-800/60 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl border border-orange-500/30 group-hover:scale-105 transition-transform">
              <Filter className="w-6 h-6 text-orange-400" />
            </div>

            <div>
              <div className="text-lg md:text-xl font-bold text-white">
                Advanced Filters
              </div>

              {/* ACTIVE FILTERS */}
              <div className="flex flex-wrap gap-2 mt-2">
                <FilterBadge label={formatLabel("date", dateRange)} />
                <FilterBadge label={formatLabel("status", statusFilter)} />
                <FilterBadge label={formatLabel("type", orderTypeFilter)} />
              </div>
            </div>
          </div>

          <ChevronUp
            className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

        {/* CONTENT */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <FilterSelect
                label="Date Range"
                value={dateRange}
                onChange={onDateRangeChange}
                options={[
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "all", label: "All Time" },
                ]}
              />

              <FilterSelect
                label="Payment Status"
                value={statusFilter}
                onChange={onStatusChange}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "paid", label: "Paid" },
                  { value: "pending", label: "Pending" },
                  { value: "failed", label: "Failed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />

              <FilterSelect
                label="Order Type"
                value={orderTypeFilter}
                onChange={onTypeChange}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "dine-in", label: "Dine-in Only" },
                  { value: "takeaway", label: "Takeaway Only" },
                ]}
              />
            </div>

            {/* RESET BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl text-gray-300 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

OrderFilters.displayName = "OrderFilters";
export default OrderFilters;