import { makeRequest } from "@/makeRequest";

export const cartApi = {
  addToCart: async (data: Cart.AddToCartRequest): Promise<Cart.AddToCartResponse> => {
    const response = await makeRequest.post("/cart/add", data);
    return response.data;
  },

  getCart: async (): Promise<Cart.ICart> => {
    const response = await makeRequest.get("/cart");
    return response.data;
  },

  updateCartItem: async (itemId: string, data: { quantity: number; notes?: string }): Promise<Cart.ICart> => {
    const response = await makeRequest.patch(`/cart/items/${itemId}`, data);
    return response.data;
  },

  removeFromCart: async (itemId: string): Promise<Cart.ICart> => {
    const response = await makeRequest.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<{ message: string }> => {
    const response = await makeRequest.delete("/cart");
    return response.data;
  },
}; 