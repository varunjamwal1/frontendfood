import React from "react";
import OrderTypeSelector from "./OrderTypeSelector";
import CartItems from "./CartItems";

export default function CartPanel({
  orderType,
  setOrderType,
  tables,
  selectedTable,
  setSelectedTable,
  total,
  placingOrder,
  cart,
  openCustomerModal,
}) {
  const GST_RATE = 0.05; // 5% GST (change if needed)

  const gstAmount = total * GST_RATE;
  const grandTotal = total + gstAmount;

  const isDisabled =
    placingOrder ||
    cart.length === 0 ||
    (orderType === "dine-in" && !selectedTable);

  return (
    <div className="w-1/3 bg-gray-800 flex flex-col h-full">

      <OrderTypeSelector
        orderType={orderType}
        setOrderType={setOrderType}
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />

      <CartItems />

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        
        {/* Subtotal */}
        <div className="flex justify-between text-gray-300 mb-2">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        {/* GST */}
        <div className="flex justify-between text-gray-300 mb-2">
          <span>GST (5%)</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between text-lg font-bold text-orange-500 mb-4 border-t border-gray-700 pt-2">
          <span>Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>

        <button
          onClick={openCustomerModal}
          disabled={isDisabled}
          className={`w-full py-3 rounded-lg font-bold transition ${
            isDisabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}