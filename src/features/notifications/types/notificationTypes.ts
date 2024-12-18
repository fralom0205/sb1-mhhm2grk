export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationFilter {
  type?: NotificationType;
  read?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}