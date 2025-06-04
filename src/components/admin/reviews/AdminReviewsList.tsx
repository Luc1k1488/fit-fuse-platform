
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle } from "lucide-react";
import { Review, User, Gym } from "@/types";

interface AdminReviewsListProps {
  reviews: Review[];
  users: Record<string, User>;
  gyms: Record<string, Gym>;
  onHideReview: (reviewId: string) => void;
  formatDate: (dateString: string | null) => string;
  renderStars: (rating: number | null) => JSX.Element | null;
}

export const AdminReviewsList = ({
  reviews,
  users,
  gyms,
  onHideReview,
  formatDate,
  renderStars
}: AdminReviewsListProps) => {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
          <p>По вашему запросу не найдено отзывов. Попробуйте изменить параметры поиска.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {reviews.map(review => {
            const user = users[review.user_id || ''];
            const gym = gyms[review.gym_id || ''];
            
            return (
              <div key={review.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user?.profile_image || ""} />
                      <AvatarFallback>
                        {user?.name ? user.name.substring(0, 2) : 'ПО'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{user?.name || 'Пользователь'}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{formatDate(review.created_at)}</span>
                        <span className="mx-2">•</span>
                        <span>{gym?.name || 'Неизвестный зал'}</span>
                        {gym?.location && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{gym.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="mt-3">
                  <p>{review.comment}</p>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onHideReview(review.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Скрыть
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
