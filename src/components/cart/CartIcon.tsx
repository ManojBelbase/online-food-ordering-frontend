"use client";

import { useSelector } from "react-redux";
import { selectCartItemCount, selectCartTotalPrice } from "@/features/cart/selectors";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export const CartIcon = () => {
  const itemCount = useSelector(selectCartItemCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  return (
    <Link href="/cart" className="relative group">
      <div className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
        <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" />

        {/* Cart Badge */}
        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount > 99 ? "99+" : itemCount}
          </div>
        )}
      </div>

      {/* Tooltip */}
      {itemCount > 0 && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="text-sm font-medium text-gray-800 mb-1">
            Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </div>
          <div className="text-sm text-gray-600">
            Total: Rs.{totalPrice.toFixed(2)}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Click to view cart
          </div>
        </div>
      )}
    </Link>
  );
}; 