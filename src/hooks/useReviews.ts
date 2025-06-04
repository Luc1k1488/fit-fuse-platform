
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user_id: string;
  gym_id: string;
  created_at: string;
}

export const useReviews = (gymId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gymId) {
      fetchReviews();
    }
  }, [gymId]);

  const fetchReviews = async () => {
    if (!gymId) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error("Ошибка загрузки отзывов");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (reviewData: { rating: number; comment: string }, userId: string) => {
    if (!gymId) return false;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          gym_id: gymId,
          user_id: userId,
          rating: reviewData.rating,
          comment: reviewData.comment
        });

      if (error) throw error;

      toast.success("Отзыв добавлен!");
      await fetchReviews(); // Обновляем список отзывов
      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Ошибка добавления отзыва");
      return false;
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  return {
    reviews,
    loading,
    submitReview,
    getAverageRating,
    reviewCount: reviews.length
  };
};
