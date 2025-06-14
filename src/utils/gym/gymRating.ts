
import { supabase } from "@/integrations/supabase/client";

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
