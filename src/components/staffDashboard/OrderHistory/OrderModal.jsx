// components/OrderModal.jsx
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { X, Clock, Printer } from "lucide-react";

const OrderModal = React.memo(
  ({
    order = {},
    onClose = () => {},
    onPrint = () => {},
    formatCurrency = (v) => `₹${v}`,
    formatDate = (v) => v,
    formatTime = (v) => v,
    getStatusConfig = () => ({}),
  }) => {
    const modalRef = useRef(null);

    // ✅ SAFE ORDER
    const safeOrder = useMemo(() => ({
      id: order?._id || "",
      shortId: order?._id ? order._id.slice(-6).toUpperCase() : "N/A",
      customerName: order?.customerName || "Walk-in Customer",
      phone: order?.phone || "",
      totalAmount: Number(order?.totalAmount || 0),
      paymentMethod: order?.paymentMethod || "cash",
      paymentStatus: order?.paymentStatus || "pending",
      createdAt: order?.createdAt || new Date().toISOString(),
      table: order?.table,
      items: Array.isArray(order?.items) ? order.items : [],
    }), [order]);

    // ✅ FIXED DINE-IN LABEL
    const orderType = useMemo(() => {
      const t = safeOrder.table;
      if (!t) return "Takeaway";

      if (typeof t === "object") {
        const num = t?.tableNumber || t?.number || t?.name;
        return num ? `Table ${num}` : "Dine-in";
      }

      return `Table ${t}`;
    }, [safeOrder.table]);

    // ✅ STATUS CONFIG SAFE
    const statusConfig = useMemo(() => {
      const cfg = getStatusConfig(safeOrder.paymentStatus);
      return {
        bg: cfg?.bg || "bg-gray-500/10",
        border: cfg?.border || "border-gray-500/30",
        text: cfg?.text || "text-gray-300",
      };
    }, [safeOrder.paymentStatus, getStatusConfig]);

    // ✅ CALCULATIONS
    const subtotal = useMemo(() => {
      return safeOrder.items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );
    }, [safeOrder.items]);

    const tax = Math.max(0, safeOrder.totalAmount - subtotal);

    // ✅ CLOSE HANDLERS
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) onClose();
    };

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Escape") onClose();

        // ✅ FIX: ctrl + p + cmd + p
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
          e.preventDefault();
          onPrint();
        }
      },
      [onClose, onPrint]
    );

    useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }, [handleKeyDown]);

    return (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className="w-full max-w-4xl max-h-[95vh] flex flex-col bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-orange-400">
                  Order #{safeOrder.shortId}
                </h2>

                <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(safeOrder.createdAt)}{" "}
                    {formatTime(safeOrder.createdAt)}
                  </span>

                  <span className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300">
                    {orderType}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onPrint}
                  className="px-4 py-2 bg-orange-500/10 text-orange-300 rounded-lg hover:bg-orange-500/20"
                >
                  <Printer size={16} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {safeOrder.items.length > 0 ? (
              safeOrder.items.map((item, i) => (
                <div
                  key={item._id || `${item.name}-${i}`}
                  className="flex justify-between p-4 bg-gray-800 rounded-xl"
                >
                  <div>
                    <div className="text-white font-semibold">
                      {item.name || "Item"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.quantity} × ₹{Number(item.price || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="text-orange-400 font-bold">
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                No items
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-gray-800">
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between mt-4 text-lg font-bold text-white">
              <span>Total</span>
              <span>{formatCurrency(safeOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OrderModal.displayName = "OrderModal";

export default OrderModal;