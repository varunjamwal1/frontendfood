import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Clock, Sparkles } from "lucide-react";
import ItemCard from "./ItemCard";

export default function PopularSlider({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  const popularItems = items.filter((item) => item.popular).slice(0, 10);

  // Auto-play with pause on hover
  useEffect(() => {
    if (popularItems.length === 0 || isHovered) return;

    const play = () => {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 5000);
    };

    play();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, popularItems.length, isHovered]);

  const nextSlide = useCallback(() => {
    if (isTransitioning || popularItems.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % popularItems.length);
    
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, popularItems.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || popularItems.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + popularItems.length) % popularItems.length);
    
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, popularItems.length]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || popularItems.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index % popularItems.length);
    
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, popularItems.length]);

  if (popularItems.length === 0) return null;

  const getItemTransform = (index) => {
    const diff = Math.min(Math.abs(index - currentIndex), popularItems.length - Math.abs(index - currentIndex));
    const scale = Math.max(0.88, 1 - (diff * 0.12));
    const opacity = Math.max(0.4, 1 - (diff * 0.4));
    
    return {
      scale,
      opacity,
      zIndex: 50 - diff * 2,
      brightness: 1 - (diff * 0.08),
      shadow: diff === 0 
        ? 'drop-shadow(0 35px 60px rgba(0,0,0,0.25)) drop-shadow(0 0 25px rgba(255,165,0,0.3)) brightness(1.08)' 
        : `drop-shadow(0 15px 30px rgba(0,0,0,0.15)) brightness(${1 - diff * 0.08})`
    };
  };

  const progress = ((currentIndex + 1) / popularItems.length) * 100;

  return (
    <section className="w-full py-20 lg:py-28 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-900/30 dark:via-slate-900/10 dark:to-slate-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Premium Header */}
        <div className="text-center mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-6 py-3 rounded-3xl backdrop-blur-xl border border-orange-200/50 mb-8 shadow-xl">
            <div className="relative p-3 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl shadow-2xl ring-4 ring-white/60 dark:ring-slate-900/60">
              <Star size={24} fill="#fff" className="drop-shadow-2xl" strokeWidth={1} />
              <Sparkles size={16} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-slate-900 via-orange-600/90 to-slate-900 bg-clip-text text-transparent tracking-tight leading-tight">
                Trending Now
              </h2>
              <p className="text-lg lg:text-xl font-semibold text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
                {popularItems.length} crowd favorites • Updated live this week
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 lg:left-8 lg:right-8 z-40 flex justify-between pointer-events-none">
          <button
            onClick={prevSlide}
            className="group relative w-16 h-16 lg:w-20 lg:h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25 border-2 border-slate-200/60 dark:border-slate-800/60 hover:border-orange-400/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-all duration-500 hover:scale-110 active:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:ring-offset-2 focus:ring-offset-transparent pointer-events-auto"
            aria-label="Previous popular item"
            disabled={isTransitioning}
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-2 transition-all duration-300 stroke-[3px]" strokeWidth={2.5} />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-orange-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
          </button>

          <button
            onClick={nextSlide}
            className="group relative w-16 h-16 lg:w-20 lg:h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25 border-2 border-slate-200/60 dark:border-slate-800/60 hover:border-orange-400/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-all duration-500 hover:scale-110 active:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:ring-offset-2 focus:ring-offset-transparent pointer-events-auto"
            aria-label="Next popular item"
            disabled={isTransitioning}
          >
            <ChevronRight size={24} className="group-hover:translate-x-2 transition-all duration-300 stroke-[3px]" strokeWidth={2.5} />
            <div className="absolute inset-0 bg-gradient-to-l from-orange-400/30 to-orange-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
          </button>
        </div>

        {/* Main Slider Container */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white/80 via-slate-50/90 to-orange-50/60 dark:from-slate-900/80 dark:via-slate-800/90 dark:to-orange-900/20 backdrop-blur-xl shadow-3xl border border-white/40 dark:border-slate-800/40 -mx-4 sm:-mx-6 lg:mx-0 px-6 sm:px-8 pb-16 pt-12 lg:pb-20 lg:pt-16"
          role="region"
          aria-label="Popular items carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Progress Bar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-64 h-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full shadow-xl overflow-hidden z-30">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-lg rounded-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] animate-pulse"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Slide Counter */}
          <div className="absolute top-6 right-6 text-sm font-black text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900/95 px-4 py-2 rounded-2xl backdrop-blur-xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60 z-30">
            {currentIndex + 1} • {popularItems.length}
          </div>

          {/* Dots Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl px-8 py-4 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60">
            {popularItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative w-4 h-4 rounded-full transition-all duration-500 group focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
                  index === currentIndex
                    ? "w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl scale-125 ring-2 ring-orange-400/50" 
                    : "bg-slate-300/80 dark:bg-slate-600/80 hover:bg-orange-400 hover:w-5 hover:h-5 hover:scale-110 shadow-md"
                }`}
                aria-label={`Go to item ${index + 1} of ${popularItems.length}`}
                aria-current={index === currentIndex ? "step" : undefined}
              />
            ))}
          </div>

          {/* Items Track */}
          <div 
            className={`flex gap-8 transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.320,1)] will-change-transform snap-x snap-mandatory ${
              isTransitioning ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
            }`}
            style={{
              transform: `translateX(calc(-${currentIndex * (100 / popularItems.length)}% - ${(currentIndex * 32) / popularItems.length}rem))`
            }}
          >
            {popularItems.map((item, index) => {
              const transform = getItemTransform(index);
              
              return (
                <div
                  key={item._id || item.name || index}
                  className="flex-none w-[85vw] max-w-[380px] h-[480px] mx-auto snap-center"
                  style={{
                    opacity: transform.opacity,
                    zIndex: transform.zIndex,
                  }}
                >
                  <div 
                    className="relative h-full transition-all duration-1000 perspective-1000"
                    style={{ filter: transform.shadow }}
                  >
                    <ItemCard 
                      item={item} 
                      className="h-full transform-gpu hover:scale-105 hover:-translate-y-4 transition-all duration-700 ease-out hover:shadow-3xl hover:shadow-orange-500/25"
                      onAdd={() => goToSlide((currentIndex + 1) % popularItems.length)}
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/30 via-transparent to-transparent rounded-[2.5rem] backdrop-blur-sm animate-[pulse_3s_infinite]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto-play Status */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-6 py-3 rounded-2xl backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
            ✨ Auto-playing • Pause on hover
          </div>
        </div>
      </div>
    </section>
  );
}