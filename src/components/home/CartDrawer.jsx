import { X, Plus, Minus, Trash2 } from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartTotals,
  updateQty,
  removeFromCart,
  onCheckout
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">🛒 Your Cart</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {cart.length === 0 && (
            <p className="text-center text-gray-500">
              Your cart is empty
            </p>
          )}

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQty(item._id, item.qty - 1)
                  }
                  className="p-1 border rounded"
                >
                  <Minus size={16} />
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() =>
                    updateQty(item._id, item.qty + 1)
                  }
                  className="p-1 border rounded"
                >
                  <Plus size={16} />
                </button>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{cartTotals.total}</span>
          </div>

          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            Checkout
          </button>

        </div>
      </div>
    </div>
  );
}