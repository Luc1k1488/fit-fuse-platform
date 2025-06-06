
import { Star, MapPin, Heart, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { Gym } from "@/types";

interface GymCardProps {
  gym: Gym;
  index: number;
  favoriteGyms: string[];
  toggleFavorite: (gymId: string) => void;
}

export const GymCard = ({ gym, index, favoriteGyms, toggleFavorite }: GymCardProps) => {
  const isFavorite = favoriteGyms.includes(gym.id);

  return (
    <div 
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden animate-fade-in hover:bg-slate-700/30 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/app/gyms/${gym.id}`} className="block">
        <div className="relative">
          {gym.main_image ? (
            <img 
              src={gym.main_image} 
              alt={gym.name || ""} 
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
              <Dumbbell className="h-12 w-12 text-slate-400" />
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(gym.id);
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
            />
          </button>

          {gym.category && (
            <div className="absolute top-3 left-3 bg-purple-600/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              {gym.category}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/app/gyms/${gym.id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 hover:text-purple-400 transition-colors">
            {gym.name}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{gym.location}, {gym.city}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-white font-medium">{gym.rating || 0}</span>
            <span className="text-gray-400 text-sm ml-1">({gym.review_count || 0})</span>
          </div>
          
          {gym.working_hours && (
            <span className="text-xs text-gray-400">
              {gym.working_hours}
            </span>
          )}
        </div>

        {gym.features && gym.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {gym.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="bg-slate-700/50 text-gray-300 px-2 py-1 rounded-full text-xs">
                {feature}
              </span>
            ))}
            {gym.features.length > 3 && (
              <span className="text-gray-400 text-xs px-2 py-1">
                +{gym.features.length - 3} еще
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
