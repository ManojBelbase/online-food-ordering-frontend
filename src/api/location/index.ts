import { makeRequest } from "@/makeRequest";

export async function fetchNearbyRestaurants(
  latitude: number,
  longitude: number
) {
  const res = await makeRequest({
    url: `restaurant/find/nearby?latitude=${latitude}&longitude=${longitude}`,
    method: "GET",
  });
  return res.data.nearbyRestaurants;
}
