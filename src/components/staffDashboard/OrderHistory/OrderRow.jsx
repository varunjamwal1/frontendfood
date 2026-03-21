// components/OrderRow.jsx
import React, { useMemo, useCallback } from "react";
import { Eye, Printer, Download } from "lucide-react";
import { toast } from "react-hot-toast";

const OrderRow = React.memo(
  ({
    order = {},
    formatCurrency = (v) => `₹${v}`,
    formatTime = (v) => v,
    getStatusConfig = () => ({}),
    onView = () => {},
    onPrint = () => {},
    evenRow = false,
  }) => {
    // ✅ SAFE ORDER
    const safeOrder = useMemo(() => ({
      id: order?._id || "",
      shortId: order?._id ? order._id.slice(-6).toUpperCase() : "N/A",
      subId: order?._id ? order._id.slice(-8).toUpperCase() : "N/A",
      customerName: order?.customerName || "Walk-in Customer",
      phone: order?.phone || "",
      totalAmount: Number(order?.totalAmount || 0),
      paymentMethod: order?.paymentMethod || "cash",
      paymentStatus: order?.paymentStatus || "pending",
      createdAt: order?.createdAt || new Date().toISOString(),
      table: order?.table,
      items: order?.items || [],
    }), [order]);

    // 🔥 ✅ FIXED DINE-IN LABEL (NO OBJECT BUG)
    const orderType = useMemo(() => {
      const table = safeOrder.table;

      if (!table) return "Takeaway";

      // Handle different formats safely
      if (typeof table === "object") {
        const tableNumber =
          table?.tableNumber ||
          table?.number ||
          table?.name ||
          "";

        return tableNumber
          ? `Dine-in T${tableNumber}`
          : "Dine-in";
      }

      // If string/number
      return `Dine-in T${table}`;
    }, [safeOrder.table]);

    // ✅ STATUS CONFIG (TAILWIND SAFE)
    const statusConfig = useMemo(() => {
      const config = getStatusConfig(safeOrder.paymentStatus);

      return {
        bg: config?.bg || "bg-gray-500/10",
        border: config?.border || "border-gray-500/30",
        text: config?.text || "text-gray-300", // ✅ FIXED (NO dynamic tailwind)
      };
    }, [safeOrder.paymentStatus, getStatusConfig]);

    // 🖨️ PRINT
    const handlePrintReceipt = useCallback(() => {
      if (!safeOrder.id) {
        toast.error("No order selected");
        return;
      }

      const printWindow = window.open("", "_blank", "width=400,height=600");
      printWindow?.document.write(`<h2>Receipt #${safeOrder.shortId}</h2>`);
      printWindow?.document.close();
      printWindow?.print();

      toast.success(`Printing #${safeOrder.shortId}`);
      onPrint(safeOrder);
    }, [safeOrder, onPrint]);

    // 📄 DOWNLOAD
    const handleDownloadBill = useCallback(() => {
      if (!safeOrder.id) {
        toast.error("No order selected");
        return;
      }

      const blob = new Blob(
        [`Order #${safeOrder.shortId}\nTotal: ${safeOrder.totalAmount}`],
        { type: "text/plain" }
      );

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `bill-${safeOrder.shortId}.txt`;
      link.click();

      toast.success(`Downloaded #${safeOrder.shortId}`);
    }, [safeOrder]);

    return (
      <tr
        className={`
        group h-20 border-l-4 border-transparent 
        hover:border-l-orange-500/60 hover:bg-gray-800/60
        transition-all duration-300
        ${evenRow ? "bg-gray-900/10" : ""}
      `}
      >
        {/* ID */}
        <td className="px-6 font-mono font-bold text-orange-400">
          #{safeOrder.shortId}
        </td>

        {/* CUSTOMER */}
        <td className="px-6">
          <div>
            <div className="text-white font-semibold truncate">
              {safeOrder.customerName}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {safeOrder.subId}
            </div>
          </div>
        </td>

        {/* PHONE */}
        <td className="px-6 text-gray-300 hidden lg:table-cell">
          {safeOrder.phone ? `+91 ${safeOrder.phone}` : "—"}
        </td>

        {/* AMOUNT */}
        <td className="px-6 text-right">
          <div className="text-white font-bold">
            {formatCurrency(safeOrder.totalAmount)}
          </div>
          <div className="text-xs text-gray-500 uppercase">
            {safeOrder.paymentMethod}
          </div>
        </td>

        {/* ORDER TYPE ✅ FIXED */}
        <td className="px-6 text-center">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
              safeOrder.table
                ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            }`}
          >
            {orderType}
          </span>
        </td>

        {/* STATUS */}
        <td className="px-6 text-center">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
          >
            {safeOrder.paymentStatus.toUpperCase()}
          </span>
        </td>

        {/* TIME */}
        <td className="px-6 text-gray-400 font-mono text-sm">
          {formatTime(safeOrder.createdAt)}
        </td>

        {/* ACTIONS */}
        <td className="px-6 text-right space-x-2">
          <button onClick={handleDownloadBill} className="p-2 hover:text-green-400">
            <Download size={16} />
          </button>

          <button onClick={handlePrintReceipt} className="p-2 hover:text-orange-400">
            <Printer size={16} />
          </button>

          <button onClick={onView} className="p-2 hover:text-orange-300">
            <Eye size={16} />
          </button>
        </td>
      </tr>
    );
  },
  (prev, next) => prev.order?._id === next.order?._id
);

export default OrderRow;