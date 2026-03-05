import { memo, useCallback } from "react";
import { Edit, Trash2, Users } from "lucide-react";

function TableCard({ table = {}, onEdit, onDelete }) {
  const { _id, tableNumber = "N/A", capacity = 0 } = table;

  const handleEdit = useCallback(() => {
    onEdit?.(table);
  }, [onEdit, table]);

  const handleDelete = useCallback(() => {
    if (_id) onDelete?.(_id);
  }, [_id, onDelete]);

  return (
    <div
      className="
        group
        bg-white dark:bg-slate-800
        rounded-2xl
        shadow-sm hover:shadow-lg
        transition-all duration-300
        p-6
        border border-gray-200 dark:border-slate-700
        flex flex-col justify-between
        hover:-translate-y-1
      "
    >
      {/* Top Section */}
      <div>
        {/* Table Number Badge */}
        <div className="flex justify-center mb-4">
          <div
            className="
              h-16 w-16
              flex items-center justify-center
              rounded-full
              bg-orange-500
              text-white
              text-xl font-bold
              shadow-md
              group-hover:scale-105
              transition
            "
          >
            {tableNumber}
          </div>
        </div>

        {/* Seats Info */}
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
          <Users size={18} />
          <span className="text-base font-medium">
            {capacity} {capacity === 1 ? "Seat" : "Seats"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {/* Edit Button */}
        <button
          type="button"
          onClick={handleEdit}
          aria-label="Edit Table"
          className="
            flex-1
            flex items-center justify-center gap-2
            bg-blue-500 hover:bg-blue-600
            text-white
            py-2.5
            rounded-xl
            font-medium
            transition-all duration-200
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        >
          <Edit size={16} />
          Edit
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete Table"
          className="
            flex items-center justify-center
            px-4
            bg-red-500 hover:bg-red-600
            text-white
            rounded-xl
            transition-all duration-200
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-red-400
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default memo(TableCard);