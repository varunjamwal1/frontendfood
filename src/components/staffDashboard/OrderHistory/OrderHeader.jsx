// components/OrderHeader.jsx
import React from "react";
import { Search, RefreshCw, Download } from "lucide-react";

const OrderHeader = React.memo(({
  filteredOrders,
  formatCurrency,
  metrics,
  searchTerm,
  onSearchChange,
  onRefresh,
  loading,
  onExport
}) => (
  <header className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 px-6 lg:px-8 py-6 shadow-2xl">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
       
        </h1>
        <div className="text-gray-400 text-lg font-medium">
          {filteredOrders.length} orders • {formatCurrency(metrics.totalRevenue)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-[550px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            className="w-full pl-12 pr-4 py-4 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500/50 rounded-3xl text-white placeholder-gray-500 font-medium transition-all duration-200 shadow-lg"
            placeholder="Search by customer, phone, or order ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-4 bg-gray-800/60 hover:bg-gray-700/80 disabled:bg-gray-900/50 disabled:cursor-not-allowed border border-gray-700/50 hover:border-gray-600 rounded-3xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl font-medium h-16 sm:h-auto sm:w-auto"
          >
            <RefreshCw className={`${loading ? "animate-spin" : "hover:rotate-180"} transition-transform duration-300 w-5 h-5`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onExport}
            className="px-8 py-4 h-16 sm:h-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 border border-emerald-500/30"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  </header>
));

OrderHeader.displayName = "OrderHeader";
export default OrderHeader;