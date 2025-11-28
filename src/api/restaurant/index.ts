import { makeRequest } from "@/makeRequest";

export async function fetchRestaurants() {
  try {
    const res = await makeRequest({
      url: "restaurant",
      method: "GET",
    });

    return res.data?.restaurant || res.data || [];
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}

export async function getRestaurantMenu(id: string) {
  const res = await makeRequest({
    url: `restaurant/${id}/menu`,
    method: "GET",
  });
  return res.data?.restaurantMenu || res.data || [];
}

export async function fetchRestaurantById(id: string) {
  try {
    const res = await makeRequest({
      url: `restaurant/${id}`,
      method: "GET",
    });

    return res.data?.restaurant || res.data;
  } catch (error) {
    console.error(`Error fetching restaurant ${id}:`, error);
    throw error;
  }
}
