declare namespace Order {
  interface IOrderItem {
    foodItemId: string;
    name: string;
    quantity: number;
    priceAtTime: number;
    image?: string;
    isVeg?: boolean;
    notes?: string;
  }

  interface IRestaurantInfo {
    _id: string;
    restaurantName: string;
    cuisineType: string;
  }

  interface IOrder {
    _id: string;
    userId: string;
    restaurantId: string | IRestaurantInfo;
    items: IOrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    contactPhone?: string;
    orderStatus: "pending" | "accepted" | "preparing" | "ready" | "cancelled" | "completed";
    paymentMethod: "COD" | "Khalti";
    paymentStatus: "pending" | "completed" | "failed";
    paymentTransactionId?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }

  interface CreateOrderRequest {
    restaurantId: string;
    items: {
      foodItemId: string;
      quantity: number;
      notes?: string;
    }[];
    deliveryAddress: string;
    paymentMethod: "COD" | "Khalti";
    contactPhone?: string;
    paymentTransactionId?: string;
  }

  interface CreateOrderResponse {
    success: boolean;
    data: IOrder;
  }

  interface GetUserOrdersResponse {
    success: boolean;
    data: IOrder[];
  }
} 