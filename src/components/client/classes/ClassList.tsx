
import { ClassCard } from "./ClassCard";
import { NoClassesFound } from "./NoClassesFound";
import { formatDate, getDateForDay } from "./classConstants";

interface ClassListProps {
  classes: Array<{
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
  }>;
  selectedDay: number;
  favoriteClasses: string[];
  toggleFavorite: (classId: string) => void;
  resetFilters: () => void;
}

export const ClassList = ({ 
  classes, 
  selectedDay, 
  favoriteClasses, 
  toggleFavorite,
  resetFilters
}: ClassListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-white animate-fade-in">
        Расписание на {formatDate(getDateForDay(selectedDay))}
      </h2>
      
      {classes.length > 0 ? (
        <div className="space-y-4">
          {classes.map((classItem, idx) => (
            <ClassCard 
              key={classItem.id}
              classItem={classItem}
              isFavorite={favoriteClasses.includes(classItem.id)}
              toggleFavorite={toggleFavorite}
              index={idx}
            />
          ))}
        </div>
      ) : (
        <NoClassesFound resetFilters={resetFilters} />
      )}
    </div>
  );
};
