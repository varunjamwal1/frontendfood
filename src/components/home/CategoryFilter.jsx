import { useState, useRef, useEffect, useCallback } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function CategoryFilter({ 
  categories = [], 
  activeCat = "All", 
  setActiveCat, 
  typeFilter = "", 
  setTypeFilter 
}) {
  const scrollRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setIsScrolled(scrollLeft > 10);
      setShowScrollButtons(scrollLeft > 0 || scrollLeft < scrollWidth - clientWidth - 10);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    // setTimeout to ensure layout shift is caught
    setTimeout(handleScroll, 100); 

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [categories]);

  const handleCategoryClick = useCallback((cat) => {
    const catId = cat.name || cat._id || cat;
    setActiveCat(activeCat === catId ? "All" : catId);
  }, [activeCat, setActiveCat]);

  const handleTypeFilter = useCallback((type) => {
    setTypeFilter(typeFilter === type ? "" : type);
  }, [typeFilter, setTypeFilter]);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  const isActiveCategory = useCallback((cat) => {
    const catId = cat.name || cat._id || cat;
    return activeCat === catId;
  }, [activeCat]);

  const getCategoryClassName = (isActive) => {
    return isActive
      ? "bg-slate-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] ring-2 ring-slate-900/20"
      : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white hover:shadow-md border border-slate-200/50 dark:border-white/10";
  };

  const getTypeClassName = (activeType) => {
    return activeType
      ? "bg-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
      : "text-slate-500 hover:text-slate-800 hover:bg-white/60 dark:hover:bg-slate-700/60";
  };

  const getTypeIndicatorClassName = (activeType) => {
    return activeType ? "bg-white shadow-sm" : "bg-emerald-500";
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full relative z-30">
      
      {/* Scroll Navigation Overlay Buttons */}
      {showScrollButtons && (
        <div className="hidden lg:flex gap-1 absolute -left-4 -right-4 top-1/2 -translate-y-1/2 pointer-events-none z-40 justify-between">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-all duration-300 pointer-events-auto active:scale-95 border border-white/50"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-all duration-300 pointer-events-auto active:scale-95 border border-white/50"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Main Categories Scroller */}
      <div className="relative w-full lg:w-auto flex-1 overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-6 pt-2 px-4 scrollbar-hide snap-x snap-mandatory"
        >
          {/* All Button */}
          <button
            onClick={() => setActiveCat("All")}
            className={`group relative px-6 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all duration-300 flex items-center gap-2 flex-shrink-0 active:scale-95 ${getCategoryClassName(activeCat === "All")}`}
            aria-pressed={activeCat === "All"}
          >
            {activeCat === "All" && (
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            )}
            All Menu
          </button>

          {/* Dynamic Category Pills */}
          {categories.map((cat) => {
            const isActive = isActiveCategory(cat);
            const catId = cat.name || cat._id || cat;
            return (
              <button
                key={catId}
                onClick={() => handleCategoryClick(cat)}
                className={`group relative px-6 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all duration-300 flex items-center gap-2 flex-shrink-0 active:scale-95 ${getCategoryClassName(isActive)}`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                )}
                {cat.name || cat._id || cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Premium Dietary Segmented Control */}
      <div className="flex bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-full shadow-inner backdrop-blur-xl border border-slate-200/50 dark:border-white/10 flex-shrink-0 w-full sm:w-auto mt-[-10px] lg:mt-0">
        
        {/* Reset Filter Button (Shown if either is active) */}
        {typeFilter !== "" && (
          <button
            onClick={() => handleTypeFilter(typeFilter)}
            className="w-10 bg-slate-100 dark:bg-slate-700 flex items-center justify-center rounded-full mr-2 hover:bg-slate-200 transition-colors shadow-sm text-slate-500 hover:text-slate-700"
            aria-label="Clear dietary filters"
          >
            <X size={16} strokeWidth={3} />
          </button>
        )}

        <button
          onClick={() => handleTypeFilter("veg")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 ${getTypeClassName(typeFilter === "veg")}`}
          aria-pressed={typeFilter === "veg"}
        >
          <span className={`w-2 h-2 rounded-full ${getTypeIndicatorClassName(typeFilter === "veg")}`}></span>
          Veg
        </button>
        
        <button
          onClick={() => handleTypeFilter("non-veg")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 ${getTypeClassName(typeFilter === "non-veg")}`}
          aria-pressed={typeFilter === "non-veg"}
        >
          <span className={`w-2 h-2 rounded-full ${getTypeIndicatorClassName(typeFilter === "non-veg")}`}></span>
          Non-Veg
        </button>
      </div>
    </div>
  );
}