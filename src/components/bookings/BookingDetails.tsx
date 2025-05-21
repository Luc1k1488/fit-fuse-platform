
import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DarkCard } from "@/components/ui/dark-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, X, Bell } from "lucide-react";
import { toast } from "sonner";

interface BookingDetailsProps {
  booking: {
    id: string;
    date: Date;
    classTitle: string;
    gymName: string;
    time: string;
    instructor: string;
    status: string;
  };
  className?: string;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, className }) => {
  const handleCancelBooking = () => {
    toast.info("Отмена бронирования...", {
      description: "В реальном приложении здесь был бы запрос к API",
    });
    // В реальном приложении здесь был бы запрос к API для отмены бронирования
  };
  
  const handleSetReminder = () => {
    toast.success("Напоминание установлено!");
    // В реальном приложении здесь был бы запрос к API для установки напоминания
  };
  
  const handleReschedule = () => {
    toast.info("Открываем диалог переноса бронирования");
    // В реальном приложении здесь был бы вызов диалога для переноса бронирования
  };
  
  return (
    <DarkCard className={`overflow-hidden animate-fade-in ${className || ""}`} hoverEffect="raise">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-medium text-white">Детали бронирования</h2>
          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
            {booking.status === 'confirmed' ? 'Подтверждено' : 'В ожидании'}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-white">{booking.classTitle}</h3>
          <div className="flex items-center text-sm text-gray-400">
            <MapPin className="h-4 w-4 mr-1" />
            {booking.gymName}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              {format(booking.date, "d MMMM, EEEE", { locale: ru })}
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {booking.time}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-400">
              <User className="h-4 w-4 mr-1" />
              Инструктор: {booking.instructor}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleCancelBooking} 
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
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSetReminder}
          className="w-full transition-all hover:scale-105"
        >
          <Bell className="h-4 w-4 mr-1" />
          Установить напоминание
        </Button>
      </div>
    </DarkCard>
  );
};
