
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface AdminReviewsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterRating: string;
  onFilterRatingChange: (rating: string) => void;
}

export const AdminReviewsFilters = ({
  searchQuery,
  onSearchChange,
  filterRating,
  onFilterRatingChange
}: AdminReviewsFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск по отзывам..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Select value={filterRating} onValueChange={onFilterRatingChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по рейтингу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все рейтинги</SelectItem>
            <SelectItem value="positive">Положительные (4-5)</SelectItem>
            <SelectItem value="neutral">Нейтральные (3)</SelectItem>
            <SelectItem value="negative">Негативные (1-2)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
