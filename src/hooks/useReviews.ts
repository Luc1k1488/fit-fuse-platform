
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Review {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  user_name?: string;
  user_avatar?: string;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export function useReviews(gymId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);

  // Получение отзывов для конкретного зала
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
        .select()
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Не удалось загрузить отзывы');
      } else if (data) {
        setReviews(data);
        setReviewCount(data.length);
      }
    } catch (error) {
      console.error('Exception fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Отправка нового отзыва
  const submitReview = async (formData: ReviewFormData, userId: string): Promise<boolean> => {
    if (!gymId) return false;

    try {
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
        toast.error('Не удалось отправить отзыв');
        return false;
      }

      toast.success('Отзыв успешно отправлен');
      await fetchReviews(); // Обновляем список отзывов
      return true;
    } catch (error) {
      console.error('Exception submitting review:', error);
      toast.error('Произошла ошибка при отправке отзыва');
      return false;
    }
  };

  // Вычисляем средний рейтинг на основе отзывов
  const getAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + (review.rating || 0), 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  // Загружаем отзывы при монтировании компонента или изменении gymId
  useEffect(() => {
    fetchReviews();
  }, [gymId]);

  return {
    reviews,
    loading,
    reviewCount,
    submitReview,
    getAverageRating,
    fetchReviews
  };
}
