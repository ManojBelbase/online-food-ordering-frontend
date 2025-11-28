export interface INotification {
  _id: string;
  userId: string;
  restaurantId?: string;
  orderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  metadata?: Record<string, unknown>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_COOKING = 'ORDER_COOKING',
  ORDER_OUT_FOR_DELIVERY = 'ORDER_OUT_FOR_DELIVERY',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_STATUS_UPDATE = 'ORDER_STATUS_UPDATE',
  DELIVERY_ASSIGNED = 'DELIVERY_ASSIGNED'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD'
}

export interface CreateNotificationDto {
  userId: string;
  restaurantId?: string;
  orderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
}

export interface UpdateNotificationDto {
  status?: NotificationStatus;
  readAt?: Date;
}

export interface NotificationResponse {
  success: boolean;
  data: INotification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: { unreadCount: number };
}
