import React from 'react';
import { NotificationList } from '../features/notifications/components/NotificationList';
import { NotificationFilters } from '../features/notifications/components/NotificationFilters';
import { useNotifications } from '../features/notifications/hooks/useNotifications';
import { NotificationFilter } from '../features/notifications/types/notificationTypes';

export function Notifications() {
  const {
    notifications,
    isLoading,
    error,
    filters,
    setFilters,
    handleMarkAsRead,
  } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleFilterChange = (newFilters: NotificationFilter) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Notifiche
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {unreadCount} non {unreadCount === 1 ? 'letta' : 'lette'}
              </span>
            )}
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Gestisci tutte le tue notifiche
        </p>
      </div>

      <NotificationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}