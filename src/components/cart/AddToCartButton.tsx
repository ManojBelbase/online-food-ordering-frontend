"use client";

import { useState } from "react";
import { useAddToCart } from "@/hooks/cart/useCart";
import { useSelector } from "react-redux";
import { selectCartRestaurantId, selectCartItemById } from "@/features/cart/selectors";
import { selectIsAuthenticated } from "@/features/auth/selectors";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Plus, Minus, AlertTriangle } from "lucide-react";
import { toaster } from "@/utils/toast/toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface AddToCartButtonProps {
  foodItem: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    isVeg?: boolean;
    restaurantId: string;
  };
}

export const AddToCartButton = ({ foodItem }: AddToCartButtonProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const addToCartMutation = useAddToCart();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentRestaurantId = useSelector(selectCartRestaurantId);
  const existingCartItem = useSelector((state: RootState) => selectCartItemById(state, foodItem._id));

  const handleAddToCart = () => {
    // Check if cart is from different restaurant
    if (currentRestaurantId && currentRestaurantId !== foodItem.restaurantId) {
      toaster({
        message: "Your cart contains items from a different restaurant. Adding this item will clear your current cart.",
        icon: "warning",
        title: "Different Restaurant"
      });
    }

    addToCartMutation.mutate({
      foodItemId: foodItem._id,
      quantity,
    }, {
      onSuccess: () => {
        setShowModal(false);
        setQuantity(1);
      }
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      toaster({
        message: "Please login to add items to cart",
        icon: "warning",
        title: "Authentication Required"
      });
      router.push("/login");
      return;
    }
    setShowModal(true);
  };

  const isInCart = existingCartItem !== undefined;

  return (
    <>
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogTrigger asChild>
          <Button
            onClick={handleAddToCartClick}
            disabled={addToCartMutation.isPending}
            className={`px-6 py-2 transition-all duration-200 font-medium shadow-xs hover:shadow-xs transform hover:scale-105 active:scale-95 cursor-pointer ${isInCart
              ? "bg-green-500 hover:bg-green-600 text-white text-sm"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm"
              }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCart ? `In Cart (${existingCartItem?.quantity || 0})` : "Add to Cart"}
          </Button>
        </AlertDialogTrigger>

        {/* Professional Dialog Modal */}
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800">Add to Cart</AlertDialogTitle>
            <AlertDialogDescription>
              Customize your order and add it to your cart
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Food Item Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={foodItem.image || "/placeholder.svg"}
                alt={foodItem.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm">{foodItem.name}</h4>
              <p className="text-orange-600 font-bold text-lg">Rs.{foodItem.price}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Quantity
            </Label>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 p-0 cursor-pointer rounded-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="w-10 h-10 p-0 cursor-pointer rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Restaurant Warning */}
          {currentRestaurantId && currentRestaurantId !== foodItem.restaurantId && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Different Restaurant</p>
                  <p>Adding this item will clear your current cart from another restaurant.</p>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Total:</span>
              <span className="text-xl font-bold text-orange-600">
                Rs.{foodItem.price * quantity}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 cursor-pointer"
            >
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 