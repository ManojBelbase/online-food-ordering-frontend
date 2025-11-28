"use client";

import { FoodItemCard } from "./FoodItemCard";

interface CategorySectionProps {
  category: Restaurant.IMenuCategory;
  restaurantId: string;
  onImageClick: (imageUrl: string) => void;
}

export const CategorySection = ({ category, restaurantId, onImageClick }: CategorySectionProps) => {
  return (
    <div className="mb-12">
      {/* Category Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.name}</h3>
        <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-3"></div>
        <p className="text-gray-600">{category.foodItems.length} delicious items to choose from</p>
      </div>

      {/* Food Items */}
      <div className="space-y-6">
        {category.foodItems.map((item: Restaurant.IFoodItem) => (
          <FoodItemCard
            key={item._id}
            item={item}
            restaurantId={restaurantId}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
};
