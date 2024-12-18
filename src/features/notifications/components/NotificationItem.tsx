import React from 'react';
import { Bell, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { Notification } from '../types/notificationTypes';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Bell className="w-6 h-6 text-blue-500" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`p-4 ${notification.read ? 'bg-white' : 'bg-orange-50'} hover:bg-gray-50 transition-colors duration-150`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
            <span className="text-xs text-gray-500">
              {formatDate(notification.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          {notification.link && (
            <a
              href={notification.link}
              className="mt-2 inline-flex items-center text-sm text-orange-600 hover:text-orange-700"
            >
              Visualizza
              <ExternalLink className="ml-1 w-4 h-4" />
            </a>
          )}
        </div>
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="flex-shrink-0 text-xs text-orange-600 hover:text-orange-700"
          >
            Segna come letto
          </button>
        )}
      </div>
    </div>
  );
}