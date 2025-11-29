"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Utensils } from "lucide-react";

import { useRestaurants } from "@/hooks/restaurant/useRestaurants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 9 }).map((_, index) => (
      <Card key={index} className="overflow-hidden bg-white animate-pulse">
        <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300" />
        <CardContent className="p-6 space-y-4">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorState = () => (
  <div className="text-center py-16">
    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <Utensils className="w-8 h-8 text-red-600" />
    </div>
    <h2 className="text-xl font-semibold text-gray-900 mb-2">
      Unable to load restaurants
    </h2>
    <p className="text-gray-600 max-w-lg mx-auto mb-6">
      We ran into a problem while fetching restaurants. Please refresh the page
      or try again later.
    </p>
    <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
      Retry
    </Button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Utensils className="w-8 h-8 text-gray-400" />
    </div>
    <h2 className="text-xl font-semibold text-gray-900 mb-2">
      No restaurants available right now
    </h2>
    <p className="text-gray-600 max-w-md mx-auto">
      New restaurants are added regularly. Check back soon to discover more
      places to eat.
    </p>
  </div>
);

const RestaurantsPage = () => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Discover
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Restaurants Near You
            </h1>
            <p className="mt-2 text-gray-600">
              Browse all available restaurants and start your order.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {restaurants?.length
              ? `${restaurants.length} restaurant${restaurants.length > 1 ? "s" : ""} found`
              : null}
          </div>
        </div>

        {isLoading && <SkeletonGrid />}

        {error && !isLoading && <ErrorState />}

        {!isLoading && !error && !restaurants?.length && <EmptyState />}

        {!isLoading && !error && restaurants?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4">
            {restaurants.map((restaurant: UI.Restaurant) => (
              <Link
                key={restaurant._id}
                href={`/restaurant/${restaurant._id}`}
                className="block group"
              >
                <Card className="overflow-hidden bg-white border border-gray-100 hover:border-orange-200 hover:shadow-xs transition-all duration-200 p-0 m-0">
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={
                        restaurant.logo ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
                      }
                      alt={restaurant.restaurantName}
                      fill
                      className="object-cover group-hover:scale-101 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 400px"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-600 text-white">
                        {restaurant.cuisineType || "Restaurant"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {restaurant.restaurantName}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                        <span className="truncate">
                          {restaurant.address || "Address not available"}
                        </span>
                      </p>
                    </div>

                    <div className="text-xs text-gray-500">
                      {restaurant.openHours || "Hours not available"}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RestaurantsPage;

