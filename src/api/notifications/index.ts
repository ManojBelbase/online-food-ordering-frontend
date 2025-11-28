import { makeRequest } from '@/makeRequest';
import { 
  UnreadCountResponse, 
  INotification
} from '@/types/notification';

const BASE_URL = '/notifications';

export const notificationsApi = {
  // Get user notifications
  getUserNotifications: async (limit: number = 50, page: number = 1): Promise<INotification[]> => {
    const response = await makeRequest(`${BASE_URL}/user?limit=${limit}&page=${page}`);
    return response.data.data;
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return makeRequest(`${BASE_URL}/user/unread-count`);
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<{ success: boolean; data: INotification }> => {
    return makeRequest(`${BASE_URL}/user/${notificationId}/read`, {
      method: 'PATCH'
    });
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ success: boolean; data: { updatedCount: number } }> => {
    return makeRequest(`${BASE_URL}/user/mark-all-read`, {
      method: 'PATCH'
    });
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<{ success: boolean; message: string }> => {
    return makeRequest(`${BASE_URL}/user/${notificationId}`, {
      method: 'DELETE'
    });
  }
};
