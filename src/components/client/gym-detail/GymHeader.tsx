
import { Star, MapPin, Users } from "lucide-react";
import { Gym } from "@/types";
import { Button } from "@/components/ui/button";

export interface GymHeaderProps {
  gym: Gym;
}

export const GymHeader = ({ gym }: GymHeaderProps) => {
  return (
    <div 
      className="relative w-full h-64 bg-cover bg-center" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${gym.main_image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'})` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
      <div className="absolute bottom-0 w-full p-4 md:p-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-white font-semibold">{gym.rating || '0.0'}</span>
              <span className="text-gray-300 text-sm">({gym.review_count || 0} отзывов)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-300 mr-1" />
              <span className="text-gray-300 text-sm">{gym.location || gym.address || "Адрес не указан"}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-300 mr-1" />
              <span className="text-gray-300 text-sm">Посещаемость: высокая</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button className="bg-primary hover:bg-primary/90">
              Забронировать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
