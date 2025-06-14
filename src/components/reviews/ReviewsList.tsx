
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/auth_context";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ReviewsListProps {
  gymId: string;
}

export const ReviewsList = ({ gymId }: ReviewsListProps) => {
  const { user } = useAuth();
  const { reviews, loading, reviewCount, submitReview, getAverageRating } = useReviews(gymId);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    if (!user) return false;
    
    const success = await submitReview(reviewData, user.id);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  const averageRating = getAverageRating();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-700 h-8 w-32 rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-700 h-24 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with rating summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Отзывы ({reviewCount})
          </h3>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-gray-400">из 5</span>
            </div>
          )}
        </div>
        
        {user && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Написать отзыв
          </Button>
        )}
      </div>

      {/* Review form */}
      {showForm && user && (
        <div>
          <ReviewForm
            gymId={gymId}
            onSubmit={handleSubmitReview}
          />
          <div className="mt-3">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="border-gray-600 text-gray-300"
            >
              Отменить
            </Button>
          </div>
        </div>
      )}

      {showForm && <Separator className="bg-gray-700" />}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">Отзывов пока нет</p>
            <p className="text-gray-500 text-sm">Будьте первым, кто оставит отзыв!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};
