
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Share, ChevronLeft, Star } from "lucide-react";

interface GymHeaderProps {
  gymData: {
    name: string;
    mainImage: string;
    rating: number;
    reviewCount: number;
  };
}

export const GymHeader = ({ gymData }: GymHeaderProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  return (
    <div className="relative mb-4">
      <div className="h-52 overflow-hidden">
        <img 
          src={gymData.mainImage} 
          alt={gymData.name} 
          className="w-full h-full object-cover animate-fade-in" 
        />
      </div>
      <div className="absolute top-2 left-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105" 
          asChild
        >
          <Link to="/app/gyms" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад
          </Link>
        </Button>
      </div>
      <div className="absolute bottom-0 transform translate-y-1/2 left-4 bg-white p-2 shadow rounded-lg animate-fade-in">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold">{gymData.rating}</span>
          <span className="text-sm text-gray-500">({gymData.reviewCount} отзывов)</span>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        <button 
          onClick={toggleFavorite}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'} transition-colors`} />
        </button>
        <div className="relative">
          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
          >
            <Share className="h-5 w-5 text-white" />
          </button>
          {showShareTooltip && (
            <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded animate-fade-in">
              Ссылка скопирована
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
