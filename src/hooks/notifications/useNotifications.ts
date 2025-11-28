import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/features/auth/selectors';
import { notificationsApi } from '@/api/notifications';
import { INotification, NotificationStatus } from '@/types/notification';

export const useNotifications = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsApi.getUserNotifications();
    
      // Set notifications directly since API now returns the array
      setNotifications(response);
      console.log('State updated, notifications should now be:', response);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await notificationsApi.getUnreadCount();
      console.log('Fetched unread count:', response);
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, status: NotificationStatus.READ, readAt: new Date() }
            : notification
        );
      });
      setUnreadCount(prev => {
        if (typeof prev !== 'number') return 0;
        return Math.max(0, prev - 1);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(notification => ({
          ...notification,
          status: NotificationStatus.READ,
          readAt: new Date()
        }));
      });
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.deleteNotification(notificationId);
      setNotifications(prev => {
        if (!Array.isArray(prev)) return [];
        const filtered = prev.filter(n => n._id !== notificationId);
        // Update unread count if the deleted notification was unread
        const deletedNotification = prev.find(n => n._id === notificationId);
        if (deletedNotification?.status === NotificationStatus.UNREAD) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        return filtered;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  }, []);

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification: INotification) => {
    setNotifications(prev => {
      if (!Array.isArray(prev)) {
        return [notification];
      }
      // De-duplicate by _id and move latest to top
      const existingIndex = prev.findIndex(n => n._id === notification._id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...notification };
        // Move updated item to top to reflect recency
        const [item] = updated.splice(existingIndex, 1);
        return [item, ...updated];
      }
      return [notification, ...prev];
    });
    
    if (notification.status === NotificationStatus.UNREAD) {
      setUnreadCount(prev => {
        // Ensure prev is a number
        if (typeof prev !== 'number') {
          return 1;
        }
        return prev + 1;
      });
    }
  }, []);

  // Update notification (for real-time updates)
  const updateNotification = useCallback((notificationId: string, updates: Partial<INotification>) => {
    setNotifications(prev => {
      if (!Array.isArray(prev)) return [];
      return prev.map(notification => 
        notification._id === notificationId 
          ? { ...notification, ...updates }
          : notification
      );
    });
  }, []);

  // Initial fetch with debouncing
  useEffect(() => {
    if (isAuthenticated) {
      // Add a small delay to prevent multiple rapid calls
      const timer = setTimeout(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    updateNotification
  };
};
