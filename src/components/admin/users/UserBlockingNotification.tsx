
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserBlockingNotificationProps {
  onNotificationSent?: (type: 'block' | 'unblock', userEmail: string) => void;
}

const UserBlockingNotification = ({ onNotificationSent }: UserBlockingNotificationProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Подписываемся на изменения в таблице users для отслеживания блокировок
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
        (payload) => {
          const newUser = payload.new as any;
          const oldUser = payload.old as any;
          
          // Проверяем изменение статуса блокировки
          if (oldUser.is_blocked !== newUser.is_blocked) {
            const isBlocked = newUser.is_blocked;
            const userEmail = newUser.email || 'Неизвестный пользователь';
            
            if (isBlocked) {
              toast({
                title: "Пользователь заблокирован",
                description: `Пользователь ${userEmail} был заблокирован`,
                variant: "destructive",
              });
              onNotificationSent?.('block', userEmail);
            } else {
              toast({
                title: "Пользователь разблокирован",
                description: `Пользователь ${userEmail} был разблокирован`,
              });
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

  return null; // Этот компонент не рендерит UI
};

export default UserBlockingNotification;
