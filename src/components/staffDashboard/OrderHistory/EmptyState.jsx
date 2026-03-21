// components/EmptyState.jsx
import React from "react";
import { Clock } from "lucide-react";

const EmptyState = ({
  title = "No orders found",
  description = "Try adjusting your filters or search to find what you're looking for.",
  icon: Icon = Clock,
  colSpan = 8,
  action = null,
  isTable = true,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-10">
      
      {/* ICON */}
      <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-gray-500 opacity-60" />
      </div>

      {/* TITLE */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-6">
        {description}
      </p>

      {/* OPTIONAL ACTION */}
      {action && <div>{action}</div>}
    </div>
  );

  // ✅ TABLE MODE
  if (isTable) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-6 py-16">
          {content}
        </td>
      </tr>
    );
  }

  // ✅ NORMAL MODE
  return <div className="w-full py-20">{content}</div>;
};

export default React.memo(EmptyState);