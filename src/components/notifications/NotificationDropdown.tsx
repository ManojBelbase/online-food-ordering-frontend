import { useState, useRef, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { Bell, Check, Trash2, X, Clock, AlertCircle, CheckCircle, Truck, Package } from 'lucide-react';
import { useNotifications } from '@/hooks/notifications/useNotifications';

import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);







  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent multiple calls using loading state
    if (loadingNotifications.has(notificationId)) return;
    
    setLoadingNotifications(prev => new Set(prev).add(notificationId));
    
    try {
      await markAsRead(notificationId);
    } finally {
      setLoadingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    
    switch (type) {
      case "ORDER_CONFIRMED":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case "ORDER_COOKING":
        return <Clock className={`${iconClass} text-blue-500`} />;
      case "ORDER_OUT_FOR_DELIVERY":
        return <Truck className={`${iconClass} text-purple-500`} />;
      case "ORDER_DELIVERED":
        return <Package className={`${iconClass} text-green-600`} />;
      case "NEW_ORDER":
        return <Package className={`${iconClass} text-blue-600`} />;
      case "ORDER_CANCELLED":
        return <X className={`${iconClass} text-red-500`} />;
      default:
        return <AlertCircle className={`${iconClass} text-orange-500`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return 'border-l-red-500';
      case "HIGH":
        return 'border-l-orange-500';
      case "MEDIUM":
        return 'border-l-blue-500';
      case "LOW":
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-500';
    }
  };



  return (
    <div className="relative" ref={dropdownRef}>
      <Menu as="div" className="relative">
        <Menu.Button 
          className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </span>
        </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 z-50 w-96 max-h-96 overflow-y-auto rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Debug info */}
           

            {/* Notifications List */}
            {!notifications || notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Array.isArray(notifications) && notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                      notification.status === "UNREAD" 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {notification.status === "UNREAD" && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                disabled={loadingNotifications.has(notification._id)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Mark as read"
                              >
                                {loadingNotifications.has(notification._id) ? (
                                  <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification._id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default NotificationDropdown;
