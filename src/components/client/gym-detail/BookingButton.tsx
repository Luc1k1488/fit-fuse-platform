
import { Button } from "@/components/ui/button";

interface BookingButtonProps {
  onBookVisit: () => void;
  isLoading: boolean;
}

export const BookingButton = ({ onBookVisit, isLoading }: BookingButtonProps) => {
  return (
    <Button 
      onClick={onBookVisit}
      disabled={isLoading}
      className="w-full transition-all hover:scale-105 animate-on-load opacity-0 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700" 
      style={{ transform: 'translateY(10px)', transitionDelay: '700ms' }}
    >
      {isLoading ? "Бронирование..." : "Забронировать посещение"}
    </Button>
  );
};
