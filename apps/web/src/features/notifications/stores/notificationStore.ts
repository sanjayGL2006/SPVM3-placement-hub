import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationItem } from '../../../shared/types/global.types';
import { MOCK_NOTIFICATIONS } from '../../../shared/utils/mockData';

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,

      addNotification: (item) => {
        const id = `NOTIF-${Date.now()}`;
        const newNotif: NotificationItem = {
          ...item,
          id,
          timestamp: 'Just now',
          read: false,
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      unreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'placement_pro_notifications',
    }
  )
);
