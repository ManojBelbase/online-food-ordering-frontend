"use client";

import { fetchNearbyRestaurants } from "@/api/location";
import { useUserLocation } from "@/hooks/location/useUserLocation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Badge,
  ChevronRight,
  Clock,
  MapPin,
  Utensils,
  XCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SkeletonCard = () => (
  <Card className="overflow-hidden animate-pulse bg-white">
    <div className="w-full h-32 sm:h-48 bg-gradient-to-r from-gray-200 to-gray-300" />
    <CardContent className="p-3 sm:p-6 space-y-3">
      <div className="w-3/4 h-5 bg-gray-300 rounded" />
      <div className="w-1/2 h-4 bg-gray-200 rounded" />
      <div className="flex justify-between items-center pt-2">
        <div className="w-24 h-3 bg-gray-200 rounded" />
        <div className="w-20 h-3 bg-gray-200 rounded" />
      </div>
    </CardContent>
  </Card>
);

const ErrorState = () => (
  <div className="text-center py-12">
    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <XCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to load nearby restaurants
    </h3>
    <p className="text-base text-gray-600">Try again later.</p>
  </div>
);

export default function NearbyRestaurants() {
  const { location, error: locationError } = useUserLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["nearby-restaurants", location],
    queryFn: () =>
      fetchNearbyRestaurants(location?.latitude ?? 0, location?.longitude ?? 0),
     
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || locationError) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <ErrorState />
        </div>
      </section>
    );
  }

  if (!data?.length) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No nearby restaurants found
          </h3>
          <p className="text-base text-gray-600">
            Please enable location or try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Nearby Restaurants
          </h2>
          <p className="text-sm text-gray-600">
            Based on your current location
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((restaurant: Model.IRestaurant) => (
            <Link
              key={restaurant._id}
              href={`/restaurant/${restaurant._id}`}
              className="block"
            >
              <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                <div className="relative">
                  <Image
                    src={restaurant.logo}
                    alt={restaurant.restaurantName}
                    width={400}
                    height={300}
                    className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-orange-600 text-white text-xs font-medium px-2 py-1">
                      {restaurant.cuisineType || "Restaurant"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold capitalize text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {restaurant.restaurantName}
                  </h3>

                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {restaurant.address}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      {restaurant.manualOverride?.isOpen ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Open</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Closed</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.distanceInKm.toFixed(2)} km away</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {data.length > 6 && (
          <div className="text-center mt-10">
            <Link
              href="/restaurants"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-md transition"
            >
              Explore All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
