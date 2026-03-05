import { memo } from "react";
import { Edit, Trash2, Star, Image } from "lucide-react";

function ItemCard({ item = {}, onEdit, onDelete }) {
  const {
    _id,
    name = "Unnamed Item",
    image,
    price = 0,
    description,
    type,
    isPopular,
    category,
  } = item;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">

      {/* Image Section */}
      <div className="h-40 bg-gray-100 dark:bg-slate-700 relative flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image className="text-gray-400" size={36} />
        )}

        {/* Type Badge */}
        {type && (
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded text-white ${
              type === "veg" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {type.toUpperCase()}
          </span>
        )}

        {/* Popular Badge */}
        {isPopular && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded flex items-center gap-1">
            <Star size={12} fill="white" />
            Popular
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">

        {/* Title + Price */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
              {name}
            </h3>

            {/* Fixed Height Category */}
            <p className="text-sm text-gray-500 dark:text-gray-400 h-5 truncate">
              Category: {category?.name || "Uncategorized"}
            </p>
          </div>

          <span className="text-lg font-semibold text-orange-600 whitespace-nowrap">
            ₹{price}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2 min-h-[40px]">
          {description || "No description provided."}
        </p>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => onEdit?.(item)}
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
    </div>
  );
}

export default memo(ItemCard);