import { useQuery } from "@tanstack/react-query";
import { fetchRestaurants, getRestaurantMenu } from "@/api/restaurant";

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurant"],
    queryFn: fetchRestaurants,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurantMenu(id: string) {
  return useQuery({
    queryKey: ["restaurant-menu", id],
    queryFn: () => getRestaurantMenu(id),
  });
}
