"use client";
import { useEffect, useRef } from "react";
import { ref, query, orderByChild, equalTo, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { toaster } from "@/utils/toast/toast";

interface Props {
  userId: string;
  onStatusChange?: (orderId: string, status: string) => void;
}

interface OrderData {
  [orderId: string]: {
    userId: string;
    orderStatus?: string;
    status?: string;
    [key: string]: unknown;
  };
}

export default function OrderNotificationListener({ userId, onStatusChange }: Props) {
  const previousDataRef = useRef<OrderData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element for notification sound
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    audioRef.current = {
      play: () => {
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        return Promise.resolve();
      }
    } as HTMLAudioElement;
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  useEffect(() => {
    console.log("[DEBUG listener] mounted, received userId:", userId);
    if (!userId) {
      console.log("[DEBUG listener] No userId provided, exiting");
      return;
    }

    const trimmed = String(userId).trim();
    console.log("[DEBUG listener] trimmed userId:", JSON.stringify(trimmed));

    // First, let's check what's in the orders node
    const ordersRef = ref(database, "orders");
    console.log("[DEBUG listener] ordersRef:", ordersRef);

    const q = query(ordersRef, orderByChild("userId"), equalTo(trimmed));
    console.log("[DEBUG listener] created query:", q);

    const unsub = onValue(q, (snapshot) => {
      console.log("[DEBUG listener] 🔥 Firebase triggered!");
      console.log("[DEBUG listener] snapshot.exists:", snapshot.exists());
      console.log("[DEBUG listener] snapshot.val():", snapshot.val());
      
      if (!snapshot.exists()) {
        console.log("[DEBUG listener] No orders found for userId:", trimmed);
        return;
      }

      const currentData = snapshot.val();
      console.log("[DEBUG listener] Found orders, processing...");
      
      // Check for status changes by comparing with previous data
      if (previousDataRef.current) {
        Object.keys(currentData).forEach(orderId => {
          const currentOrder = currentData[orderId];
          const previousOrder = previousDataRef.current![orderId];
          
          if (previousOrder) {
            const currentStatus = currentOrder.orderStatus || currentOrder.status;
            const previousStatus = previousOrder.orderStatus || previousOrder.status;
            
            // Check if status changed
            if (currentStatus && previousStatus && currentStatus !== previousStatus) {
              console.log(`[DEBUG listener] 🎉 Status changed for order ${orderId}: ${previousStatus} → ${currentStatus}`);
              
              // Play notification sound
              playNotificationSound();
              
              // Get status-specific messages
              const statusMessages = {
                pending: "Your order has been placed and is waiting for confirmation",
                accepted: "Great! Your order has been accepted by the restaurant",
                preparing: "Your order is being prepared in the kitchen",
                ready: "Your order is ready and will be delivered soon!",
                completed: "Your order has been delivered successfully!",
                cancelled: "Your order has been cancelled"
              };
              
              const message = statusMessages[currentStatus as keyof typeof statusMessages] || `Order status updated to: ${currentStatus}`;
              
              // Show enhanced toaster notification - clickable to go to orders page
              toaster({
                message: message,
                icon: currentStatus === 'cancelled' ? "error" : "success",
                title: `Order #${orderId.slice(-6)} Update`,
                duration: 8000,
                action: {
                  label: "View Order",
                  onClick: () => {
                    // Navigate to orders page when action button is clicked
                    window.location.href = '/orders';
                  }
                }
              });
              
              // Call callback if provided
              if (onStatusChange) {
                console.log(`[DEBUG listener] Calling onStatusChange with:`, orderId, currentStatus);
                onStatusChange(orderId, currentStatus);
              }
            }
          }
        });
      }
      
      // Store current data for next comparison
      previousDataRef.current = currentData;
      
      // Also process current data for initial load
      snapshot.forEach((child) => {
        const id = child.key!;
        const data: OrderData[string] = child.val();
        console.log(`[DEBUG listener] child ${id}:`, data);
        const status = data?.status ?? data?.orderStatus ?? null;
        console.log(`[DEBUG listener] normalized status for ${id}:`, status);
        
        if (onStatusChange && status) {
          console.log(`[DEBUG listener] Initial status for ${id}:`, status);
          onStatusChange(id, status);
        }
      });
    }, (err) => {
      console.error("[DEBUG listener] onValue error:", err);
    });

    // Also listen to the entire orders node to see what's there
    const allOrdersUnsub = onValue(ordersRef, (snapshot) => {
      const allData = snapshot.val();
      console.log("[DEBUG listener] 🔍 All orders in database:", allData);
      
      if (allData) {
        // Check if our userId exists anywhere
        const hasOurUserId = Object.values(allData).some((order) => {
          if (typeof order === 'object' && order !== null && 'userId' in order) {
            return (order as { userId: string }).userId === trimmed;
          }
          return false;
        });
        console.log("[DEBUG listener] Does our userId exist in any order?", hasOurUserId);
      }
    });

    return () => {
      console.log("[DEBUG listener] unsubscribing for userId:", trimmed);
      unsub();
      allOrdersUnsub();
    };
  }, [userId, onStatusChange]);

  return null;
}
