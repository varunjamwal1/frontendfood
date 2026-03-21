// components/LoadingSkeleton.jsx
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
    <div className="text-center animate-pulse">
      <Loader2 className="w-20 h-20 text-orange-500 mx-auto mb-8" />
      <div className="space-y-4">
        <div className="h-6 bg-gray-700 rounded-xl w-64 mx-auto"></div>
        <div className="h-6 bg-gray-700 rounded-xl w-40 mx-auto"></div>
        <div className="h-4 bg-gray-700 rounded w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;