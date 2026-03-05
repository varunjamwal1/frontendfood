import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ItemCard from "./ItemCard";

export default function PopularSlider({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const popularItems = items.filter((item) => item.popular).slice(0, 5);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % popularItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + popularItems.length) % popularItems.length);
  };

  if (popularItems.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Star className="text-yellow-500" size={20} />
          Popular Items
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {popularItems.map((item, index) => (
            <div
              key={item._id}
              className={`flex-shrink-0 w-64 transition-all duration-300 ${
                index === currentIndex ? "opacity-100 scale-100" : "opacity-50 scale-95"
              }`}
            >
              <ItemCard item={item} onAdd={() => {}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}