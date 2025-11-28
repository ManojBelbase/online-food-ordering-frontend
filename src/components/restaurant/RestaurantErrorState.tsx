"use client";

import { ChefHat } from "lucide-react";

interface RestaurantErrorStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export const RestaurantErrorState = ({ title, message, icon }: RestaurantErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {icon || <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h2>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};
