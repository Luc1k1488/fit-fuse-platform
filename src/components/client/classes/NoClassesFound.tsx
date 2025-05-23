
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface NoClassesFoundProps {
  resetFilters: () => void;
}

export const NoClassesFound = ({ resetFilters }: NoClassesFoundProps) => {
  return (
    <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in">
      <Calendar className="h-12 w-12 mx-auto text-gray-500" />
      <p className="mt-2 text-gray-400">Нет занятий по выбранным критериям</p>
      <Button 
        onClick={resetFilters} 
        className="mt-4 transition-all hover:scale-105"
      >
        Сбросить фильтры
      </Button>
    </div>
  );
};
