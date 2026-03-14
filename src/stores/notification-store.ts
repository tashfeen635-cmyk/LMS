"use client";

import { create } from "zustand";
import type { Notification } from "@/types";
import {
  notifications as mockNotifications,
  getNotificationsByUser,
} from "@/lib/mock-data";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loadNotifications: (userId: string) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  loadNotifications: (userId: string) => {
    const userNotifications = getNotificationsByUser(userId);
    set({
      notifications: userNotifications,
      unreadCount: userNotifications.filter((n) => !n.read).length,
    });
  },

  markAsRead: (notificationId: string) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
}));

export default useNotificationStore;
