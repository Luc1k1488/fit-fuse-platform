
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmailNotification } from "@/utils/emailNotifications";

interface UserBlockingNotificationProps {
  onNotificationSent?: (type: 'block' | 'unblock', userEmail: string) => void;
}

const UserBlockingNotification = ({ onNotificationSent }: UserBlockingNotificationProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('user-blocking-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: 'is_blocked=neq.null'
        },
        async (payload) => {
          const newUser = payload.new as any;
          const oldUser = payload.old as any;
          
          if (oldUser.is_blocked !== newUser.is_blocked) {
            const isBlocked = newUser.is_blocked;
            const userEmail = newUser.email || 'Неизвестный пользователь';
            
            if (isBlocked) {
              toast({
                title: "Пользователь заблокирован",
                description: `Пользователь ${userEmail} был заблокирован`,
                variant: "destructive",
              });

              // Отправляем email уведомление о блокировке
              try {
                await sendEmailNotification({
                  type: 'user_blocked',
                  userEmail: userEmail
                });
                console.log('Email уведомление о блокировке отправлено');
              } catch (error) {
                console.error('Ошибка отправки email уведомления:', error);
              }

              onNotificationSent?.('block', userEmail);
            } else {
              toast({
                title: "Пользователь разблокирован",
                description: `Пользователь ${userEmail} был разблокирован`,
              });

              // Отправляем email уведомление о разблокировке
              try {
                await sendEmailNotification({
                  type: 'user_unblocked',
                  userEmail: userEmail
                });
                console.log('Email уведомление о разблокировке отправлено');
              } catch (error) {
                console.error('Ошибка отправки email уведомления:', error);
              }

              onNotificationSent?.('unblock', userEmail);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, onNotificationSent]);

  return null;
};

export default UserBlockingNotification;
