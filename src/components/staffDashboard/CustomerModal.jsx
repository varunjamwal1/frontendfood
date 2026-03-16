import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CustomerModal({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  onClose,
  onConfirm,
  placingOrder = false
}) {

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCancel = () => {
    if (placingOrder) return;
    onClose?.();
  };

  const handleConfirm = () => {
    if (!customerName?.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (customerPhone && !/^\d{10}$/.test(customerPhone)) {
      toast.error("Enter valid 10 digit phone number");
      return;
    }

    onConfirm?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl border border-white/10 shadow-2xl animate-fadeIn">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">

          <div>
            <h2 className="text-2xl font-bold text-gradient">
              Customer Details
            </h2>
            <p className="text-sm text-gray-400">
              Required for order tracking
            </p>
          </div>

          <button
            onClick={handleCancel}
            disabled={placingOrder}
            className="p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORM */}

        <div className="p-6 space-y-6">

          {/* NAME */}

          <div>
            <label className="input-label flex items-center gap-2">
              Customer Name
              <span className="text-orange-500">*</span>
            </label>

            <input
              type="text"
              value={customerName || ""}
              placeholder="Enter customer name"
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={placingOrder}
              autoFocus
              className="input-field text-lg  text-black"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="input-label">
              Phone Number (optional)
            </label>

            <input
              type="tel"
              value={customerPhone || ""}
              placeholder="10 digit phone"
              maxLength={10}
              disabled={placingOrder}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setCustomerPhone(value);
              }}
              className="input-field text-lg text-black"
            />

            {customerPhone && (
              <p
                className={`text-xs mt-2 font-medium ${
                  /^\d{10}$/.test(customerPhone)
                    ? "text-emerald-400"
                    : "text-orange-400"
                }`}
              >
                {/^\d{10}$/.test(customerPhone)
                  ? "✓ Valid phone number"
                  : "Enter 10 digits"}
              </p>
            )}
          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex gap-3 px-6 pb-6">

          <button
            onClick={handleCancel}
            disabled={placingOrder}
            className="btn-secondary flex-1 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!customerName?.trim() || placingOrder}
            className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
          >

            {placingOrder ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Placing...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirm Order
              </>
            )}

          </button>

        </div>

      </div>
    </div>
  );
}