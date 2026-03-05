import React from "react";
import { Table, X, AlertCircle } from "lucide-react";

export default function OrderTypeSelector({
  orderType,
  setOrderType,
  tables = [],
  selectedTable,
  setSelectedTable,
  loadingTables = false,
}) {
  // Normalize selectedTable to ID string for the select value
  const selectedTableId =
    typeof selectedTable === "object" && selectedTable?._id
      ? selectedTable._id
      : selectedTable;

  const availableTables = tables.filter(
    (t) => t.status === "available" || !t.status
  );

  const handleTableChange = (e) => {
    const value = e.target.value;
    // If value is empty, pass null, otherwise pass the ID string
    setSelectedTable(value ? value : null);
  };

  const clearTableSelection = () => {
    setSelectedTable(null);
  };

  return (
    <div className="p-4 border-b border-gray-700 space-y-4 bg-gray-800/50">
      {/* Inline styles to force white text on options (browser limitation fix) */}
      <style>{`
        select option {
          color: white;
          background-color: #1f2937; /* gray-800 */
        }
        select:focus {
          outline: none;
          border-color: #f97316; /* orange-500 */
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
        }
      `}</style>

      {/* ORDER TYPE BUTTONS */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOrderType("dine-in")}
          disabled={availableTables.length === 0}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            orderType === "dine-in"
              ? "bg-orange-500 text-white shadow-lg "
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          } ${availableTables.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Table size={18} />
          Dine In
        </button>

        <button
          type="button"
          onClick={() => {
            setOrderType("takeaway");
            setSelectedTable(null);
          }}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            orderType === "takeaway"
              ? "bg-orange-500 text-white shadow-lg "
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          }`}
        >
          Takeaway
        </button>
      </div>

      {/* TABLE DROPDOWN */}
      {orderType === "dine-in" && (
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Select Table
          </label>

          {loadingTables ? (
            <div className="flex items-center gap-2 text-white text-sm bg-gray-700/50 p-2 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Loading tables...
            </div>
          ) : availableTables.length === 0 ? (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-2 rounded-lg border border-red-900/50">
              <AlertCircle size={16} />
              No tables available
            </div>
          ) : (
            <div className="relative text-white">
              <select
                value={selectedTableId || ""}
                onChange={handleTableChange}
                className="w-full p-3 pr-10 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-orange-500 outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value="">-- Select Table --</option>
                {availableTables.map((table) => (
                  <option key={table._id} value={table._id}>
                    {table.tableNumber}
                    {table.seats ? ` • ${table.seats} Seats` : ""}
                  </option>
                ))}
              </select>
              
              {/* Custom Arrow Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {/* Clear Selection Button (only if table selected) */}
              {selectedTableId && (
                <button
                  onClick={clearTableSelection}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                  title="Clear selection"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}