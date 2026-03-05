import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartItems() {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {cart.map((item) => (
        <div
          key={item._id}
          className="flex justify-between bg-gray-700 p-3 rounded-lg items-center"
        >
          <div>
            <h4 className="text-sm">{item.name}</h4>
            <p className="text-xs text-gray-400">
              ₹{item.price} × {item.qty}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQuantity(item._id, Math.max(1, item.qty - 1))
              }
            >
              <Minus size={14} />
            </button>

            <span>{item.qty}</span>

            <button onClick={() => addToCart(item)}>
              <Plus size={14} />
            </button>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}