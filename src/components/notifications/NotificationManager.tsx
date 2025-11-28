import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { INotification } from '@/types/notification';
import NotificationDropdown from './NotificationDropdown';
import ToastNotification from './ToastNotification';

const NotificationManager = () => {
  const { notifications, markAsRead } = useNotifications();
  const [toastNotifications, setToastNotifications] = useState<INotification[]>([]);
  const [shownNotificationIds, setShownNotificationIds] = useState<Set<string>>(new Set());

  // Show toast for new unread notifications
  useEffect(() => {
    if (!Array.isArray(notifications)) return;
    
    const newUnreadNotifications = notifications.filter(
      notification => 
        notification.status === 'UNREAD' && 
        !shownNotificationIds.has(notification._id)
    );

    if (newUnreadNotifications.length > 0) {
      // Mark these as shown
      setShownNotificationIds(prev => {
        const newSet = new Set(prev);
        newUnreadNotifications.forEach(n => newSet.add(n._id));
        return newSet;
      });
      
      // Add to toast notifications
      setToastNotifications(prev => [...prev, ...newUnreadNotifications]);
    }
  }, [notifications, shownNotificationIds]);

  // Clean up shown notifications when notifications array changes significantly
  useEffect(() => {
    if (!Array.isArray(notifications)) return;
    
    // Keep only IDs that still exist in current notifications
    setShownNotificationIds(prev => {
      const currentIds = new Set(notifications.map(n => n._id));
      return new Set([...prev].filter(id => currentIds.has(id)));
    });
  }, [notifications]);

  const handleCloseToast = (notificationId: string) => {
    setToastNotifications(prev => prev.filter(toast => toast._id !== notificationId));
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    handleCloseToast(notificationId);
  };

  return (
    <>
      <NotificationDropdown />
      
      {/* Toast Notifications */}
      {toastNotifications.map((notification) => (
        <ToastNotification
          key={notification._id}
          notification={notification}
          onClose={() => handleCloseToast(notification._id)}
          onMarkAsRead={handleMarkAsRead}
        />
      ))}
    </>
  );
};

export default NotificationManager;
