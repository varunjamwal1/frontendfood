import { memo } from "react";
import { Edit, Trash2, Percent } from "lucide-react";

function TaxCard({ tax = {}, onEdit, onDelete }) {
  const { _id, name = "Unnamed Tax", rate = 0 } = tax;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm flex flex-col">

      {/* Top Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
          <Percent className="text-orange-600 dark:text-orange-400" size={22} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {rate}%
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Actions */}
      <div className="flex gap-2 mt-5">
        <button
          type="button"
          onClick={() => onEdit?.(tax)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
        >
          <Edit size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(_id)}
          className="px-4 bg-red-600 text-white rounded-lg flex items-center justify-center"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default memo(TaxCard);