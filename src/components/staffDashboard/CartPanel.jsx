
import React from "react";
import OrderTypeSelector from "./OrderTypeSelector";
import CartItems from "./CartItems";

export default function CartPanel({
  orderType,
  setOrderType,
  tables,
  selectedTable,
  setSelectedTable,
  total = 0,
  placingOrder = false,
  cart = [],
  openCustomerModal,
}) {

  const isDisabled =
    placingOrder ||
    cart.length === 0 ||
    (orderType === "dine-in" && !selectedTable);

  return (
    <div className="bg-gray-800 flex flex-col h-full">

      {/* Order Type + Table Selector */}
      <OrderTypeSelector
        orderType={orderType}
        setOrderType={setOrderType}
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />

      {/* Cart Items */}
      <CartItems cart={cart} />

      {/* Billing Section */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">

        {/* Total */}
        <div className="flex justify-between text-lg font-bold text-orange-500 mb-4">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        {/* Place Order Button */}
        <button
          onClick={openCustomerModal}
          disabled={isDisabled}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200
          ${
            isDisabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:scale-95"
          }`}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>

      </div>
    </div>
  );
}