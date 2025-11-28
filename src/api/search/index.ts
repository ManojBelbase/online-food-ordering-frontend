import { makeRequest } from "@/makeRequest";

interface SearchRequest {
  query: string;
  type?: "food" | "category" | "restaurant" | "all";
  limit?: number;
}

type RawSearchResult = {
  food_id: string;
  restaurant_id: string;
  category_id: string | null;
  restaurant_name: string;
  category_name: string | null;
  food_name: string;
  price: number;
  description: string;
  image?: string;
  matched_on?: string[];
};

export async function searchFoodItems({
  query,
  type = "all",
  limit = 20,
}: SearchRequest): Promise<Search.Result[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  try {
    const response = await makeRequest.get("search", {
      params: {
        q: trimmedQuery,
        type,
        limit: Math.min(Math.max(limit, 1), 100),
      },
    });

    const rawResults: RawSearchResult[] = response.data || [];

    return rawResults.map((item) => ({
      foodId: item.food_id,
      restaurantId: item.restaurant_id,
      categoryId: item.category_id,
      restaurantName: item.restaurant_name,
      categoryName: item.category_name,
      foodName: item.food_name,
      price: item.price,
      description: item.description,
      image: item.image,
      matchedOn: item.matched_on ?? [],
    }));
  } catch (error) {
    console.error("Error searching food items:", error);
    throw error;
  }
}

