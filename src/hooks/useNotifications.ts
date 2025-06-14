
import { useState, useEffect } from "react";

export interface Notification {
  id: string;
  type: 'role_change' | 'user_blocked' | 'user_unblocked';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: Notification['type'], title: string, description: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      description,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Оставляем только 10 последних
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Функции для добавления уведомлений (будут вызываться из других компонентов)
  useEffect(() => {
    (window as any).addNotification = addNotification;
    return () => {
      delete (window as any).addNotification;
    };
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification
  };
};
