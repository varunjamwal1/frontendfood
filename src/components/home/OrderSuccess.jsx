import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Check, Copy, Clock, Receipt, Home, ChevronRight } from "lucide-react";

export default function OrderSuccess({ order = {}, onHome }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyOrderId = async () => {
    try {
      if (order?.orderId && navigator.clipboard) {
        await navigator.clipboard.writeText(order.orderId);
        setCopied(true);
        toast.success("Order ID copied! 📋", {
          style: { 
            borderRadius: '100px', 
            background: '#0f172a', 
            color: '#fff',
            fontWeight: '600'
          }
        });
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = order.orderId;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success("Order ID copied! 📋", {
          style: { 
            borderRadius: '100px', 
            background: '#0f172a', 
            color: '#fff',
            fontWeight: '600'
          }
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      toast.error("Failed to copy", {
        style: { borderRadius: '100px' }
      });
    }
  };

  const formattedDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  const orderId = order?.orderId || "N/A";
  const totalAmount = order?.totalAmount?.toFixed(2) || "0.00";
  const serviceType = order?.type || 'Takeaway';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      {/* Deep Immersive Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl animate-[fade-in-up_0.5s_ease-out_forwards] pointer-events-auto" 
        onClick={onHome}
        role="button"
        aria-label="Close success modal"
      />

      {/* Floating Success Card */}
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 w-full max-w-lg mx-auto p-8 sm:p-10 lg:p-12 transform animate-[fade-in-up_0.6s_ease-out_forwards] pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="order-success-title"
        aria-describedby="order-success-description"
      >
        {/* Animated Celebration Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-600/10 flex items-center justify-center mx-auto mb-8 shadow-2xl ring-8 ring-emerald-100/50 dark:ring-emerald-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent animate-[spin_20s_linear_infinite]"></div>
          <Check size={56} className="text-emerald-500 relative z-10 drop-shadow-lg" strokeWidth={3} />
        </div>

        {/* Title & Confetti Vibe */}
        <div className="text-center mb-10">
          <h1 id="order-success-title" className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-3 tracking-tight">
            Order Confirmed
          </h1>
          <p id="order-success-description" className="text-lg font-medium text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Your craft is being prepared with precision. We'll have it ready for you shortly.
          </p>
        </div>

        {/* Live Prep Timer Card */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-[2rem] p-8 mb-10 border border-slate-100/50 dark:border-slate-700/50 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              <Clock size={18} className="text-emerald-500 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Estimated Prep</span>
            </div>
            <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent tracking-[-0.05em] mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">minutes remaining</div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2rem] p-8 mb-10 border border-slate-100/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Receipt #{orderId}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Order placed successfully</p>
              </div>
            </div>
            <button 
              onClick={handleCopyOrderId}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 active:scale-95 shadow-sm ${
                copied 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40' 
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 shadow-slate-200/50 dark:shadow-slate-700/50 hover:shadow-slate-300/60'
              }`}
              title="Copy Order ID to clipboard"
              aria-label="Copy order ID"
            >
              {copied ? (
                <>
                  <Check size={16} className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="w-4 h-4" />
                  Copy ID
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Placed</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{formattedDate}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 px-4 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Service</span>
              <span className={`font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider ${
                serviceType === 'Dine-in' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              }`}>
                {serviceType}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100/50 dark:border-slate-700/50">
            <div className="flex justify-between items-baseline pb-4">
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Total Paid</span>
              <span className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent tracking-[-0.02em]">
                ${totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onHome}
          className="group relative w-full h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-indigo-500 dark:via-purple-500 dark:to-indigo-600 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 dark:hover:from-indigo-400 dark:hover:via-purple-400 dark:hover:to-indigo-400 text-white font-black text-xl rounded-[2.5rem] flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] transition-all duration-500 active:scale-[0.97] overflow-hidden"
        >
          <span className="relative z-10 tracking-tight">Back to Menu</span>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300 relative z-10" strokeWidth={2.5} />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
        </button>

        {/* Premium Badge */}
        <div className="mt-8 pt-6 border-t border-slate-100/50 dark:border-slate-700/50 flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Check size={14} />
          Securely Processed • Ready in {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
}