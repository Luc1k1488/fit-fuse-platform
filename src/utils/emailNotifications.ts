
import { supabase } from "@/integrations/supabase/client";

interface EmailNotificationData {
  type: 'role_change' | 'user_blocked' | 'user_unblocked';
  userEmail: string;
  details?: {
    oldRole?: string;
    newRole?: string;
    reason?: string;
  };
}

export const sendEmailNotification = async (data: EmailNotificationData) => {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-notification-email', {
      body: data
    });

    if (error) {
      console.error('Ошибка при отправке email уведомления:', error);
      throw error;
    }

    console.log('Email уведомление отправлено успешно:', result);
    return result;
  } catch (error) {
    console.error('Ошибка при вызове функции отправки email:', error);
    throw error;
  }
};
