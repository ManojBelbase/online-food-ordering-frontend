import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectUserId } from '@/features/auth/selectors';
import { database } from '@/lib/firebase';
import { ref, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';
import { INotification } from '@/types/notification';

interface UseFirebaseNotificationsProps {
  onNotificationReceived: (notification: INotification) => void;
  onNotificationUpdated: (notificationId: string, updates: Partial<INotification>) => void;
  onNotificationRemoved: (notificationId: string) => void;
}

export const useFirebaseNotifications = ({
  onNotificationReceived,
  onNotificationUpdated,
  onNotificationRemoved
}: UseFirebaseNotificationsProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userId = useAppSelector(selectUserId);
  const listenersRef = useRef<{ [key: string]: (() => void) }>({});
  const lastSignatureRef = useRef<Record<string, string>>({});
  const processedNotificationsRef = useRef<Set<string>>(new Set());
  const receivedCbRef = useRef(onNotificationReceived);
  const updatedCbRef = useRef(onNotificationUpdated);
  const removedCbRef = useRef(onNotificationRemoved);

  // Keep latest callbacks without retriggering the listener effect
  useEffect(() => {
    receivedCbRef.current = onNotificationReceived;
  }, [onNotificationReceived]);
  useEffect(() => {
    updatedCbRef.current = onNotificationUpdated;
  }, [onNotificationUpdated]);
  useEffect(() => {
    removedCbRef.current = onNotificationRemoved;
  }, [onNotificationRemoved]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      // Clean up existing listeners
      Object.values(listenersRef.current).forEach(unsubscribe => unsubscribe());
      listenersRef.current = {};
      return;
    }

    const notificationsRef = ref(database, `notifications/${userId}`);

    // Listen for granular child events to avoid re-processing the whole list
    const unsubscribeAdded = onChildAdded(notificationsRef, (snapshot) => {
      const notification = snapshot.val();
      if (!notification) return;

      const key = snapshot.key as string;
      
      // Skip if we've already processed this exact notification
      if (processedNotificationsRef.current.has(key)) {
        return;
      }
      
      // Build a signature to de-dup unchanged events
      const signature = `${notification.type}|${notification.title}|${notification.message}|${notification.status}|${notification.updatedAt}`;
      if (lastSignatureRef.current[key] === signature) {
        return;
      }
      
      // Mark as processed and store signature
      processedNotificationsRef.current.add(key);
      lastSignatureRef.current[key] = signature;

      const converted: INotification = {
        ...notification,
        _id: notification._id || snapshot.key,
        createdAt: new Date(notification.createdAt),
        updatedAt: new Date(notification.updatedAt),
        readAt: notification.readAt ? new Date(notification.readAt) : undefined,
      };
      receivedCbRef.current(converted);
    });

    const unsubscribeChanged = onChildChanged(notificationsRef, (snapshot) => {
      const notification = snapshot.val();
      if (!notification) return;

      const key = snapshot.key as string;
      
      // Only process if this is a real change (different signature)
      const signature = `${notification.type}|${notification.title}|${notification.message}|${notification.status}|${notification.updatedAt}`;
      if (lastSignatureRef.current[key] === signature) {
        return;
      }
      
      // Update signature for this notification
      lastSignatureRef.current[key] = signature;

      const updates: Partial<INotification> = {
        ...notification,
        updatedAt: new Date(notification.updatedAt),
        readAt: notification.readAt ? new Date(notification.readAt) : undefined,
      };
      updatedCbRef.current(snapshot.key as string, updates);
    });

    const unsubscribeRemoved = onChildRemoved(notificationsRef, (snapshot) => {
      removedCbRef.current(snapshot.key as string);
    });

    // Store listeners for cleanup
    listenersRef.current = {
      added: unsubscribeAdded,
      changed: unsubscribeChanged,
      removed: unsubscribeRemoved,
    };

    // Capture ref values for cleanup to avoid ESLint warning
    const currentProcessedRef = processedNotificationsRef.current;
    const currentLastSignatureRef = lastSignatureRef.current;

    // Cleanup function
    return () => {
      Object.values(listenersRef.current).forEach(unsubscribe => unsubscribe());
      listenersRef.current = {};
      // Reset processed notifications when cleaning up
      currentProcessedRef.clear();
      Object.keys(currentLastSignatureRef).forEach(key => delete currentLastSignatureRef[key]);
    };
  }, [isAuthenticated, userId]);

  return listenersRef.current;
};
