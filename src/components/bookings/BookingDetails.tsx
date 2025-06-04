
import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DarkCard } from "@/components/ui/dark-card";
import { MapPin, User, Calendar, Clock } from "lucide-react";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingActions } from "./BookingActions";

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
  onCancel?: (bookingId: string) => void;
  onReschedule?: (bookingId: string) => void;
  onSetReminder?: (bookingId: string) => void;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  booking, 
  className,
  onCancel,
  onReschedule,
  onSetReminder 
}) => {
  return (
    <DarkCard className={`overflow-hidden animate-fade-in ${className || ""}`} hoverEffect="raise">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-medium text-white">Детали бронирования</h2>
          <BookingStatusBadge status={booking.status} />
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
        
        <BookingActions
          bookingId={booking.id}
          status={booking.status}
          onCancel={onCancel}
          onReschedule={onReschedule}
          onSetReminder={onSetReminder}
        />
      </div>
    </DarkCard>
  );
};
