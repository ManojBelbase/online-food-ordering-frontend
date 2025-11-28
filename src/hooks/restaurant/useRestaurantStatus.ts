import { useMemo } from "react";

export const useRestaurantStatus = (restaurant: Restaurant.IRestaurant | undefined) => {
  return useMemo(() => {
    if (!restaurant) return { isOpen: false, status: "Closed" };
    
    const { manualOverride, weeklySchedule } = restaurant;
    
    if (manualOverride.isManuallySet) {
      return {
        isOpen: manualOverride.isOpen,
        status: manualOverride.isOpen ? "Open" : "Closed"
      };
    }
    
    // Check current day schedule
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todaySchedule = weeklySchedule[today];
    
    if (!todaySchedule || todaySchedule.isClosed) {
      return { isOpen: false, status: "Closed" };
    }
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseInt(todaySchedule.open.split(':')[0]) * 60 + parseInt(todaySchedule.open.split(':')[1]);
    const closeTime = parseInt(todaySchedule.close.split(':')[0]) * 60 + parseInt(todaySchedule.close.split(':')[1]);
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return {
      isOpen,
      status: isOpen ? "Open" : "Closed"
    };
  }, [restaurant]);
};
