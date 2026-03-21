import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Burger + Cold Drink",
    subtitle: "Only ₹99",
    description: "Limited time combo offer. Grab it now!",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80",
    cta: "Order Now",
    badgeColor: "from-orange-400 to-orange-500",
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    subtitle: "On All Beverages",
    description: "Chill with your favorite drinks on us!",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80",
    cta: "Shop Drinks",
    badgeColor: "from-emerald-400 to-emerald-500",
  },
  {
    id: 3,
    title: "Free Delivery",
    subtitle: "Above ₹500",
    description: "Fast & hot delivery at your doorstep. No minimums!",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80",
    cta: "Order Now",
    badgeColor: "from-blue-400 to-blue-500",
  },
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-slide functionality
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % banners.length);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + banners.length) % banners.length);
  }, [currentIndex, goToSlide]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  }, [prevSlide, nextSlide]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] md:h-[360px] lg:h-[420px] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-orange-500/20 dark:shadow-orange-500/30 group/carousel transform-gpu will-change-transform"
      role="region"
      aria-label="Featured promotions carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* Slides Track */}
      <div
        className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${banners.length * 100}%`,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="relative w-full h-full flex-shrink-0 group/slide"
            aria-hidden={index !== currentIndex}
            aria-label={`${banner.title}, ${banner.subtitle}`}
          >
            {/* Optimized Background Image */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-110 group-hover/slide:scale-105 lg:group-hover/carousel:scale-[1.02] transition-transform duration-[1200ms] ease-out"
              style={{
                backgroundImage: `url(${banner.image})`,
              }}
            />
            
            {/* Multi-layer Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
            
            {/* Animated Shine Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-1000 overflow-hidden`}>
              <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform translateY(-2px) skew-x-12 animate-shimmer" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-y-0 left-0 w-[85%] lg:w-[75%] flex flex-col justify-center px-6 md:px-10 lg:px-14 py-8 text-white z-10">
              {/* Dynamic Badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-5 py-2.5 w-fit mb-6 shadow-2xl shadow-black/20 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105">
                <Sparkles size={16} className="drop-shadow-lg" />
                <span className="text-xs font-black uppercase tracking-widest drop-shadow-lg">
                  {banner.subtitle}
                </span>
              </div>
              
              {/* Dynamic Title */}
              <h1 
                className="text-3xl md:text-4xl lg:text-6xl font-black mb-4 lg:mb-6 leading-[0.9] tracking-[-0.02em] drop-shadow-2xl max-w-[90%]"
                style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}
              >
                {banner.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl font-semibold text-white/85 mb-8 max-w-md leading-relaxed drop-shadow-lg">
                {banner.description}
              </p>

              {/* Premium CTA Button */}
              <button 
                className="group/btn relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 active:from-orange-700 active:scale-[0.98] px-10 py-4 md:px-12 md:py-4.5 lg:px-14 lg:py-5 rounded-2xl font-black text-lg md:text-xl shadow-2xl shadow-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/60 transition-all duration-500 transform hover:-translate-y-1 w-fit backdrop-blur-sm border border-white/20"
                onClick={() => {/* Handle CTA */}}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {banner.cta}
                  <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
                {/* Shimmer Line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                {/* Top Border Glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </button>
            </div>

            {/* Corner Decorative Element */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-3xl text-white shadow-2xl shadow-black/30 hover:bg-white/25 hover:border-white/50 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-black/50 transition-all duration-300 active:scale-105 group/nav-prev z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="group-hover/nav-prev:-translate-x-1 transition-transform duration-300" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-3xl text-white shadow-2xl shadow-black/30 hover:bg-white/25 hover:border-white/50 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-black/50 transition-all duration-300 active:scale-105 group/nav-next z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="group-hover/nav-next:translate-x-1 transition-transform duration-300" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-black/20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-3 rounded-2xl transition-all duration-500 group/dot ${
              index === currentIndex
                ? 'w-20 bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg shadow-orange-500/50 scale-110'
                : 'w-3 bg-white/40 hover:bg-white/70 hover:w-6 hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'step' : undefined}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 text-sm font-bold text-white/90 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 shadow-xl">
        {currentIndex + 1} / {banners.length}
      </div>

      {/* Custom Animations */}
      <style >{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-2px) skewX(-12deg); }
          100% { transform: translateX(100%) translateY(-2px) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @media (max-width: 640px) {
          .h-\\$280px\\$ { height: 260px !important; }
        }
      `}</style>
    </div>
  );
}