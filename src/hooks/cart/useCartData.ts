import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useCartData = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const isLoading = useSelector((state: RootState) => state.cart.isLoading);
  const error = useSelector((state: RootState) => state.cart.error);

  const items = cart?.items || [];
  const itemCount = items.length;
  const totalQuantity = items.reduce((total: number, item: Cart.ICartItem) => total + item.quantity, 0);
  const totalPrice = items.reduce((total: number, item: Cart.ICartItem) => total + (item.priceAtTime * item.quantity), 0);
  const restaurantId = cart?.restaurantId || null;

  const getItemById = (itemId: string) => {
    return items.find((item: Cart.ICartItem) => {
      const itemIdToCompare = typeof item.foodItemId === 'string' 
        ? item.foodItemId 
        : item.foodItemId._id;
      return itemIdToCompare === itemId;
    });
  };

  const isItemInCart = (itemId: string): boolean => {
    return items.some((item: Cart.ICartItem) => {
      const itemIdToCompare = typeof item.foodItemId === 'string' 
        ? item.foodItemId 
        : item.foodItemId._id;
      return itemIdToCompare === itemId;
    });
  };

  return {
    cart,
    items,
    itemCount,
    totalQuantity,
    totalPrice,
    restaurantId,
    isLoading,
    error,
    getItemById,
    isItemInCart,
  };
}; 