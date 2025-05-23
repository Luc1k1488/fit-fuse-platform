
import { Button } from "@/components/ui/button";
import { days } from "./classConstants";

interface DaySelectorProps {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

export const DaySelector = ({ selectedDay, setSelectedDay }: DaySelectorProps) => {
  return (
    <div className="mb-4 animate-fade-in animation-delay-300">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <Button
            key={day}
            variant={selectedDay === index ? "default" : "outline"}
            className={`p-1 h-auto flex flex-col items-center transition-all ${
              selectedDay === index ? "bg-primary" : "bg-gray-800 border-gray-700 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedDay(index)}
          >
            <span className="text-xs">{day}</span>
            <span className="mt-1 text-sm font-bold">
              {new Date().getDate() + index - new Date().getDay()}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
