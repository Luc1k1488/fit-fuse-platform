
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Search, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export type Rating = "all" | "positive" | "neutral" | "negative";

export interface AdminReviewsFiltersProps {
  ratingFilter: Rating;
  setRatingFilter: Dispatch<SetStateAction<Rating>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export const AdminReviewsFilters: React.FC<AdminReviewsFiltersProps> = ({
  ratingFilter,
  setRatingFilter,
  searchQuery,
  setSearchQuery
}) => {
  const handleClearFilters = () => {
    setRatingFilter("all");
    setSearchQuery("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-2 text-sm font-medium">Рейтинг:</div>
            <div className="flex space-x-2">
              <Button
                variant={ratingFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter("all")}
              >
                Все
              </Button>
              <Button
                variant={ratingFilter === "positive" ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter("positive")}
                className={ratingFilter === "positive" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Star className="h-4 w-4 mr-1 fill-yellow-400" />
                4-5
              </Button>
              <Button
                variant={ratingFilter === "neutral" ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter("neutral")}
                className={ratingFilter === "neutral" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Star className="h-4 w-4 mr-1 fill-yellow-400" />
                3
              </Button>
              <Button
                variant={ratingFilter === "negative" ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter("negative")}
                className={ratingFilter === "negative" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <Star className="h-4 w-4 mr-1 fill-yellow-400" />
                1-2
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по отзывам, пользователям или залам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Сбросить фильтры
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
