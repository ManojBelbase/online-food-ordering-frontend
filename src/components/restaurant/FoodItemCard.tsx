"use client";

import Image from "next/image";

import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface FoodItemCardProps {
  item: {
    _id: string;
    name: string;
    image: string;
    price: number;
    isVeg: boolean;
    description: string;
    restaurantId: string;
  };
  restaurantId: string;
  onImageClick: (imageUrl: string) => void;
}

export const FoodItemCard = ({ item, restaurantId, onImageClick }: FoodItemCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs hover:shadow-xs transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="flex flex-col md:flex-row">
        {/* Food Item Image */}
        <div className="w-full md:w-48 h-48 md:h-48 relative flex-shrink-0 cursor-pointer group-hover:scale-101 transition-transform duration-300">
          <Image
            src={item.image || "/placeholder.svg?height=192&width=192&query=delicious food dish"}
            alt={item.name}
            fill
            className="object-cover h-full"
            onClick={() => onImageClick(item.image || "/placeholder.svg")}
          />
          {/* Veg/Non-veg indicator overlay */}
          <div className="absolute top-3 left-3">
            <div
              className={`w-6 h-6 border-2 flex items-center justify-center rounded-full bg-white/90 ${item.isVeg ? "border-green-500" : "border-red-500"
                }`}
            >
              {item.isVeg ? (
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              )}
            </div>
          </div>
        </div>

        {/* Food Item Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
              {item.name}
            </h4>

            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {item.description}
            </p>

            <div className="text-2xl flex items-center justify-between font-bold text-orange-600 ">
              <span>
                Rs.{item.price}
              </span>
              <div className="flex justify-center">
                <AddToCartButton
                  foodItem={{
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    isVeg: item.isVeg,
                    restaurantId: restaurantId,
                  }}
                />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
