import { Edit, Trash2, Users, Maximize2 } from "lucide-react";
import React from "react";

const TableCard = ({ 
  table, 
  onEdit, 
  onDelete, 
  onBook,
  className = "" 
}) => {
  const isAvailable = table.status === "available";
  const isOccupied = table.status === "occupied";
  const isReserved = table.status === "reserved";

  // Status configuration
  const statusConfig = {
    available: {
      color: "bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
      label: "Available"
    },
    occupied: {
      color: "bg-rose-500",
      badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
      label: "Occupied"
    },
    reserved: {
      color: "bg-amber-500",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
      label: "Reserved"
    }
  };

  const currentStatus = statusConfig[table.status] || statusConfig.available;

  return (
    <div
      className={`
        group
        w-full
        bg-white dark:bg-slate-800
        rounded-2xl
        border border-gray-200 dark:border-slate-700
        shadow-sm
        hover:shadow-xl
        hover:border-indigo-300 dark:hover:border-indigo-600
        transition-all duration-300
        overflow-hidden
        ${className}
      `}
      role="article"
      aria-label={`Table ${table.tableNumber} - ${currentStatus.label}`}
    >
      {/* Status Top Bar */}
      <div
        className={`h-1.5 w-full ${currentStatus.color}`}
        aria-hidden="true"
      />

      <div className="flex flex-col flex-1 p-5">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              Table {table.tableNumber}
            </h3>
            
            <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
              <Users size={16} className="flex-shrink-0" />
              <span className="text-sm">
                Capacity:
                <span className="ml-1 font-semibold text-gray-700 dark:text-gray-200">
                  {table.seats}
                </span>
              </span>
            </div>
          </div>

          {/* Status Badge */}
          
        </div>

        {/* Additional Info (Optional) */}
        {table.location && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Location: {table.location}
            </p>
          </div>
        )}

        {/* Push buttons to bottom */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          {/* Book Button */}
          {onBook && (
            <button
              onClick={() => onBook(table)}
              disabled={!isAvailable}
              className={`
                flex-1 flex items-center justify-center gap-2
                py-2.5
                 
                rounded-xl
                text-sm font-medium
                transition-all duration-200
                shadow-sm
                ${
                  isAvailable
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-md"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }
              `}
              aria-label={`Book Table ${table.tableNumber}`}
            >
              <Maximize2 size={16} />
              <span className="hidden sm:inline">Book</span>
            </button>
          )}

          {/* Edit Button */}
          <button
            onClick={() => onEdit(table)}
            className="
              flex items-center justify-center gap-2
              bg-indigo-50 dark:bg-indigo-900/30
              hover:bg-indigo-100 dark:hover:bg-indigo-900/50
              text-indigo-600 dark:text-indigo-400
              py-2.5
               px-2.5
              rounded-xl
              text-sm font-medium
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
            aria-label={`Edit Table ${table.tableNumber}`}
          >
            <Edit size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(table._id)}
            className="
              w-11 flex items-center justify-center
              bg-rose-50 dark:bg-rose-900/30
              hover:bg-rose-100 dark:hover:bg-rose-900/50
              text-rose-600 dark:text-rose-400
              rounded-xl
               px-2.5
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
            aria-label={`Delete Table ${table.tableNumber}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableCard;