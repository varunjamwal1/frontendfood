import React, { useState } from "react";
import { X, CreditCard, Wallet } from "lucide-react";

const PaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  orderData,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Simulate payment delay
      setTimeout(() => {
        onPaymentSuccess(method);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl p-6 animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Payment</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-semibold">{orderData?.customerName || "-"}</p>

          {orderData?.table && (
            <>
              <p className="text-sm text-gray-500 mt-2">Table</p>
              <p className="font-semibold">#{orderData.table}</p>
            </>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Total Amount</p>
          <p className="text-xl font-bold text-orange-600">
            ₹{totalAmount?.toFixed(2)}
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">

          {/* Cash */}
          <button
            onClick={() => setMethod("cash")}
            className={`w-full flex items-center gap-3 p-4 border rounded-xl transition ${
              method === "cash"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <Wallet size={20} />
            <span className="font-medium">Cash on Counter</span>
          </button>

          {/* Online */}
          <button
            onClick={() => setMethod("online")}
            className={`w-full flex items-center gap-3 p-4 border rounded-xl transition ${
              method === "online"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <CreditCard size={20} />
            <span className="font-medium">Online Payment</span>
          </button>

        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition"
        >
          {loading ? "Processing..." : `Pay ₹${totalAmount?.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;