declare namespace Cart {
  interface IFoodItem {
    _id: string;
    restaurantId: string;
    categoryId: string;
    description: string;
    cuisineType: string;
    image: string;
    name: string;
    isVeg: boolean;
    price: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface ICartItem {
    foodItemId: string | IFoodItem;
    name: string;
    quantity: number;
    priceAtTime: number;
    image?: string;
    isVeg?: boolean;
    notes?: string;
  }

  interface ICart {
    _id: string;
    userId: string;
    restaurantId: string;
    items: ICartItem[];
    createdAt?: string;
    updatedAt?: string;
    __v: number;
  }

  interface AddToCartRequest {
    foodItemId: string;
    quantity: number;
    notes?: string;
  }

  interface AddToCartResponse {
    message: string;
    cart: ICart;
  }

  // API Response wrapper
  interface ApiResponse<T> {
    message?: string;
    cart?: T;
    success?: boolean;
    data?: T;
  }
} 