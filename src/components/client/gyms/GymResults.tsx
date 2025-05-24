
import { Button } from "@/components/ui/button";
import { Gym } from "@/types";
import { GymCard } from "./GymCard";
import { Loader2 } from "lucide-react";

interface GymResultsProps {
  gyms: Gym[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  favoriteGyms: string[];
  toggleFavorite: (gymId: string) => void;
  refetch: () => void;
  resetFilters: () => void;
}

export const GymResults = ({
  gyms,
  isLoading,
  isError,
  error,
  favoriteGyms,
  toggleFavorite,
  refetch,
  resetFilters
}: GymResultsProps) => {
  console.log("GymResults rendering with:", { gyms, isLoading, isError, gymsCount: gyms?.length });
  
  if (isLoading) {
    return (
      <div className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
        <p className="text-slate-300">Загрузка списка залов...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl animate-fade-in">
        <p className="text-red-400 mb-2">Ошибка при загрузке данных</p>
        <p className="text-sm text-slate-400 mb-4">{error?.message || "Неизвестная ошибка"}</p>
        <Button onClick={refetch} className="mt-2 transition-all hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!gyms || gyms.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl animate-fade-in">
        <p className="text-slate-300 mb-4">Залы не найдены по вашим критериям.</p>
        <p className="text-sm text-slate-400 mb-6">Попробуйте изменить фильтры поиска.</p>
        <Button onClick={resetFilters} className="transition-all hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          Сбросить фильтры
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-400 mb-4">
        Найдено залов: {gyms.length}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gyms.map((gym, idx) => (
          <GymCard 
            key={gym.id}
            gym={gym}
            index={idx}
            favoriteGyms={favoriteGyms}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
