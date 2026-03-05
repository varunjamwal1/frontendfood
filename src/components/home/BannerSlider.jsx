import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Burger + Cold Drink",
    subtitle: "Only ₹99",
    description: "Limited time combo offer. Grab it now!",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200",
    gradient: "from-black/70 via-black/40 to-transparent",
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    subtitle: "On All Beverages",
    description: "Chill with your favorite drinks.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
    gradient: "from-black/70 via-black/40 to-transparent",
  },
  {
    id: 3,
    title: "Free Delivery",
    subtitle: "Above ₹500",
    description: "Fast & hot delivery at your doorstep.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200",
    gradient: "from-black/70 via-black/40 to-transparent",
  },
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  /* ===============================
      AUTO SLIDE
  =============================== */

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  /* ===============================
      NAVIGATION
  =============================== */

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + banners.length) % banners.length
    );
  };

  /* ===============================
      UI
  =============================== */

  return (
    <div
      className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden mb-6 shadow-lg group"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${banners.length * 100}%`,
        }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative w-full h-full flex-shrink-0"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-1 drop-shadow-lg">
                {banner.title}
              </h2>

              <p className="text-lg md:text-2xl font-semibold text-yellow-300 mb-2">
                {banner.subtitle}
              </p>

              <p className="text-sm md:text-base opacity-90 mb-4 max-w-xs">
                {banner.description}
              </p>

              <button className="bg-orange-600 hover:bg-orange-700 transition px-5 py-2 rounded-full font-semibold w-fit shadow-md">
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}