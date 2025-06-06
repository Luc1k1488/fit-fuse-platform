
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export interface AdminReviewsHeaderProps {
  avgRating: number;
  totalReviews: number;
  positivePercentage: number;
  negativePercentage: number;
  renderStars: (rating: number) => React.ReactNode;
}

export const AdminReviewsHeader: React.FC<AdminReviewsHeaderProps> = ({
  avgRating,
  totalReviews,
  positivePercentage,
  negativePercentage,
  renderStars
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Отзывы</h1>
          <p className="text-muted-foreground">Управление отзывами пользователей</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Средний рейтинг</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {avgRating.toFixed(1)}
              <span className="ml-2 flex">
                {renderStars(avgRating)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Всего отзывов</CardDescription>
            <CardTitle className="text-3xl">{totalReviews}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Положительные</CardDescription>
            <CardTitle className="text-3xl">{positivePercentage}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Негативные</CardDescription>
            <CardTitle className="text-3xl">{negativePercentage}%</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
