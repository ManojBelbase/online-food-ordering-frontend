import { makeRequest } from "@/makeRequest";


export const orderApi = {
  createOrder: async (data: Order.CreateOrderRequest): Promise<Order.CreateOrderResponse> => {
    const response = await makeRequest.post("/order", data);
    return response.data;
  },

  getUserOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    restaurantId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<Order.GetUserOrdersResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.restaurantId) queryParams.append('restaurantId', params.restaurantId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/order/user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await makeRequest.get(url);
    return response.data;
  },

  getUserOrderCounts: async (): Promise<{
    success: boolean;
    data: {
      total: number;
      byStatus: {
        pending: number;
        accepted: number;
        preparing: number;
        ready: number;
        completed: number;
        cancelled: number;
      };
    };
  }> => {
    const response = await makeRequest.get("/order/user/counts");
    return response.data;
  },
}; 