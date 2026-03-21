import React, { useState, useEffect, useCallback } from "react";
import { X, CreditCard, DollarSign, Loader2, Check } from "lucide-react";

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount = 0,
  orderData = {},
  onPaymentSuccess,
}) {
  const [method, setMethod] = useState("online");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const customerName = orderData?.customerName || orderData?.customerInfo?.name || "Guest";
  const tableNumber = orderData?.table || orderData?.customerInfo?.table || null;
  const isDineIn = !!tableNumber;

  const handlePayment = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentSuccess?.(method, orderData);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setLoading(false);
    }
  }, [method, orderData, onPaymentSuccess]);

  if (!isOpen) return null;

  const getPaymentMethodClassName = (currentMethod) => {
    return currentMethod === method
      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-lg ring-2 ring-indigo-500/20"
      : "border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 bg-white/80 dark:bg-slate-800/50 hover:shadow-md";
  };

  const getIconClassName = (currentMethod) => {
    return currentMethod === method
      ? "bg-indigo-500 text-white shadow-lg"
      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600";
  };

  const getTextClassName = (currentMethod) => {
    return currentMethod === method
      ? "text-indigo-900 dark:text-indigo-100 font-bold"
      : "text-slate-900 dark:text-white";
  };

  const getRadioClassName = (currentMethod) => {
    return currentMethod === method
      ? "border-indigo-500 bg-indigo-500 shadow-md"
      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800";
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true">
      {/* Deep Blur Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl"
        onClick={onClose}
        aria-label="Close payment modal"
      />

      {/* Perfect Fixed Size Modal Container */}
      <div
        className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-md h-[95vh] sm:max-w-lg sm:h-[90vh] md:max-w-xl md:h-[85vh] lg:max-w-2xl lg:h-[80vh] mx-auto max-h-[800px] min-h-[600px] rounded-[3rem] shadow-2xl border border-white/50 dark:border-slate-800/50 overflow-hidden flex flex-col transform scale-95 animate-[pop-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header - Fixed Height */}
        <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-slate-100/50 dark:border-slate-800/50 h-24 sm:h-28 flex-shrink-0">
          <div className="flex items-start justify-between gap-4 h-full">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent tracking-tight mb-1 sm:mb-2 leading-tight">
                Secure Checkout
              </h2>
              <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete your order of ₹{totalAmount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-all duration-200 hover:shadow-md active:scale-95 shrink-0 flex-shrink-0 mt-1 sm:mt-0"
              aria-label="Close payment modal"
            >
              <X size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Perfect Scrollable Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8 sm:pb-12 pt-2 sm:pt-4 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-slate-300/80 dark:scrollbar-thumb-slate-600/80 scrollbar-track-slate-100/50 dark:scrollbar-track-slate-800/50 scrollbar-thumb-rounded-full hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500 transition-colors duration-200">

            {/* Order Summary Card */}
            <div className="bg-gradient-to-br from-white/70 to-slate-50/70 dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-slate-100/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Customer</p>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/50 dark:bg-slate-700/50 rounded-2xl border border-slate-100/50 dark:border-slate-600/50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-xs sm:text-sm">👤</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white truncate">{customerName}</p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{isDineIn ? `Table #${tableNumber}` : 'Takeaway Order'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end lg:justify-center text-right lg:text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 sm:mb-4">Total Amount</p>
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-100/50 mx-auto lg:mx-0 w-fit">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-[-0.05em] drop-shadow-lg block leading-none">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                    <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1">Due Now</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 sm:space-y-4">
              {/* Card Payment */}
              <button
                type="button"
                onClick={() => setMethod("online")}
                disabled={loading}
                className={`group relative w-full h-24 sm:h-28 p-4 sm:p-8 flex items-center justify-between rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("online")}`}
              >
                <div className="flex items-center gap-4 sm:gap-5 z-10 flex-1 min-w-0">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 flex-shrink-0 ${getIconClassName("online")}`}>
                    <CreditCard size={20} className="sm:w-6 sm:h-6" strokeWidth={method === "online" ? 3 : 2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-lg sm:text-xl font-black truncate ${getTextClassName("online")}`}>Card Payment</h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 sm:mt-1">Apple Pay, Google Pay, Cards</p>
                    <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Secure & Instant</p>
                  </div>
                </div>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ml-2 sm:ml-4 flex-shrink-0 ${getRadioClassName("online")}`}>
                  {method === "online" && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-sm"></div>}
                </div>
              </button>

              {/* Cash Payment */}
              <button
                type="button"
                onClick={() => setMethod("cash")}
                disabled={loading}
                className={`group relative w-full h-24 sm:h-28 p-4 sm:p-8 flex items-center justify-between rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("cash")}`}
              >
                <div className="flex items-center gap-4 sm:gap-5 z-10 flex-1 min-w-0">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 flex-shrink-0 ${getIconClassName("cash")}`}>
                    <DollarSign size={20} className="sm:w-6 sm:h-6" strokeWidth={method === "cash" ? 3 : 2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-lg sm:text-xl font-black truncate ${getTextClassName("cash")}`}> ₹ Cash Payment</h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 sm:mt-1">Pay at counter</p>
                    <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Exact change preferred</p>
                  </div>
                </div>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ml-2 sm:ml-4 flex-shrink-0 ${getRadioClassName("cash")}`}>
                  {method === "cash" && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-sm animate-pulse"></div>}
                </div>
              </button>
            </div>

            {/* Spacer for perfect scroll behavior */}
            <div className="h-8 sm:h-12" />
          </div>
        </div>

        {/* Fixed Bottom Pay Button Section - Always Visible */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 sm:pt-6 border-t border-slate-100/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex-shrink-0 shadow-2xl">

          {/* Pay Button - Fixed Height */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="group relative w-full h-16 sm:h-20 rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-indigo-600 dark:via-purple-500 dark:to-indigo-700 text-white font-black text-lg sm:text-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden disabled:shadow-none mb-4 sm:mb-6"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 h-full px-4">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin flex-shrink-0" />
                  <span className="hidden sm:inline">Processing Payment...</span>
                  <span className="sm:hidden">Processing...</span>
                </>
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Check size={16} className="animate-pulse flex-shrink-0" />
            <span>End-to-End Encrypted</span>
            <CreditCard size={14} className="ml-0.5 sm:ml-1 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}