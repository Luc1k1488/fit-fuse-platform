
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmailNotification } from "@/utils/emailNotifications";

interface UserRoleNotificationProps {
  onNotificationSent?: (userEmail: string, oldRole: string, newRole: string) => void;
}

const UserRoleNotification = ({ onNotificationSent }: UserRoleNotificationProps) => {
  const { toast } = useToast();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Администратор";
      case "partner": return "Партнер";
      case "support": return "Поддержка";
      default: return "Пользователь";
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('user-role-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: 'role=neq.null'
        },
        async (payload) => {
          const newUser = payload.new as any;
          const oldUser = payload.old as any;
          
          if (oldUser.role !== newUser.role) {
            const userEmail = newUser.email || 'Неизвестный пользователь';
            const oldRoleLabel = getRoleLabel(oldUser.role || 'user');
            const newRoleLabel = getRoleLabel(newUser.role);
            
            toast({
              title: "Роль пользователя изменена",
              description: `Пользователь ${userEmail}: ${oldRoleLabel} → ${newRoleLabel}`,
            });
            
            // Отправляем email уведомление
            try {
              await sendEmailNotification({
                type: 'role_change',
                userEmail: userEmail,
                details: {
                  oldRole: oldRoleLabel,
                  newRole: newRoleLabel
                }
              });
              
              console.log('Email уведомление о смене роли отправлено');
            } catch (error) {
              console.error('Ошибка отправки email уведомления:', error);
              toast({
                title: "Ошибка",
                description: "Не удалось отправить email уведомление",
                variant: "destructive",
              });
            }
            
            onNotificationSent?.(userEmail, oldUser.role || 'user', newUser.role);
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

export default UserRoleNotification;
