
import { supabase } from "@/integrations/supabase/client";

// Проверка лимитов абонемента
export const checkSubscriptionLimits = async (
  userId: string,
  subscriptionType: "regular" | "premium" | "basic"
): Promise<{ canBook: boolean; message?: string }> => {
  try {
    // Получаем активные бронирования пользователя за текущий месяц
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "booked")
      .gte("date_time", startOfMonth.toISOString())
      .lte("date_time", endOfMonth.toISOString());

    if (error) {
      console.error("Ошибка получения бронирований:", error);
      return { canBook: false, message: "Ошибка проверки лимитов" };
    }

    const currentBookings = bookings?.length || 0;

    // Определяем лимиты по типу абонемента
    const limits = {
      basic: 4,     // 4 занятия в месяц
      regular: 8,   // 8 занятий в месяц  
      premium: 999  // Безлимит
    };

    const limit = limits[subscriptionType] || 0;

    if (currentBookings >= limit) {
      return { 
        canBook: false, 
        message: `Достигнут лимит по абонементу (${limit} занятий в месяц)` 
      };
    }

    return { canBook: true };
  } catch (error) {
    console.error("Ошибка проверки лимитов абонемента:", error);
    return { canBook: false, message: "Ошибка проверки лимитов" };
  }
};
