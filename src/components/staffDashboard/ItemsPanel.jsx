import React from "react";
import { Loader2 } from "lucide-react";
import ItemCard from "../staffDashboard/ItemCardd";
import { useCart } from "../../context/CartContext";

export default function ItemsPanel({ items, loading }) {
  const { addToCart } = useCart();

  return (
    <div className="w-2/3 p-4 overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}