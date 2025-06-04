
import { Button } from "@/components/ui/button";
import { X, Calendar, Bell } from "lucide-react";
import { toast } from "sonner";

interface BookingActionsProps {
  bookingId: string;
  status: string;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (bookingId: string) => void;
  onSetReminder?: (bookingId: string) => void;
}

export const BookingActions = ({ 
  bookingId, 
  status, 
  onCancel,
  onReschedule,
  onSetReminder 
}: BookingActionsProps) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel(bookingId);
    } else {
      toast.info("Отмена бронирования в разработке");
    }
  };

  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(bookingId);
    } else {
      toast.info("Перенос бронирования в разработке");
    }
  };

  const handleSetReminder = () => {
    if (onSetReminder) {
      onSetReminder(bookingId);
    } else {
      toast.success("Напоминание установлено!");
    }
  };

  if (status === 'cancelled' || status === 'completed') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleCancel}
        className="transition-all hover:scale-105"
      >
        <X className="h-4 w-4 mr-1" />
        Отменить
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleReschedule}
        className="transition-all hover:scale-105"
      >
        <Calendar className="h-4 w-4 mr-1" />
        Перенести
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSetReminder}
        className="transition-all hover:scale-105"
      >
        <Bell className="h-4 w-4 mr-1" />
        Напоминание
      </Button>
    </div>
  );
};
