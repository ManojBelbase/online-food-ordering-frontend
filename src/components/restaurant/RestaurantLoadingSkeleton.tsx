"use client";

export const RestaurantLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading skeleton */}
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="flex gap-6">
            <div className="w-80 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="flex-1 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
