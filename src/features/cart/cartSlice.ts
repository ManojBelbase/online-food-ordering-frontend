import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  cart: Cart.ICart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart.ICart>) => {
      console.log("cartSlice - setCart called with:", action.payload);
      state.cart = action.payload;
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateCartItem: (state, action: PayloadAction<{ itemId: string; quantity: number; notes?: string }>) => {
      if (state.cart) {
        const { itemId, quantity, notes } = action.payload;
        const itemIndex = state.cart.items.findIndex((item: Cart.ICartItem) => {
          const itemIdToCompare = typeof item.foodItemId === 'string' 
            ? item.foodItemId 
            : item.foodItemId._id;
          return itemIdToCompare === itemId;
        });
        
        if (itemIndex !== -1) {
          state.cart.items[itemIndex].quantity = quantity;
          if (notes !== undefined) {
            state.cart.items[itemIndex].notes = notes;
          }
        }
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter((item: Cart.ICartItem) => {
          const itemIdToCompare = typeof item.foodItemId === 'string' 
            ? item.foodItemId 
            : item.foodItemId._id;
          return itemIdToCompare !== action.payload;
        });
      }
    },
  },
});

export const { setCart, clearCart, setLoading, setError, updateCartItem, removeCartItem } = cartSlice.actions;
export default cartSlice.reducer; 