
import { supabase } from "@/integrations/supabase/client";

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
      total_hours_trained: 0,
      last_workout_date: null
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
        // Обновляем streak (серия тренировок)
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
