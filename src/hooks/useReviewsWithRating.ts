
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateGymRating } from '@/utils/business';

interface Review {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export function useReviewsWithRating(gymId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!gymId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Не удалось загрузить отзывы');
      } else if (data) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Exception fetching reviews:', error);
      toast.error('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (formData: ReviewFormData, userId: string): Promise<boolean> => {
    if (!gymId) return false;

    setSubmitting(true);
    try {
      // Проверяем, есть ли уже отзыв от этого пользователя
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('gym_id', gymId)
        .eq('user_id', userId)
        .single();

      if (existingReview) {
        toast.error('Вы уже оставили отзыв для этого зала');
        return false;
      }

      const reviewData = {
        gym_id: gymId,
        user_id: userId,
        rating: formData.rating,
        comment: formData.comment,
      };

      const { error } = await supabase
        .from('reviews')
        .insert(reviewData);

      if (error) {
        console.error('Error submitting review:', error);
        toast.error('Не удалось отправить отзыв: ' + error.message);
        return false;
      }

      // Обновляем рейтинг зала (триггер сделает это автоматически, но можем вызвать и вручную)
      await updateGymRating(gymId);

      toast.success('Отзыв успешно отправлен');
      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Exception submitting review:', error);
      toast.error('Произошла ошибка при отправке отзыва: ' + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + (review.rating || 0), 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  useEffect(() => {
    fetchReviews();
  }, [gymId]);

  return {
    reviews,
    loading,
    submitting,
    submitReview,
    getAverageRating,
    fetchReviews
  };
}
