
import { DarkCard } from "@/components/ui/dark-card";
import { Button } from "@/components/ui/button";
import { Clock, User, Dumbbell, MapPin, Heart } from "lucide-react";

interface ClassCardProps {
  classItem: {
    id: string;
    title: string;
    type: string;
    gymName: string;
    gymLocation: string;
    instructor: string;
    date: string;
    time: string;
    duration: string;
    spots: number;
    totalSpots: number;
    image: string;
  };
  isFavorite: boolean;
  toggleFavorite: (classId: string) => void;
  index: number;
}

export const ClassCard = ({ classItem, isFavorite, toggleFavorite, index }: ClassCardProps) => {
  return (
    <DarkCard 
      key={classItem.id} 
      className="overflow-hidden animate-fade-in" 
      style={{ animationDelay: `${index * 100}ms` }}
      hoverEffect="raise"
    >
      <div className="flex flex-row">
        <div className="w-1/3 h-28 overflow-hidden group">
          <img 
            src={classItem.image} 
            alt={classItem.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-3 w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">{classItem.title}</h3>
              <span className="text-xs bg-gray-800 text-gray-300 rounded-full px-2 py-1">
                {classItem.type}
              </span>
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-400">
              <User className="h-3 w-3 mr-1" />
              {classItem.instructor}
            </div>
            <div className="flex flex-wrap mt-1 gap-2">
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {classItem.time}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Dumbbell className="h-3 w-3 mr-1" />
                {classItem.duration}
              </div>
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3 mr-1" />
              {classItem.gymName}, {classItem.gymLocation}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">
              Осталось мест: <span className={classItem.spots < 3 ? 'text-red-400 font-medium' : ''}>{classItem.spots}/{classItem.totalSpots}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(classItem.id)} 
                className="p-1.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} transition-colors`} 
                />
              </button>
              <Button size="sm" className="text-xs py-0 h-7 transition-all hover:scale-105">
                Записаться
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DarkCard>
  );
};
