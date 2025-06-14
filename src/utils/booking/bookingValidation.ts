
import { supabase } from "@/integrations/supabase/client";

// Проверка пересечения бронирований по времени
export const checkBookingConflict = async (
  classId: string,
  dateTime: Date,
  excludeBookingId?: string
): Promise<boolean> => {
  try {
    // Получаем информацию о занятии
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("start_time, end_time, capacity, booked_count")
      .eq("id", classId)
      .single();

    if (classError || !classData) {
      console.error("Ошибка получения данных занятия:", classError);
      return true; // В случае ошибки блокируем бронирование
    }

    // Проверяем, не превышена ли вместимость
    if (classData.booked_count >= classData.capacity) {
      return true; // Конфликт - нет свободных мест
    }

    // Проверяем пересечение по времени (если это повторяющееся занятие)
    const startTime = new Date(classData.start_time);
    const endTime = new Date(classData.end_time);
    
    // Для упрощения считаем, что dateTime должно попадать в интервал занятия
    if (dateTime < startTime || dateTime > endTime) {
      return true; // Конфликт - время не подходит
    }

    // Проверяем существующие бронирования пользователя на это время
    let query = supabase
      .from("bookings")
      .select("id")
      .eq("class_id", classId)
      .eq("date_time", dateTime.toISOString())
      .eq("status", "booked");

    if (excludeBookingId) {
      query = query.neq("id", excludeBookingId);
    }

    const { data: existingBookings, error } = await query;

    if (error) {
      console.error("Ошибка проверки бронирований:", error);
      return true;
    }

    return existingBookings && existingBookings.length > 0;
  } catch (error) {
    console.error("Ошибка проверки конфликта бронирования:", error);
    return true;
  }
};
