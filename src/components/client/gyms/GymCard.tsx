
import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gym } from "@/types";

interface GymCardProps {
  gym: Gym;
  index?: number;
  favoriteGyms?: string[];
  toggleFavorite?: (gymId: string) => void;
}

export const GymCard = ({ gym, index = 0, favoriteGyms = [], toggleFavorite }: GymCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (toggleFavorite) {
      toggleFavorite(gym.id);
    }
  };

  return (
    <Card 
      className="overflow-hidden animate-fade-in bg-slate-800/50 backdrop-blur-sm border-slate-700 w-full" 
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-40 overflow-hidden group w-full">
        {gym.main_image ? (
          <img 
            src={gym.main_image} 
            alt={gym.name || ""} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <p className="text-slate-400 text-sm">Нет изображения</p>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-medium text-white">{gym.rating || 0}</span>
        </div>
        {toggleFavorite && (
          <button 
            onClick={handleFavoriteClick} 
            className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm p-2 rounded-full transition-all hover:bg-black/50"
          >
            <Heart 
              className={`h-4 w-4 ${favoriteGyms.includes(gym.id) ? 'text-red-500 fill-red-500' : 'text-white'} transition-colors`} 
            />
          </button>
        )}
      </div>
      <CardContent className="p-4 w-full">
        <h3 className="font-medium text-lg text-white mb-1 truncate">{gym.name}</h3>
        <div className="flex items-center text-sm text-slate-300 mb-2">
          <MapPin className="h-3 w-3 mr-1 shrink-0" />
          <span className="truncate">
            {gym.location ? `${gym.location}, ${gym.city}` : gym.city}
          </span>
        </div>
        <div className="text-sm text-slate-400 mb-3">
          <p>{gym.review_count} отзывов</p>
        </div>
        {gym.features && gym.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {gym.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
            {gym.features.length > 3 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                +{gym.features.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1 text-sm bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
            <Link to={`/app/gyms/${gym.id}`}>Подробнее</Link>
          </Button>
          <Button variant="outline" size="sm" className="shrink-0 text-sm border-slate-600 text-slate-300 hover:bg-slate-700">
            Расписание
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
