import { Notification, NotificationFilter } from '../types/notificationTypes';

// Mock data for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Promozione pubblicata',
    message: 'La tua promozione "Sconto Studenti 25%" è stata pubblicata con successo.',
    read: false,
    createdAt: '2024-03-15T10:30:00',
    link: '/dashboard/promotions/1'
  },
  {
    id: '2',
    type: 'info',
    title: 'Nuovo follower',
    message: 'L\'Università di Milano ha iniziato a seguire il tuo brand.',
    read: true,
    createdAt: '2024-03-14T15:45:00'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Promozione in scadenza',
    message: 'La promozione "Back to School" scadrà tra 3 giorni.',
    read: false,
    createdAt: '2024-03-13T09:15:00',
    link: '/dashboard/promotions/3'
  }
];

export async function fetchNotifications(filters?: NotificationFilter): Promise<Notification[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filteredNotifications = [...mockNotifications];
  
  if (filters?.type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
  }
  
  if (filters?.read !== undefined) {
    filteredNotifications = filteredNotifications.filter(n => n.read === filters.read);
  }
  
  if (filters?.dateRange) {
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);
    filteredNotifications = filteredNotifications.filter(n => {
      const date = new Date(n.createdAt);
      return date >= start && date <= end;
    });
  }

  return filteredNotifications;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
}