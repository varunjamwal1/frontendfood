export default function CategoryFilter({
  categories,
  activeCat,
  setActiveCat,
  typeFilter,
  setTypeFilter,
}) {
  return (
    <div className="mb-6">

      {/* ================= CATEGORIES ================= */}
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        
        {/* All Button */}
        <button
          onClick={() => setActiveCat("All")}
          className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300
            ${
              activeCat === "All"
                ? "bg-orange-600 text-white shadow-md scale-105"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
        >
          All
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCat(cat._id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300
              ${
                activeCat === cat._id
                  ? "bg-orange-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ================= TYPE FILTER ================= */}
      <div className="flex gap-3 mt-3">

        {/* All Type */}
        <button
          onClick={() => setTypeFilter("")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300
            ${
              typeFilter === ""
                ? "border-orange-600 text-orange-600 bg-orange-50 shadow-sm"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
        >
          All Items
        </button>

        {/* VEG BUTTON */}
        <button
          onClick={() => setTypeFilter("veg")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300
            ${
              typeFilter === "veg"
                ? "border-green-600 text-green-600 bg-green-50 shadow-sm"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
        >
          {/* Official Veg Symbol */}
          <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
          Veg
        </button>

        {/* NON VEG BUTTON */}
        <button
          onClick={() => setTypeFilter("non-veg")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300
            ${
              typeFilter === "non-veg"
                ? "border-red-600 text-red-600 bg-red-50 shadow-sm"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
        >
          {/* Official Non-Veg Symbol */}
          <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          </div>
          Non-Veg
        </button>
      </div>
    </div>
  );
}