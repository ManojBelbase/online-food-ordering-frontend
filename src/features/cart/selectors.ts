import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectCart = createSelector(
  [(state: RootState) => state.cart.cart],
  (cart) => {
    return cart;
  }
);
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;

export const selectCartItems = createSelector(
  [(state: RootState) => state.cart.cart?.items],
  (items) => {
    return items || [];
  }
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.length
);

export const selectCartTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((total: number, item: Cart.ICartItem) => total + (item.quantity || 0), 0)
);

export const selectCartTotalPrice = createSelector(
  [selectCartItems],
  (items) => items.reduce((total: number, item: Cart.ICartItem) => total + ((item.priceAtTime || 0) * (item.quantity || 0)), 0)
);

export const selectCartRestaurantId = createSelector(
  [(state: RootState) => state.cart.cart?.restaurantId],
  (restaurantId) => restaurantId || null
);

export const selectCartItemById = createSelector(
  [selectCartItems, (_state: RootState, itemId: string) => itemId],
  (items, itemId) => {
    return items.find((item: Cart.ICartItem) => {
      const itemIdToCompare = typeof item.foodItemId === 'string'
        ? item.foodItemId
        : item.foodItemId?._id;
      return itemIdToCompare === itemId;
    });
  }
); 