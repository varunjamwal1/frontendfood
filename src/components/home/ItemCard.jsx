import { Plus } from "lucide-react";

export default function ItemCard({ item, onAdd }) {
  const catLabel = item.category?.name || "Signature";

  return (
    <div className="group cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden relative">
      
      {/* Dynamic Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>

      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 bg-slate-50 dark:bg-slate-800 shadow-inner group-hover:shadow-[inset_0_-10px_30px_rgba(0,0,0,0.05)] transition-shadow duration-500 z-10">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
            <span className="material-symbols-outlined text-4xl opacity-50 mb-2">image</span>
          </div>
        )}

        {/* Dietary Indicator */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {item.type === "veg" && (
            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center gap-1.5 border border-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Veg</span>
            </div>
          )}
          {item.type === "non-veg" && (
            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center gap-1.5 border border-white/50">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Non-Veg</span>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item);
            }}
            className="w-12 h-12 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-900 dark:text-white transition-all duration-300 active:scale-95 group/addbtn border border-white/50 hover:border-transparent"
            aria-label="Add to cart"
          >
            <Plus size={20} strokeWidth={2.5} className="group-hover/addbtn:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2 pb-2 z-10">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1">
            <span className="inline-block text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-2 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
              {catLabel}
            </span>
            <h3 className="font-extrabold text-[1.15rem] text-slate-900 dark:text-white leading-tight tracking-tight line-clamp-2">
              {item.name}
            </h3>
          </div>
          <span className="font-black text-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm shrink-0">
            ₹{item.price?.toFixed(2) || '0.00'}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium mt-auto group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          {item.description || "A masterfully crafted item blending rich flavors and premium ingredients."}
        </p>
      </div>

    </div>
  );
}