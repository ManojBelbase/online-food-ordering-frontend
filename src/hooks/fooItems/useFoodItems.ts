import { fetchFoodItems } from "@/api/foodItems";
import { useQuery } from "@tanstack/react-query";

export function useFetchFoodItems(restaurantId?: string, categoryId?: string) {
  return useQuery({
    queryKey: ["food-items", restaurantId, categoryId],
    queryFn: () => fetchFoodItems(restaurantId, categoryId),
  });
}
