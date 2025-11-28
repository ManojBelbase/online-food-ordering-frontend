"use client";
import { useSelector } from "react-redux";
import { selectUserId, selectUser, selectAuth } from "@/features/auth/selectors";
import OrderNotificationListener from "@/components/OrderNotificationListener";

export function OrderNotificationProvider() {
  const userId = useSelector(selectUserId);
  const user = useSelector(selectUser);
  const auth = useSelector(selectAuth);

  console.log("[DEBUG] OrderNotificationProvider render");
  console.log("[DEBUG] Full auth state:", auth);
  console.log("[DEBUG] User object:", user);
  console.log("[DEBUG] UserId from selector:", userId);

  if (!userId) {
    console.log("[DEBUG] No userId, returning null");
    return null;
  }

  console.log("[DEBUG] Rendering OrderNotificationListener with userId:", userId);
  return (
    <OrderNotificationListener 
      userId={userId}
      onStatusChange={(orderId, status) => {
        console.log(`Order ${orderId} status: ${status}`);
      }}
    />
  );
}
