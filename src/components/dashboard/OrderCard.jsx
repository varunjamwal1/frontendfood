import React from "react";
import { Clock, Calendar, CreditCard, ShoppingBag, ArrowRight } from "lucide-react";

const OrderCard = ({ 
  order, 
  onClick, 
  onStatusChange,
  className = "" 
}) => {
  // Status configuration with icons
  const statusConfig = {
    paid: {
      color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
      icon: "✓",
      label: "Paid"
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
      icon: "⏳",
      label: "Pending"
    },
    failed: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
      icon: "✗",
      label: "Failed"
    },
    processing: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
      icon: "🔄",
      label: "Processing"
    }
  };

  const currentStatus = statusConfig[order.paymentStatus] || statusConfig.pending;
  
  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDate(order.createdAt);

  // Payment method icon
  const getPaymentMethodIcon = (method) => {
    if (method === 'online') return <CreditCard size={12} />;
    if (method === 'cash') return <ShoppingBag size={12} />;
    return <CreditCard size={12} />;
  };

  return (
    <div
      className={`
        group
        bg-white dark:bg-slate-800
        rounded-xl
        border border-gray-200 dark:border-slate-700
        hover:border-indigo-300 dark:hover:border-indigo-600
        hover:shadow-md
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      role="article"
      aria-label={`Order ${order._id?.slice(-4)} for ${order.customerName || 'Guest'}`}
    >
      {/* Header Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          {/* Customer Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-800 dark:text-white">
                {order.customerName || 'Guest'}
              </h4>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                #{order._id?.slice(-4)}
              </span>
            </div>
            
            {/* Date & Time */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{time}</span>
              </div>
            </div>
            
            {/* Table/Takeaway */}
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">
                {order.table?.name || 'Takeaway'}
              </span>
            </div>
          </div>

          {/* Status & Amount */}
          <div className="text-right flex-shrink-0 ml-4">
            {/* Status Badge */}
            <span
              className={`
                inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full
                ${currentStatus.color}
              `}
            >
              <span>{currentStatus.icon}</span>
              <span>{currentStatus.label}</span>
            </span>
            
            {/* Amount */}
            <p className="text-lg font-bold text-orange-500 mt-2">
              ₹{order.totalAmount?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-slate-700 my-3" />
        
        {/* Footer Section */}
        <div className="flex justify-between items-center">
          {/* Payment Method */}
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 dark:bg-slate-600 px-2.5 py-1.5 rounded-lg text-gray-600 dark:text-gray-300">
              {getPaymentMethodIcon(order.paymentMethod)}
              <span className="ml-1.5">
                {order.paymentMethod === 'online' ? 'Online' : 'Cash'}
              </span>
            </span>
          </div>
          
          {/* Items Count */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {order.items?.length || 0} Items
            </span>
            <ArrowRight size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;