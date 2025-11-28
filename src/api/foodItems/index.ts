import { makeRequest } from "@/makeRequest";

export async function fetchFoodItems(
  restaurantId?: string,
  categoryId?: string
) {
  try {
    const res = await makeRequest.get("food-items", {
      params: {
        restaurantId,
        categoryId,
      },
    });

    return res.data?.foodItems || res.data || [];
  } catch (error) {
    console.error("Error fetching Food Items:", error);
    return [];
  }
}

export async function fetchFoodItemById(foodId: string) {
  try {
    const res = await makeRequest.get(`food-item/${foodId}`);
    return res.data?.foodItem || res.data;
  } catch (error) {
    console.error(`Error fetching Food Item ${foodId}:`, error);
    throw error;
  }
}

type FoodItemsWithDetailsParams = {
  restaurantId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
};

export async function fetchFoodItemsWithDetails({
  restaurantId,
  categoryId,
  page = 1,
  limit = 20,
}: FoodItemsWithDetailsParams = {}): Promise<Food.WithDetailsResponse> {
  try {
    const res = await makeRequest.get("food-item/with-details", {
      params: {
        restaurantId,
        categoryId,
        page,
        limit,
      },
    });

    return res.data as Food.WithDetailsResponse;
  } catch (error) {
    console.error("Error fetching food items with details:", error);
    throw error;
  }
}
