
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  gymId: string;
  onSubmit?: (review: { rating: number; comment: string }) => void;
}

export const ReviewForm = ({ gymId, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Пожалуйста, выберите рейтинг");
      return;
    }

    setSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit({ rating, comment });
      } else {
        toast.success("Отзыв отправлен!");
      }
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Ошибка отправки отзыва");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Рейтинг
            </label>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(i + 1)}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      i < (hoveredRating || rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-300 hover:text-amber-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Комментарий
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поделитесь своими впечатлениями..."
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={submitting || rating === 0}
            className="w-full"
          >
            {submitting ? "Отправка..." : "Отправить отзыв"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
