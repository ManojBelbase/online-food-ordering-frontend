"use client";

import Image from "next/image";
import { Clock, MapPin } from "lucide-react";

interface RestaurantHeroProps {
  restaurant: Restaurant.IRestaurant;
  status: Restaurant.IRestaurantStatus;
}

export const RestaurantHero = ({ restaurant, status }: RestaurantHeroProps) => {
  return (
    <div className="relative h-64 md:h-80 bg-gradient-to-r from-orange-600 to-red-600">
      <div className="absolute inset-0 bg-black/20"></div>
      <Image 
        src={restaurant.logo || "/warm-restaurant-interior.png"} 
        alt={`${restaurant.restaurantName} cover`} 
        fill 
        className="object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

      {/* Restaurant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl capitalize md:text-3xl lg:text-4xl font-bold mb-2">
                {restaurant.restaurantName}
              </h1>
              <p className="text-base md:text-lg opacity-90 mb-3 capitalize">
                {restaurant.cuisineType} Cuisine
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-white capitalize" />
                  <span className="capitalize">{restaurant.address}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className={`font-medium ${status.isOpen ? 'text-green-300' : 'text-red-300'}`}>
                    {status.status}
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer"
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
