import { makeRequest } from "@/makeRequest";

export async function fetchCategories(restaurantId: string) {
  try {
    const res = await makeRequest.get("categories", {
      params: {
        restaurantId,
      },
    });

    return res.data?.categories || res.data || [];
  } catch (error) {
    console.error("Error fetching Categories:", error);
    return [];
  }
}
