
import { Star, MapPin, Clock, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gym } from "@/types";

interface GymHeaderProps {
  gym: Gym;
}

export const GymHeader = ({ gym }: GymHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        {gym.main_image && (
          <img 
            src={gym.main_image} 
            alt={gym.name || ""} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
      </div>

      {/* Gym Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{gym.name}</h1>
            
            <div className="flex items-center gap-4 text-white/80 text-sm mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{gym.location}, {gym.city}</span>
              </div>
              
              {gym.working_hours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{gym.working_hours}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-white font-medium">{gym.rating || 0}</span>
                <span className="text-white/60">({gym.review_count || 0} отзывов)</span>
              </div>
              
              {gym.phone && (
                <div className="flex items-center gap-1 text-white/80">
                  <Phone className="h-4 w-4" />
                  <span>{gym.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          {gym.category && (
            <div className="bg-purple-600/80 text-white px-3 py-1 rounded-full text-sm font-medium">
              {gym.category}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
