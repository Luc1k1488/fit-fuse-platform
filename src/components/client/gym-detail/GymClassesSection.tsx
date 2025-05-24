
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkCard } from "@/components/ui/dark-card";

interface ClassItem {
  id: string;
  name: string;
  time: string;
  trainer: string;
}

interface GymClassesSectionProps {
  classes: ClassItem[];
}

export const GymClassesSection = ({ classes }: GymClassesSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2 text-white">Расписание занятий</h3>
      
      {classes.map((classItem, idx) => (
        <DarkCard 
          key={classItem.id} 
          className="mb-3 animate-on-load opacity-0 transition-all duration-500 hover-scale" 
          style={{ transform: 'translateY(10px)', transitionDelay: `${400 + idx * 100}ms` }}
          hoverEffect="raise"
        >
          <div className="p-4">
            <h4 className="font-medium text-white">{classItem.name}</h4>
            <div className="flex items-center text-gray-400 mt-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{classItem.time}</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-400">Тренер: {classItem.trainer}</span>
              <Button size="sm" className="transition-all hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                Записаться
              </Button>
            </div>
          </div>
        </DarkCard>
      ))}
    </div>
  );
};
