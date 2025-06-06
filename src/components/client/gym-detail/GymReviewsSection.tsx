
import { useState } from "react";
import { useAuth } from "@/contexts/auth_context";
import { useReviews } from "@/hooks/useReviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

interface GymReviewsSectionProps {
  gymId: string;
}

export const GymReviewsSection = ({ gymId }: GymReviewsSectionProps) => {
  const { user } = useAuth();
  const { reviews, reviewCount, getAverageRating, submitReview, loading } = useReviews(gymId);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const toggleReviewForm = () => {
    if (!user) {
      // Если пользователь не авторизован, перенаправим на страницу входа
      // или покажем всплывающее сообщение
      return;
    }
    setShowReviewForm(prev => !prev);
  };

  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    if (!user) return false;
    
    const success = await submitReview(reviewData, user.id);
    if (success) {
      setShowReviewForm(false);
    }
    return success;
  };

  // Отображение звездочек для среднего рейтинга
  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="mt-8 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Отзывы ({reviewCount})</h2>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex">
              {renderRatingStars(getAverageRating())}
            </div>
            <span className="text-lg font-semibold text-white">{getAverageRating()}</span>
          </div>
        </div>
        
        <Button 
          onClick={toggleReviewForm}
          className="mt-4 md:mt-0"
        >
          {showReviewForm ? 'Отменить' : 'Оставить отзыв'}
        </Button>
      </div>
      
      {showReviewForm && (
        <div className="py-4">
          <ReviewForm 
            gymId={gymId} 
            onSubmit={handleSubmitReview} 
          />
          <Separator className="my-6 bg-gray-700" />
        </div>
      )}
      
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400">Пока нет отзывов</p>
            <Button 
              variant="outline" 
              onClick={toggleReviewForm} 
              className="mt-4"
            >
              Будьте первым, кто оставит отзыв
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
