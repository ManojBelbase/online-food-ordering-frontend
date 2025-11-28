import { fetchCategories } from "@/api/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories(restaurantId: string) {
  return useQuery({
    queryKey: ["categories", restaurantId],
    queryFn: () => fetchCategories(restaurantId),
    enabled: !!restaurantId,
  });
}
