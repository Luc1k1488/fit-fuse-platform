
import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkCard } from "@/components/ui/dark-card";
import { Gym } from "@/types";

interface GymCardProps {
  gym: Gym;
  index: number;
  favoriteGyms: string[];
  toggleFavorite: (gymId: string) => void;
}

export const GymCard = ({ gym, index, favoriteGyms, toggleFavorite }: GymCardProps) => {
  return (
    <DarkCard 
      key={gym.id} 
      className="overflow-hidden animate-fade-in" 
      style={{ animationDelay: `${index * 100}ms` }}
      hoverEffect="raise"
    >
      <div className="relative h-40 overflow-hidden group">
        {gym.main_image ? (
          <img 
            src={gym.main_image} 
            alt={gym.name || ""} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <p className="text-gray-400">Нет изображения</p>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-medium">{gym.rating || 0}</span>
        </div>
        <button 
          onClick={() => toggleFavorite(gym.id)} 
          className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm p-2 rounded-full transition-all hover:bg-black/50"
        >
          <Heart 
            className={`h-4 w-4 ${favoriteGyms.includes(gym.id) ? 'text-red-500 fill-red-500' : 'text-white'} transition-colors`} 
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-white">{gym.name}</h3>
        <div className="flex items-center mt-1 text-sm text-gray-400">
          <MapPin className="h-3 w-3 mr-1" />
          {gym.location ? `${gym.location}, ${gym.city}` : gym.city} 
        </div>
        <div className="mt-2 text-sm text-gray-400">
          <p>{gym.review_count} отзывов</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {gym.features && gym.features.map((feature, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs transition-all hover:bg-gray-700"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 pt-0 flex justify-between items-center">
        <Button asChild variant="default" className="transition-all hover:scale-105">
          <Link to={`/app/gyms/${gym.id}`}>Подробнее</Link>
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 transition-all">
          Расписание
        </Button>
      </div>
    </DarkCard>
  );
};
