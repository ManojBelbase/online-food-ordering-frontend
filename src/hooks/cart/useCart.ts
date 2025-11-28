import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/api/cart";
import { toaster } from "@/utils/toast/toast";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/features/auth/selectors";

export const useCart = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: isAuthenticated, // Only run query if user is authenticated
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data) => {
      // Update cart cache
      queryClient.setQueryData(["cart"], data.cart);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toaster({ message: "Item added to cart successfully!", icon: "success" });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to add item to cart";
      toaster({ message, icon: "error" });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: { quantity: number; notes?: string } }) =>
      cartApi.updateCartItem(itemId, data),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
      // Removed success toast to avoid notifications during quantity changes
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to update cart item";
      toaster({ message, icon: "error" });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
      toaster({ message: "Item removed from cart!", icon: "success" });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to remove item from cart";
      toaster({ message, icon: "error" });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], null);
      toaster({ message: "Cart cleared successfully!", icon: "success" });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to clear cart";
      toaster({ message, icon: "error" });
    },
  });
}; 