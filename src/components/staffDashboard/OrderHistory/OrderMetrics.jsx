import React from "react";
import { DollarSign, Users, CreditCard, Clock } from "lucide-react";

const METRIC_CARDS = [
  { icon: DollarSign, title: "Total Revenue", color: "text-orange-400" },
  { icon: Users, title: "Unique Customers", color: "text-blue-400" },
  { icon: CreditCard, title: "Cash Revenue", color: "text-emerald-400" },
  { icon: Clock, title: "Total Orders", color: "text-gray-300" },
  { icon: Clock, title: "Pending Orders", color: "text-yellow-400" },
  { icon: DollarSign, title: "Avg Order Value", color: "text-purple-400" }
];

// ✅ SAFE FORMATTERS
const safeNumber = (val) => Number(val || 0).toLocaleString("en-IN");

const OrderMetrics = React.memo(({ metrics = {}, formatCurrency }) => {
  const values = {
    "Total Revenue": formatCurrency?.(metrics?.totalRevenue ?? 0),
    "Unique Customers": safeNumber(metrics?.uniqueCustomers),
    "Cash Revenue": formatCurrency?.(metrics?.cashRevenue ?? 0),
    "Total Orders": safeNumber(metrics?.totalOrders),
    "Pending Orders": safeNumber(metrics?.pendingOrders),
    "Avg Order Value": formatCurrency?.(metrics?.avgOrderValue ?? 0)
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {METRIC_CARDS.map(({ icon: Icon, title, color }, index) => (
        <article
          key={index}
          className="group p-8 bg-gray-800/50 hover:bg-gray-800/80 rounded-3xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="flex items-center justify-between mb-4">
            <Icon className={`w-7 h-7 ${color}`} />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {title}
            </span>
          </div>

          <div className="text-4xl lg:text-3xl font-black text-white">
            {values[title]}
          </div>
        </article>
      ))}
    </section>
  );
});

OrderMetrics.displayName = "OrderMetrics";
export default OrderMetrics;