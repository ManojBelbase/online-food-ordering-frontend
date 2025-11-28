import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/api/order";
import { toaster } from "@/utils/toast/toast";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      
      toaster({ 
        message: "Order placed successfully!", 
        icon: "success",
        title: "Order Confirmed"
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to place order";
      toaster({ message, icon: "error", title: "Order Failed" });
    },
  });
};

export const useUserOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  restaurantId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderApi.getUserOrders(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const useUserOrderCounts = () => {
  return useQuery({
    queryKey: ["orderCounts"],
    queryFn: () => orderApi.getUserOrderCounts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}; 