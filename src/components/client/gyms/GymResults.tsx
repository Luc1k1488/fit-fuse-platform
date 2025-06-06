
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { GymCard } from "./GymCard";
import { YandexMap } from "../maps/YandexMap";
import { Gym } from "@/types";

interface GymResultsProps {
  gyms: Gym[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  favoriteGyms: string[];
  toggleFavorite: (gymId: string) => void;
  refetch: () => void;
  resetFilters: () => void;
  showMap: boolean;
  selectedGym: Gym | null;
  onGymSelect: (gym: Gym) => void;
}

export const GymResults = ({
  gyms,
  isLoading,
  isError,
  error,
  favoriteGyms,
  toggleFavorite,
  refetch,
  resetFilters,
  showMap,
  selectedGym,
  onGymSelect,
}: GymResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-slate-300">Загружаем залы...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-400 font-semibold mb-2">Ошибка загрузки</h3>
          <p className="text-red-300 text-sm mb-4">
            {error?.message || "Не удалось загрузить список залов"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm"
              className="border-red-700 text-red-400 hover:bg-red-900/30"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Повторить
            </Button>
            <Button 
              onClick={resetFilters} 
              variant="outline" 
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!gyms || gyms.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-slate-300 font-semibold mb-2">Залы не найдены</h3>
          <p className="text-slate-400 text-sm mb-4">
            Попробуйте изменить параметры поиска или выбрать другой город
          </p>
          <Button 
            onClick={resetFilters} 
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Сбросить фильтры
          </Button>
        </div>
      </div>
    );
  }

  if (showMap) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden animate-fade-in">
        <YandexMap 
          gyms={gyms} 
          selectedGym={selectedGym}
          onGymSelect={onGymSelect}
          height="600px"
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Найдено {gyms.length} {gyms.length === 1 ? 'зал' : gyms.length < 5 ? 'зала' : 'залов'}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gyms.map((gym, index) => (
          <GymCard
            key={gym.id}
            gym={gym}
            index={index}
            favoriteGyms={favoriteGyms}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
