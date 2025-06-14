
export const useNotificationHandlers = () => {
  const handleNotificationSent = (type: string, userEmail: string, oldRole?: string, newRole?: string) => {
    // Добавляем уведомление через глобальную функцию
    if ((window as any).addNotification) {
      if (type === 'block') {
        (window as any).addNotification('user_blocked', 'Пользователь заблокирован', `${userEmail} был заблокирован`);
      } else if (type === 'unblock') {
        (window as any).addNotification('user_unblocked', 'Пользователь разблокирован', `${userEmail} был разблокирован`);
      } else if (oldRole && newRole) {
        const getRoleLabel = (role: string) => {
          switch (role) {
            case "admin": return "Администратор";
            case "partner": return "Партнер";
            case "support": return "Поддержка";
            default: return "Пользователь";
          }
        };
        (window as any).addNotification(
          'role_change', 
          'Роль изменена', 
          `${userEmail}: ${getRoleLabel(oldRole)} → ${getRoleLabel(newRole)}`
        );
      }
    }
  };

  return { handleNotificationSent };
};
