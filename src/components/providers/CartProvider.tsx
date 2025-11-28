"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCart } from "@/hooks/cart/useCart";
import { setCart, clearCart } from "@/features/cart/cartSlice";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/features/auth/selectors";

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: cart, isLoading, error } = useCart();

  useEffect(() => {
    console.log("CartProvider - isAuthenticated:", isAuthenticated);
    console.log("CartProvider - cart data:", cart);
    console.log("CartProvider - isLoading:", isLoading);
    console.log("CartProvider - error:", error);

    if (isAuthenticated) {
      if (cart) {
        console.log("CartProvider - dispatching setCart:", cart);
        // Extract just the cart data from the API response
        const cartData = (cart as Cart.ApiResponse<Cart.ICart>).cart || cart;
        dispatch(setCart(cartData));
      } else if (!isLoading && !error) {
        console.log("CartProvider - dispatching clearCart");
        dispatch(clearCart());
      }
    } else {
      // If not authenticated, clear cart
      dispatch(clearCart());
    }
  }, [cart, isLoading, error, dispatch, isAuthenticated]);

  return <>{children}</>;
}; 