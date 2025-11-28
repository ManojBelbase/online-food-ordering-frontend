"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, MapPin, Utensils } from "lucide-react";
import Link from "next/link";
import { useRestaurants } from "@/hooks/restaurant/useRestaurants";
import Image from "next/image";

const SkeletonCard = () => (
  <Card className="overflow-hidden animate-pulse bg-white">
    <div className="w-full h-32 sm:h-48 bg-gradient-to-r from-gray-200 to-gray-300 relative">
      <div className="absolute top-2 left-2 w-16 h-5 bg-gray-400 rounded-full" />
    </div>
    <CardContent className="p-3 sm:p-6 space-y-2 sm:space-y-3">
      <div className="w-3/4 h-5 bg-gray-300 rounded" />
      <div className="w-1/2 h-3 bg-gray-200 rounded" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="w-8 h-3 bg-gray-200 rounded" />
        </div>
        <div className="w-12 h-3 bg-gray-200 rounded" />
      </div>
    </CardContent>
  </Card>
);

const ErrorState = () => (
  <div className="text-center py-8 sm:py-12">
    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
      Unable to load restaurants
    </h3>
    <p className="text-sm sm:text-base text-gray-600 px-4">
      Please try again later or contact support if the problem persists.
    </p>
  </div>
);

const FeaturedRestaurants = () => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) {
    return (
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div className="space-y-2 mb-4 sm:mb-0">
              <div className="w-40 sm:w-48 h-6 sm:h-8 bg-gray-300 rounded animate-pulse" />
              <div className="w-48 sm:w-64 h-3 sm:h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState />
        </div>
      </section>
    );
  }

  if (!restaurants?.length) {
    return (
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8 sm:py-12">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No restaurants available
            </h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Check back soon for new restaurants in your area.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-12">
          <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Featured Restaurants
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Discover the best dining experiences in your area
            </p>
          </div>
          <Link
            href="/restaurants"
            className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-200"
          >
            View All
            <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {restaurants.slice(0, 6).map((restaurant: UI.Restaurant) => (
            <Link
              key={restaurant._id}
              href={`/restaurant/${restaurant._id}`}
              className="group block"
            >
              <Card className="overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={
                      restaurant.logo ||
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
                    }
                    alt={restaurant.restaurantName}
                    className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    width={400}
                    height={300}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <Badge className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-2 py-1 sm:px-3 sm:py-1 shadow-md text-xs sm:text-sm">
                      {restaurant.cuisineType || "Restaurant"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="font-bold capitalize text-sm sm:text-lg lg:text-xl text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
                        {restaurant.restaurantName}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm flex items-center">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {restaurant.address || "Address not available"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium">
                        {restaurant.openHours || "Hours not available"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {restaurants.length > 6 && (
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/restaurants"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Explore All Restaurants
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
