"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Clock, MapPin, Utensils } from "lucide-react";

import { fetchFoodItemsWithDetails } from "@/api/foodItems";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const limit = 9;

const SkeletonCard = () => (
  <Card className="overflow-hidden bg-white border border-gray-100 animate-pulse">
    <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300" />
    <CardContent className="p-6 space-y-3">
      <div className="h-5 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-10 w-full bg-gray-100 rounded" />
    </CardContent>
  </Card>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center space-y-4">
    <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
      <Utensils className="w-6 h-6 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-red-700">
      Unable to load dishes
    </h3>
    <p className="text-sm text-red-600">
      Please check your connection or try again in a moment.
    </p>
    <Button onClick={onRetry} className="bg-orange-600 hover:bg-orange-700">
      Retry
    </Button>
  </div>
);

const EmptyState = () => (
  <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-10 text-center space-y-4">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
      <Utensils className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900">
      No dishes to show yet
    </h3>
    <p className="text-sm text-gray-600 max-w-md mx-auto">
      Once restaurants start adding menu items, you&apos;ll find their most popular dishes here.
    </p>
  </div>
);

const FoodShowcase = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["food-items-with-details", { limit }],
    queryFn: ({ pageParam = 1 }) =>
      fetchFoodItemsWithDetails({
        page: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined,
    staleTime: 2 * 60 * 1000,
    initialPageParam: 1,
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  return (
    <section className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>

            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Trending Food Picks
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Hand-picked dishes, updated as soon as restaurants refresh their menus.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {items.length > 0 && `Showing ${items.length} dishes`}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {items.map((item) => (
                <Card
                  key={item.food_id}
                  className="overflow-hidden bg-white border border-gray-100 hover:border-orange-200 hover:shadow-xs transition-all duration-200 m-0 p-0"
                >
                  <div className="relative h-40 sm:h-48 bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.food_name}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No image available
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge className="bg-white/90 text-orange-600">
                        Rs.{item.price}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${item.isVeg
                          ? "border-green-200 bg-green-600 text-white"
                          : "border-red-200 bg-red-600 text-white"
                          }`}
                      >
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-2 sm:space-y-3">
                    <div className="space-y-2">
                      <Link
                        href={`/food/${item.food_id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1"
                      >
                        {item.food_name}
                      </Link>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description?.trim() || "No description available."}
                      </p>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-orange-200 text-orange-600 capitalize"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Link
                        href={`/restaurant/${item.restaurant.restaurant_id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors"
                      >
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white border border-gray-200">
                          <Image
                            src={
                              item.restaurant.logo ||
                              "https://images.unsplash.com/photo-1555992336-cbf3b0ff70cb?w=128&h=128&fit=crop"
                            }
                            alt={item.restaurant.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.restaurant.name}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-orange-500" />
                            <span className="truncate">
                              {item.restaurant.address || "Address not available"}
                            </span>
                          </p>
                        </div>
                      </Link>

                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        Updated recently
                      </div>
                    </div>

                    <AddToCartButton
                      foodItem={{
                        _id: item.food_id,
                        name: item.food_name,
                        price: item.price,
                        image: item.image,
                        isVeg: item.isVeg,
                        restaurantId: item.restaurant.restaurant_id,
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasNextPage && (
              <div className="text-center mt-10">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more dishes"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FoodShowcase;

