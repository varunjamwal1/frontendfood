import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Header Skeleton */}
        <div className="animate-pulse mb-8">
          <div className="h-10 w-64 bg-gray-700 rounded mb-4"></div>
          <div className="h-5 w-40 bg-gray-700 rounded"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-3 mb-6 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-20 bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="animate-pulse mb-8">
          <div className="h-12 w-full bg-gray-700 rounded-xl"></div>
        </div>

        {/* Order Cards Skeleton */}
        <div className="space-y-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="h-5 w-40 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-28 bg-gray-700 rounded"></div>
                </div>

                <div className="h-6 w-20 bg-gray-700 rounded"></div>
              </div>

              <div className="h-10 w-full bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LoadingSkeleton;