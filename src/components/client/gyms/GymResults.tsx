
import { Button } from "@/components/ui/button";
import { Gym } from "@/types";
import { GymCard } from "./GymCard";

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
  if (isLoading) {
    return (
      <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in">
        <p className="text-gray-400">Загрузка списка залов...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in">
        <p className="text-red-400">Ошибка при загрузке данных</p>
        <p className="text-sm text-gray-500 mt-2">{error?.message}</p>
        <Button onClick={refetch} className="mt-4 transition-all hover:scale-105">
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!gyms || gyms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in col-span-2">
        <p className="text-gray-400 mb-4">Не найдено залов по вашим критериям.</p>
        <Button onClick={resetFilters} className="transition-all hover:scale-105">Сбросить фильтры</Button>
      </div>
    );
  }

  return (
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
  );
};
