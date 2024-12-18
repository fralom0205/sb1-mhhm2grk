import React from 'react';
import { Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '../types/notificationTypes';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <Bell className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nessuna notifica
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Non hai ancora ricevuto alcuna notifica
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}