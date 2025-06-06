
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MoreVertical, RefreshCcw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminReview {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  user_name?: string;
  user_avatar?: string;
  gym_name?: string;
}

export interface AdminReviewsListProps {
  reviews: AdminReview[];
  loading: boolean;
  onHideReview: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const AdminReviewsList: React.FC<AdminReviewsListProps> = ({
  reviews,
  loading,
  onHideReview,
  onRefresh
}) => {
  const [actioningReviewId, setActioningReviewId] = useState<string | null>(null);

  // Render stars based on rating
  const renderStars = (rating: number | null) => {
    const stars = [];
    const ratingValue = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= ratingValue ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  const handleHideReview = async (id: string) => {
    setActioningReviewId(id);
    await onHideReview(id);
    setActioningReviewId(null);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground mb-4">Отзывы не найдены</p>
          <Button variant="outline" onClick={onRefresh} size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Найдено отзывов: {reviews.length}
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Обновить
        </Button>
      </div>
      
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {review.user_avatar ? (
                    <img
                      src={review.user_avatar}
                      alt={review.user_name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium">{(review.user_name || "U")[0]}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-medium">{review.user_name || "Неизвестный пользователь"}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                {renderStars(review.rating)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleHideReview(review.id)}
                      disabled={actioningReviewId === review.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Скрыть отзыв
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm">{review.comment || "Нет комментария"}</p>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-sm text-muted-foreground flex items-center">
                <span>Зал:</span>
                <span className="ml-1 font-medium text-foreground">
                  {review.gym_name || "Неизвестный зал"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
