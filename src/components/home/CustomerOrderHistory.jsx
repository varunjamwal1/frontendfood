import React, { useState, useEffect } from "react";
import { ordersAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import { X, Clock, CheckCircle, Package, Receipt, Coffee } from "lucide-react";

export default function CustomerOrderHistory({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getCustomerOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch {
      toast.error("Failed to load your order history.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-5 h-5 text-amber-500" />;
      case "preparing": return <Coffee className="w-5 h-5 text-blue-500" />;
      case "ready": return <Package className="w-5 h-5 text-indigo-500" />;
      case "completed": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Receipt className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 pb-20 lg:pb-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-[fade-in-up_0.3s_ease-out]">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Your Orders</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Past and current orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 opacity-50">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm font-medium">Loading history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Coffee className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No orders yet</h3>
              <p className="text-slate-500 text-sm max-w-xs">When you place an order, it will appear here so you can track its status.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(order.status)}
                        <span className="font-bold text-slate-800 tracking-tight capitalize">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-lg text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {order.orderType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">
                          <span className="text-slate-400 mr-2">{item.quantity}x</span>
                          {item.name}
                        </span>
                        <span className="text-slate-700 font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
