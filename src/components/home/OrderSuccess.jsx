import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Home, 
  Copy, 
  Clock, 
  Receipt, 
  Phone, 
  MapPin,
  ShoppingBag,
  RefreshCw,
  Share2,
  Download
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function OrderSuccess({ order, onHome }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Copy Order ID
  const handleCopyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      toast.success("Order ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share Order
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Order Confirmation",
          text: `Your order #${order?.orderId} has been placed successfully!`,
          url: window.location.href,
        });
        toast.success("Order shared successfully!");
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback to copy
      handleCopyOrderId();
    }
  };

  // Download Receipt
  const handleDownload = () => {
    toast.success("Receipt downloaded!");
    // You can add actual PDF generation logic here
  };

  // Format date
  const formattedDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onHome}
      />
      
      {/* Success Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-300">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Thank you for your order
        </p>
        
        {/* Timer */}
        <div className="bg-orange-50 rounded-lg p-3 mb-4 flex items-center justify-center gap-2">
          <Clock size={18} className="text-orange-600" />
          <span className="text-sm font-medium text-orange-700">
            Estimated preparation time: {formatTime(timeLeft)}
          </span>
        </div>
        
        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
          {/* Order ID */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Receipt size={14} /> Order ID
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">#{order?.orderId || "12345"}</span>
              <button
                onClick={handleCopyOrderId}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Copy Order ID"
              >
                {copied ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
          
          {/* Date & Time */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock size={14} /> Date & Time
            </span>
            <span className="text-sm font-medium text-gray-700">
              {formattedDate}
            </span>
          </div>
          
          {/* Order Type */}
          {order?.orderType && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order Type</span>
              <span className="text-sm font-medium text-gray-700">
                {order.orderType === "dine-in" ? "🍽️ Dine In" : "📦 Takeaway"}
              </span>
            </div>
          )}
          
          {/* Table */}
          {order?.table && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> Table
              </span>
              <span className="text-sm font-medium text-gray-700">
                Table {order.table}
              </span>
            </div>
          )}
          
          {/* Customer Name */}
          {order?.customerName && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Phone size={14} /> Customer
              </span>
              <span className="text-sm font-medium text-gray-700">
                {order.customerName}
              </span>
            </div>
          )}
          
          {/* Total Amount */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-sm font-bold text-gray-700">Total Amount</span>
            <span className="text-xl font-bold text-orange-600">
              ₹{order?.totalAmount?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
        
        {/* Items Summary */}
        {order?.items && order.items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ShoppingBag size={16} />
              Items Ordered ({order.items.length})
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0"
                >
                  <span className="text-gray-700">
                    {item.qty}x {item.name}
                  </span>
                  <span className="text-gray-500">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Thank You Note */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Thank you for choosing Varun Store!</span>
            <br />
            We appreciate your business. Enjoy your meal! 🍽️
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={onHome}
            className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
          >
            <Home size={20} /> Back to Menu
          </button>
          
          <button
            onClick={handleShare}
            className="px-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            title="Share Order"
          >
            <Share2 size={20} />
          </button>
          
          <button
            onClick={handleDownload}
            className="px-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            title="Download Receipt"
          >
            <Download size={20} />
          </button>
        </div>
        
        {/* Payment Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Clock size={12} />
            Estimated preparation time: 15-20 minutes
          </p>
        </div>
      </div>
    </div>
  );
}