"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Utensils,
  Clock,
  Star,
} from "lucide-react";

import { fetchFoodItemById } from "@/api/foodItems";
import { fetchRestaurantById } from "@/api/restaurant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type FoodItemDetail = Restaurant.IFoodItem & {
  cuisineType?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type FoodItemResponse = {
  message?: string;
  foodItem: FoodItemDetail;
};

type RestaurantResponse =
  | Restaurant.IRestaurant
  | { restaurant: Restaurant.IRestaurant };

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const FoodDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const foodId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return "";
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const {
    data: foodResponse,
    isLoading,
    isError,
  } = useQuery<FoodItemResponse | FoodItemDetail>({
    queryKey: ["food-item", foodId],
    queryFn: () => fetchFoodItemById(foodId),
    enabled: Boolean(foodId),
  });

  const food: FoodItemDetail | null = useMemo(() => {
    if (!foodResponse) return null;
    if ("foodItem" in foodResponse) {
      return foodResponse.foodItem;
    }
    return foodResponse;
  }, [foodResponse]);

  const {
    data: restaurantResponse,
    isLoading: isRestaurantLoading,
  } = useQuery<RestaurantResponse>({
    queryKey: ["restaurant", food?.restaurantId],
    queryFn: () => fetchRestaurantById(food!.restaurantId),
    enabled: Boolean(food?.restaurantId),
  });

  const restaurant: Restaurant.IRestaurant | null = useMemo(() => {
    if (!restaurantResponse) return null;
    if ("restaurantName" in restaurantResponse) {
      return restaurantResponse;
    }
    return restaurantResponse.restaurant;
  }, [restaurantResponse]);

  const createdAt = food?.createdAt
    ? new Date(food.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const tags = food?.tags ?? [];
  const priceLabel = food ? formatPrice(food.price) : null;

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      <p>Loading food details...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
        <Utensils className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">
        Food item not available
      </h2>
      <p className="text-gray-600 max-w-md">
        We couldn&apos;t find this food item. It might have been removed or is
        temporarily unavailable.
      </p>
      <Button asChild className="bg-orange-600 hover:bg-orange-700">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {food?.restaurantId && (
            <Button
              asChild
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <Link href={`/restaurant/${food.restaurantId}`}>
                Visit restaurant
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          renderLoadingState()
        ) : isError || !food ? (
          renderErrorState()
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white">
            <div className="relative h-72 sm:h-96">
              {food.image ? (
                <>
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 text-sm">
                  No image available
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-white/90 text-orange-600 uppercase tracking-wide">
                    {food.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                  </Badge>
                  {food.cuisineType && (
                    <Badge className="bg-white/80 text-gray-800 capitalize">
                      {food.cuisineType}
                    </Badge>
                  )}
                  {tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-white/80 text-gray-800 uppercase tracking-wide"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  {food.name}
                </h1>

                {priceLabel && (
                  <p className="text-xl font-semibold">{priceLabel}</p>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <h2 className="text-lg font-semibold text-gray-900">
                    About this dish
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {food.description?.trim() ||
                      "No description provided for this dish."}
                  </p>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tags.map((tag) => (
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

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-sm text-gray-600">
                    {createdAt && (
                      <div>
                        <dt className="uppercase tracking-wide text-xs text-gray-400">
                          Added on
                        </dt>
                        <dd>{createdAt}</dd>
                      </div>
                    )}
                    {food.updatedAt && (
                      <div>
                        <dt className="uppercase tracking-wide text-xs text-gray-400">
                          Last updated
                        </dt>
                        <dd>
                          {new Date(food.updatedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="uppercase tracking-wide text-xs text-gray-400">
                        Cuisine
                      </dt>
                      <dd className="capitalize">
                        {food.cuisineType || restaurant?.cuisineType || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="w-full max-w-sm">
                  <div className="rounded-2xl bg-orange-50/80 p-6 space-y-5">
                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-wide text-orange-600">
                        Ready to order?
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {priceLabel}
                      </p>
                    </div>

                    <AddToCartButton
                      foodItem={{
                        _id: food._id,
                        name: food.name,
                        price: food.price,
                        image: food.image,
                        isVeg: food.isVeg,
                        restaurantId: food.restaurantId,
                      }}
                    />

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Approx. delivery in 25-35 mins</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-orange-500" />
                      <span>Top choice among pizza lovers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Served by
                </h2>

                <div className="rounded-2xl bg-gray-50 p-6 sm:p-8">
                  {isRestaurantLoading ? (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fetching restaurant details...
                    </div>
                  ) : restaurant ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="space-y-2">
                        <Link
                          href={`/restaurant/${restaurant._id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                        >
                          {restaurant.restaurantName}
                        </Link>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          <span>{restaurant.address || "Address not available"}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <Badge className="bg-orange-100 text-orange-700">
                            {restaurant.cuisineType || "Restaurant"}
                          </Badge>
                          <Badge variant="outline" className="border-gray-200 text-gray-600">
                            License: {restaurant.licenseNumber || "N/A"}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="bg-orange-600 hover:bg-orange-700 px-6 py-3 text-sm font-semibold"
                      >
                        <Link href={`/restaurant/${restaurant._id}`}>
                          Explore full menu
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Restaurant details are not available right now.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetailPage;

