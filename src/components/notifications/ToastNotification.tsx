import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Clock, Truck, Package } from 'lucide-react';
import { INotification, NotificationType, NotificationStatus } from '@/types/notification';

interface ToastNotificationProps {
  notification: INotification;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
}

const ToastNotification = ({ notification, onClose, onMarkAsRead }: ToastNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast after a brief delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-hide after 5 seconds
    const autoHideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoHideTimer);
    };
  }, [onClose]);

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "h-5 w-5";
    
    switch (type) {
      case NotificationType.ORDER_CONFIRMED:
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case NotificationType.ORDER_COOKING:
        return <Clock className={`${iconClass} text-blue-500`} />;
      case NotificationType.ORDER_OUT_FOR_DELIVERY:
        return <Truck className={`${iconClass} text-purple-500`} />;
      case NotificationType.ORDER_DELIVERED:
        return <Package className={`${iconClass} text-green-600`} />;
      case NotificationType.ORDER_CANCELLED:
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case NotificationType.ORDER_STATUS_UPDATE:
        return <Clock className={`${iconClass} text-blue-500`} />;
      default:
        return <AlertCircle className={`${iconClass} text-orange-500`} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_CONFIRMED:
      case NotificationType.ORDER_DELIVERED:
        return 'border-green-500 bg-green-50';
      case NotificationType.ORDER_COOKING:
      case NotificationType.ORDER_STATUS_UPDATE:
        return 'border-blue-500 bg-blue-50';
      case NotificationType.ORDER_OUT_FOR_DELIVERY:
        return 'border-purple-500 bg-purple-50';
      case NotificationType.ORDER_CANCELLED:
        return 'border-red-500 bg-red-50';
      default:
        return 'border-orange-500 bg-orange-50';
    }
  };

  const handleMarkAsRead = () => {
    if (notification.status === NotificationStatus.UNREAD) {
      onMarkAsRead(notification._id);
    }
    onClose();
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-80 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-lg border-l-4 shadow-lg ${getNotificationColor(notification.type)}`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              {notification.status === NotificationStatus.UNREAD && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                >
                  Mark as read
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
