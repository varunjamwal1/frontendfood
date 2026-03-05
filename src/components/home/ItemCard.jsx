import { Plus } from "lucide-react";

export default function ItemCard({ item, onAdd }) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm flex gap-4 items-center hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Img
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800">{item.name}</h3>
          <span className="font-bold text-orange-600">₹{item.price}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {item.description || "Delicious item"}
        </p>
        
        <button
          onClick={() => onAdd(item)}
          className="mt-2 w-full bg-orange-50 text-orange-600 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>
    </div>
  );
}