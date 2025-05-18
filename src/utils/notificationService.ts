
/**
 * Сервис для работы с уведомлениями в PWA
 */
import { useState, useEffect } from 'react';

export const notificationService = {
  /**
   * Запрос разрешения на отправку уведомлений
   */
  async requestPermission(): Promise<boolean> {
    // Проверка поддержки уведомлений в браузере
    if (!('Notification' in window)) {
      console.log('Этот браузер не поддерживает уведомления');
      return false;
    }
    
    // Если уже есть разрешение
    if (Notification.permission === 'granted') {
      return true;
    }
    
    // Запрашиваем разрешение
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Ошибка при запросе разрешения:', error);
      return false;
    }
  },
  
  /**
   * Подписка на push-уведомления
   */
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    try {
      // Проверка поддержки Service Worker
      if (!('serviceWorker' in navigator)) {
        console.log('Service Worker не поддерживается');
        return null;
      }
      
      // Регистрация Service Worker
      const registration = await navigator.serviceWorker.ready;
      
      // Проверка поддержки Push API
      if (!('pushManager' in registration)) {
        console.log('Push API не поддерживается');
        return null;
      }
      
      // Получение текущей подписки
      let subscription = await registration.pushManager.getSubscription();
      
      // Если подписки нет, создаем новую
      if (!subscription) {
        // В реальном приложении VAPID ключ должен быть на сервере
        const vapidPublicKey = 'Здесь должен быть ваш VAPID public key';
        
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
          });
          
          // В реальном приложении здесь нужно отправить подписку на сервер
          console.log('Подписка создана:', subscription);
        } catch (err) {
          console.error('Ошибка при создании подписки:', err);
          return null;
        }
      }
      
      return subscription;
    } catch (error) {
      console.error('Ошибка при подписке на push-уведомления:', error);
      return null;
    }
  },
  
  /**
   * Отписка от push-уведомлений
   */
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        const success = await subscription.unsubscribe();
        
        // В реальном приложении здесь нужно удалить подписку с сервера
        
        return success;
      }
      
      return false;
    } catch (error) {
      console.error('Ошибка при отписке от push-уведомлений:', error);
      return false;
    }
  },
  
  /**
   * Проверка текущего статуса подписки
   */
  async getSubscriptionStatus(): Promise<{ subscribed: boolean; permission: string }> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return { subscribed: false, permission: 'unsupported' };
      }
      
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      return {
        subscribed: !!subscription,
        permission: Notification.permission
      };
    } catch (error) {
      console.error('Ошибка при проверке статуса подписки:', error);
      return { subscribed: false, permission: 'error' };
    }
  },
  
  /**
   * Преобразование base64 VAPID ключа в Uint8Array
   */
  urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
};

/**
 * Хук для проверки состояния онлайн/оффлайн
 */
export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
