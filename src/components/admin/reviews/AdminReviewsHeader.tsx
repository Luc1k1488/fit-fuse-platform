
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminReviewsHeaderProps {
  avgRating: number;
  totalReviews: number;
  positivePercentage: number;
  negativePercentage: number;
  renderStars: (rating: number) => JSX.Element;
}

export const AdminReviewsHeader = ({
  avgRating,
  totalReviews,
  positivePercentage,
  negativePercentage,
  renderStars
}: AdminReviewsHeaderProps) => {
  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Обзор отзывов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {avgRating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-1">{renderStars(avgRating)}</div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">Средний рейтинг</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalReviews}</div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Всего отзывов</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {positivePercentage.toFixed(0)}%
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Положительные</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {negativePercentage.toFixed(0)}%
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">Негативные</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
