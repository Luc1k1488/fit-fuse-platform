
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DateTimePickerProps {
  onDateTimeSelect: (dateTime: string) => void;
  selectedDateTime?: string;
  availableSlots?: TimeSlot[];
  minDate?: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onDateTimeSelect,
  selectedDateTime,
  availableSlots,
  minDate = new Date()
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedDateTime ? new Date(selectedDateTime) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    selectedDateTime ? format(new Date(selectedDateTime), "HH:mm") : ""
  );

  // Генерируем временные слоты с 6:00 до 23:00 с интервалом в 30 минут
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour < 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: availableSlots?.find(slot => slot.time === time)?.available ?? true
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const dateTime = `${format(date, 'yyyy-MM-dd')}T${selectedTime}:00`;
      onDateTimeSelect(dateTime);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const dateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`;
      onDateTimeSelect(dateTime);
    }
  };

  return (
    <div className="space-y-6">
      {/* Календарь для выбора даты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5" />
            Выберите дату
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < minDate}
            initialFocus
            className={cn("w-full pointer-events-auto")}
          />
        </CardContent>
      </Card>

      {/* Выбор времени */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Выберите время
            </CardTitle>
            <p className="text-sm text-gray-600">
              {format(selectedDate, "d MMMM yyyy", { locale: ru })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  size="sm"
                  disabled={!slot.available}
                  onClick={() => handleTimeSelect(slot.time)}
                  className={cn(
                    "text-xs",
                    selectedTime === slot.time && "bg-purple-600 hover:bg-purple-700",
                    !slot.available && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
            {timeSlots.every(slot => !slot.available) && (
              <p className="text-center text-gray-500 mt-4">
                На выбранную дату нет свободных слотов
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Подтверждение выбора */}
      {selectedDate && selectedTime && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Выбранное время:</p>
              <p className="text-lg font-semibold text-green-700">
                {format(selectedDate, "d MMMM yyyy", { locale: ru })} в {selectedTime}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
