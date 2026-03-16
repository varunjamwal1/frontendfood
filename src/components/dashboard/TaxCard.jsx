import { memo } from "react";
import { Edit, Trash2, Percent } from "lucide-react";

function TaxCard({ tax = {}, onEdit, onDelete }) {
  // ✅ FIXED: Handle both 'rate' and 'percentage'
  const { 
    _id, 
    name = "Unnamed Tax", 
    rate = 0,
    percentage = 0,  // Fallback for percentage
    description = "" 
  } = tax;
  
  // Use rate first, then percentage
  const taxRate = rate || percentage;

  return (
    <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                    backdrop-blur-xl border border-white/10 rounded-2xl p-6 
                    hover:shadow-2xl hover:shadow-orange-500/10 
                    hover:border-orange-400/50 transition-all duration-300 hover:scale-[1.02]">
      
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/20 
                        border border-orange-500/30 rounded-2xl flex items-center justify-center 
                        backdrop-blur-sm flex-shrink-0">
          <Percent className="text-orange-400" size={24} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 
                         bg-clip-text text-transparent truncate mb-1">
            {name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-orange-400 drop-shadow-lg">
              {taxRate}%
            </span>
            {description && (
              <span className="text-sm text-gray-400 font-medium">({description})</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions - Slide up on hover */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 
                      translate-y-2 group-hover:translate-y-0 transition-all duration-200">
        <button
          type="button"
          onClick={() => onEdit?.(tax)}
          className="flex-1 flex items-center justify-center gap-2 
                     bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                     text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-lg 
                     hover:shadow-xl transition-all backdrop-blur-sm border border-blue-500/30"
          title="Edit Tax"
        >
          <Edit size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(_id)}
          className="w-11 h-11 bg-gradient-to-r from-red-500/20 to-red-600/20 
                     hover:from-red-500/30 hover:to-red-600/30 text-red-400 
                     border border-red-500/30 hover:border-red-500/50 
                     rounded-xl flex items-center justify-center hover:shadow-xl 
                     transition-all backdrop-blur-sm"
          title="Delete Tax"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default memo(TaxCard);