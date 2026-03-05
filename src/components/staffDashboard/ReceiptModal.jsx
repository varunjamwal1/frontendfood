import React from "react";
import { Printer, CheckCircle, X } from "lucide-react";

const ReceiptModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // Format Date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format Time
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // GST Calculation (5%)
  const taxRate = 5;
  const taxAmount = (order.totalAmount * taxRate) / 100;
  const subTotal = order.totalAmount - taxAmount;

  return (
    <>
      {/* ================= MODAL VIEW ================= */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:hidden"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center text-white">
            <CheckCircle size={48} className="mx-auto mb-3" />
            <h2 className="text-2xl font-bold">Payment Successful</h2>
            <p className="mt-1 font-mono text-sm">
              Order #{order._id?.slice(-8)?.toUpperCase()}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4 text-black">
            <div className="space-y-1 text-sm">
              <p><strong>Customer:</strong> {order.customerName || "Guest"}</p>
              <p><strong>Table:</strong> {order.table?.name || "Takeaway"}</p>
              <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Time:</strong> {formatTime(order.createdAt)}</p>
              <p className="capitalize">
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
            </div>

            <div className="border-t pt-4 space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({taxRate}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            </div>

            <div className="border-t-2 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-100 flex gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black transition"
            >
              <Printer size={18} className="inline mr-2" />
              Print Bill
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              <X size={18} className="inline mr-2" />
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ================= PRINT VERSION ================= */}
      <div className="hidden print:block">
        <div className="w-[280px] mx-auto font-mono text-black text-[12px] leading-tight">

          {/* Cafe Header */}
          <div className="text-center mb-2">
            <h1 className="text-lg font-bold uppercase tracking-wide">
              VARUN CAFE
            </h1>
            <p>123 Main Street, City Center</p>
            <p>Mumbai - 400001</p>
            <p>+91 98765 43210</p>
            <p>GSTIN: 27ABCDE1234F1Z5</p>
          </div>

          <div className="border-t border-black border-dashed my-2"></div>

          {/* Order Info */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Order #:</span>
              <span className="font-bold">
                #{order._id?.slice(-8)?.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>

            <div className="flex justify-between">
              <span>Time:</span>
              <span>{formatTime(order.createdAt)}</span>
            </div>

            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{order.customerName || "Guest"}</span>
            </div>

            <div className="flex justify-between">
              <span>Table:</span>
              <span>{order.table?.name || "Takeaway"}</span>
            </div>

            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="uppercase">{order.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-black border-dashed my-2"></div>

          {/* Items Header */}
          <div className="flex justify-between font-bold mb-1">
            <span>ITEM</span>
            <span>AMOUNT</span>
          </div>

          <div className="border-t border-black my-1"></div>

          {/* Items */}
          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between font-semibold">
                  <span>{item.name}</span>
                  <span>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
                <div>
                  {item.quantity} × {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-black border-dashed my-2"></div>

          {/* Tax */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({taxRate}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          </div>

          <div className="border-t border-black border-dashed my-2"></div>

          {/* Total */}
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>

          <div className="border-t border-black border-dashed my-2"></div>

          {/* Footer */}
          <div className="text-center mt-3 text-black">
            <p>Thank You For Visiting!</p>
            <p>Visit Again ☕</p>
            <p className="mt-1">
              VARUN CAFE | +91 98765 43210
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default ReceiptModal;