"use client";
import { ReactNode, useCallback } from 'react';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useFirebaseNotifications } from '@/hooks/notifications/useFirebaseNotifications';
import { INotification } from '@/types/notification';

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { addNotification, updateNotification } = useNotifications();

  const handleNotificationReceived = useCallback((notification: INotification) => {
    console.log('Firebase notification received:', notification._id, notification.title, notification.type);
    addNotification(notification);
  }, [addNotification]);

  const handleNotificationUpdated = useCallback((notificationId: string, updates: Partial<INotification>) => {
    updateNotification(notificationId, updates);
  }, [updateNotification]);

  const handleNotificationRemoved = useCallback((notificationId: string) => {
    // Handle notification removal if needed
    console.log('Notification removed:', notificationId);
  }, []);

  // Initialize Firebase listeners
  useFirebaseNotifications({
    onNotificationReceived: handleNotificationReceived,
    onNotificationUpdated: handleNotificationUpdated,
    onNotificationRemoved: handleNotificationRemoved
  });

  return <>{children}</>;
};

export default NotificationProvider;
