
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    // Подписываемся на изменения в таблице users для отслеживания смены ролей
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
        (payload) => {
          const newUser = payload.new as any;
          const oldUser = payload.old as any;
          
          // Проверяем изменение роли
          if (oldUser.role !== newUser.role) {
            const userEmail = newUser.email || 'Неизвестный пользователь';
            const oldRoleLabel = getRoleLabel(oldUser.role || 'user');
            const newRoleLabel = getRoleLabel(newUser.role);
            
            toast({
              title: "Роль пользователя изменена",
              description: `Пользователь ${userEmail}: ${oldRoleLabel} → ${newRoleLabel}`,
            });
            
            onNotificationSent?.(userEmail, oldUser.role || 'user', newUser.role);
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

export default UserRoleNotification;
