
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingData {
  id: string;
  date_time: string | null;
  status: string | null;
  booking_type: string | null;
  notes: string | null;
  gym?: {
    id: string;
    name: string | null;
    location: string | null;
    city: string | null;
    main_image: string | null;
  } | null;
  class?: {
    id: string;
    title: string | null;
    instructor: string | null;
    start_time: string | null;
    end_time: string | null;
  } | null;
}

interface BookingCardProps {
  booking: BookingData;
  onCancel: (bookingId: string) => void;
  loading?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  loading = false
}) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'booked':
        return 'Забронировано';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      default:
        return status || 'Неизвестно';
    }
  };

  const canCancel = booking.status === 'booked' && booking.date_time && 
    new Date(booking.date_time) > new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {booking.booking_type === 'class_booking' ? 'Занятие' : 'Посещение зала'}
          </CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {getStatusText(booking.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {booking.date_time && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(booking.date_time), "d MMMM yyyy", { locale: ru })}
            </span>
            <Clock className="h-4 w-4 ml-2" />
            <span>
              {format(new Date(booking.date_time), "HH:mm", { locale: ru })}
            </span>
          </div>
        )}

        {booking.gym && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <div>
              <span className="font-medium">{booking.gym.name}</span>
              {booking.gym.location && (
                <span className="text-sm text-gray-500 ml-1">
                  - {booking.gym.location}
                </span>
              )}
            </div>
          </div>
        )}

        {booking.class && (
          <div className="space-y-1">
            <div className="font-medium">{booking.class.title}</div>
            {booking.class.instructor && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>Инструктор: {booking.class.instructor}</span>
              </div>
            )}
          </div>
        )}

        {booking.notes && (
          <div className="bg-gray-50 p-3 rounded text-sm">
            <span className="font-medium">Примечания: </span>
            {booking.notes}
          </div>
        )}

        {canCancel && (
          <div className="pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(booking.id)}
              disabled={loading}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              {loading ? "Отмена..." : "Отменить бронирование"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
