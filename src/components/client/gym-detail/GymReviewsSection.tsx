
import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  user_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string;
}

interface GymReviewsSectionProps {
  gymId: string;
}

export const GymReviewsSection = ({ gymId }: GymReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('gym_id', gymId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching reviews:', error);
        } else {
          setReviews(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [gymId]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Отзывы</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-700/50 rounded-lg h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Отзывы ({reviews.length})</h2>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Отзывов пока нет</p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Оставить первый отзыв
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">Пользователь</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (review.rating || 0)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-300 text-sm">{review.comment}</p>
                  )}
                  
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700/50">
              Посмотреть все отзывы
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Написать отзыв
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
