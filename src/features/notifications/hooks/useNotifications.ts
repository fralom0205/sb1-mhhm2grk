import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

import { NotificationFilter } from '../types/notificationTypes';

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<NotificationFilter>({
    type: '',
    read: undefined,
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    let notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    // Apply filters
    if (filters.type) {
      notificationsQuery = query(notificationsQuery, where('type', '==', filters.type));
    }
    if (filters.read !== undefined) {
      notificationsQuery = query(notificationsQuery, where('read', '==', filters.read));
    }
    if (filters.dateRange?.start) {
      notificationsQuery = query(
        notificationsQuery, 
        where('createdAt', '>=', filters.dateRange.start)
      );
    }
    if (filters.dateRange?.end) {
      notificationsQuery = query(
        notificationsQuery,
        where('createdAt', '<=', filters.dateRange.end)
      );
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const snapshot = await getDocs(notificationsQuery);
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setNotifications(notificationsData);
    } catch (err) {
      setError('Errore nel caricamento delle notifiche');
      console.error('Notifications loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, filters]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      await updateDoc(notificationRef, { read: true });
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id, loadNotifications]);

  return {
    notifications,
    isLoading,
    error,
    filters,
    setFilters,
    handleMarkAsRead,
    refresh: loadNotifications
  };
}