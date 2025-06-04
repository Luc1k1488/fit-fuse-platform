
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    user_name?: string;
    user_avatar?: string;
    created_at: string;
  };
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user_avatar} />
            <AvatarFallback>
              {review.user_name ? review.user_name.substring(0, 2) : 'ПО'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">
                {review.user_name || 'Пользователь'}
              </h4>
              <span className="text-sm text-gray-400">
                {formatDate(review.created_at)}
              </span>
            </div>
            <div className="flex mt-1 mb-2">
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-300 text-sm">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
