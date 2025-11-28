"use client";

import { Award } from "lucide-react";

interface RestaurantStatsProps {
  restaurant: Restaurant.IRestaurant;
}

export const RestaurantStats = ({ restaurant }: RestaurantStatsProps) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-2 sm:space-y-0">
            {/* <div className="flex items-center text-sm text-gray-600">
              <Truck className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium">Free delivery on orders above ₹299</span>
            </div> */}
            <div className="flex items-center text-sm text-gray-600">
              <Award className="h-4 w-4 mr-2 text-orange-500" />
              <span>License: {restaurant.licenseNumber}</span>
            </div>
          </div>
          {/* <Button variant="outline" size="sm" className="cursor-pointer">
            <Info className="h-4 w-4 mr-2" />
            More Info
          </Button> */}
        </div>
      </div>
    </div>
  );
};
