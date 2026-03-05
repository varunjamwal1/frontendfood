import { memo, useCallback } from "react";
import { Plus, Star } from "lucide-react";

function ItemCard({ item = {}, onAdd }) {
  const {
    name = "Unnamed Item",
    description = "Delicious item from our kitchen.",
    price = 0,
    type,
    isPopular = false,
  } = item;

  // Currency Formatter (Indian Format)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleAdd = useCallback(
    (e) => {
      e?.stopPropagation();
      onAdd?.(item);
    },
    [onAdd, item]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleAdd}
      onKeyDown={(e) => e.key === "Enter" && handleAdd(e)}
      className="
        group
        bg-white dark:bg-slate-800
        border border-gray-200 dark:border-slate-700
        rounded-2xl
        p-4
        shadow-sm
        hover:shadow-md
        transition-all duration-200
        cursor-pointer
        flex flex-col justify-between
        active:scale-[0.98]
      "
    >
      {/* Top Section */}
      <div className="flex justify-between items-start gap-3">

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">

            {/* Name */}
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
              {name}
            </h3>

            {/* Veg / Non-Veg Indicator (Clean FSSAI Style) */}
            {type && (
              <span
                className={`w-4 h-4 flex items-center justify-center border rounded-sm ${
                  type === "veg"
                    ? "border-green-600"
                    : "border-red-600"
                }`}
                title={type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
              >
                <span
                  className={`w-2 h-2 rounded-sm ${
                    type === "veg"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                />
              </span>
            )}

            {/* Popular Badge */}
            {isPopular && (
              <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <Star size={12} fill="white" />
                Popular
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 min-h-[40px]">
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(price)}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleAdd}
          className="
            w-full
            bg-orange-600
            hover:bg-orange-700
            text-white
            py-2
            rounded-xl
            text-sm
            font-semibold
            flex items-center justify-center gap-2
            transition-all duration-200
            active:scale-[0.97]
            focus:outline-none focus:ring-2 focus:ring-orange-400
          "
        >
          <Plus size={16} />
          Add to Order
        </button>
      </div>
    </div>
  );
}

export default memo(ItemCard);