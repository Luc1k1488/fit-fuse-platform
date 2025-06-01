
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

// Обновление рейтинга зала на основе отзывов
export const updateGymRating = async (gymId: string): Promise<void> => {
  try {
    // Получаем все отзывы для зала
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("gym_id", gymId);

    if (error) {
      console.error("Ошибка получения отзывов:", error);
      return;
    }

    if (!reviews || reviews.length === 0) {
      // Если нет отзывов, устанавливаем рейтинг 0
      await supabase
        .from("gyms")
        .update({ 
          rating: 0, 
          review_count: 0 
        })
        .eq("id", gymId);
      return;
    }

    // Вычисляем средний рейтинг
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Обновляем рейтинг и количество отзывов в таблице залов
    const { error: updateError } = await supabase
      .from("gyms")
      .update({ 
        rating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака после запятой
        review_count: reviews.length 
      })
      .eq("id", gymId);

    if (updateError) {
      console.error("Ошибка обновления рейтинга:", updateError);
    }
  } catch (error) {
    console.error("Ошибка обновления рейтинга зала:", error);
  }
};

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

// Обновление статистики пользователя
export const updateUserStats = async (
  userId: string,
  action: "booking_created" | "workout_completed" | "booking_cancelled"
): Promise<void> => {
  try {
    // Получаем текущую статистику
    const { data: stats, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Ошибка получения статистики:", error);
      return;
    }

    const currentStats = stats || {
      total_bookings: 0,
      completed_workouts: 0,
      current_streak_days: 0,
      best_streak_days: 0,
      total_hours_trained: 0
    };

    let updatedStats = { ...currentStats };

    switch (action) {
      case "booking_created":
        updatedStats.total_bookings = (currentStats.total_bookings || 0) + 1;
        break;
      case "workout_completed":
        updatedStats.completed_workouts = (currentStats.completed_workouts || 0) + 1;
        updatedStats.total_hours_trained = (currentStats.total_hours_trained || 0) + 1.5; // Предполагаем 1.5 часа за тренировку
        updatedStats.last_workout_date = new Date().toISOString();
        // Обновляем streak (серию тренировок)
        // Простая логика - если последняя тренировка была вчера, увеличиваем streak
        if (currentStats.last_workout_date) {
          const lastWorkout = new Date(currentStats.last_workout_date);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastWorkout.toDateString() === yesterday.toDateString()) {
            updatedStats.current_streak_days = (currentStats.current_streak_days || 0) + 1;
            if (updatedStats.current_streak_days > (currentStats.best_streak_days || 0)) {
              updatedStats.best_streak_days = updatedStats.current_streak_days;
            }
          } else {
            updatedStats.current_streak_days = 1; // Начинаем новую серию
          }
        } else {
          updatedStats.current_streak_days = 1;
        }
        break;
      case "booking_cancelled":
        if (currentStats.total_bookings > 0) {
          updatedStats.total_bookings = currentStats.total_bookings - 1;
        }
        break;
    }

    // Сохраняем обновленную статистику
    const { error: upsertError } = await supabase
      .from("user_stats")
      .upsert({
        user_id: userId,
        ...updatedStats,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error("Ошибка обновления статистики:", upsertError);
    }
  } catch (error) {
    console.error("Ошибка обновления статистики пользователя:", error);
  }
};
