import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DarkCard } from "@/components/ui/dark-card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Repeat, 
  Bell, 
  Clock 
} from "lucide-react";
import { BookingDetails } from "@/components/bookings/BookingDetails";
import { BookingDialog } from "@/components/bookings/BookingDialog";
import { RecurringBookingDialog } from "@/components/bookings/RecurringBookingDialog";
import { toast } from "sonner";

// Пример данных для бронирований
const mockBookings = [
  {
    id: "booking-1",
    date: new Date(2025, 4, 22), // 22 мая 2025
    classTitle: "Утренняя йога",
    gymName: "Йога Студия Зен",
    time: "8:00 - 9:00",
    instructor: "Елена Смирнова",
    status: "confirmed"
  },
  {
    id: "booking-2",
    date: new Date(2025, 4, 24), // 24 мая 2025
    classTitle: "HIIT Тренировка",
    gymName: "Фитнес Элит",
    time: "18:30 - 19:15",
    instructor: "Дмитрий Кузнецов",
    status: "confirmed"
  },
  {
    id: "booking-3",
    date: new Date(2025, 4, 28), // 28 мая 2025
    classTitle: "Пилатес",
    gymName: "Фитнес Элит",
    time: "11:00 - 12:00",
    instructor: "Ольга Петрова",
    status: "pending"
  }
];

// Преобразование дат бронирований в строки для использования в календаре
const bookingDates = mockBookings.map(booking => format(booking.date, "yyyy-MM-dd"));

const ClientCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  
  // Получение бронирований для выбранного дня
  const getDayBookings = (date: Date | undefined) => {
    if (!date) return [];
    return mockBookings.filter(
      booking => format(booking.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };
  
  // Текущие бронирования для выбранного дня
  const currentDayBookings = getDayBookings(selectedDate);
  
  // Функция для определения классов дня в календаре (с бронированием или без)
  const dayClassName = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return bookingDates.includes(formattedDate) 
      ? "bg-primary/20 rounded-full font-bold text-primary" 
      : "";
  };
  
  // Обработчики действий
  const handleAddBooking = () => {
    if (!selectedDate) {
      toast.error("Пожалуйста, выберите дату");
      return;
    }
    setBookingDialogOpen(true);
  };
  
  const handleAddRecurring = () => {
    setRecurringDialogOpen(true);
  };
  
  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking);
  };
  
  const handleCreateBooking = (bookingData: any) => {
    toast.success("Бронирование создано успешно!");
    setBookingDialogOpen(false);
    // В реальном приложении здесь был бы запрос к API для создания бронирования
  };
  
  const handleCreateRecurring = (recurringData: any) => {
    toast.success("Повторяющиеся бронирования созданы!");
    setRecurringDialogOpen(false);
    // В реальном приложении здесь был бы запрос к API для создания повторяющихся бронирований
  };

  return (
    <div className="pb-16 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Календарь тренировок</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка - Календарь */}
        <div className="md:col-span-2 space-y-4">
          <DarkCard className="p-4" variant="intense">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">
                {selectedDate && format(selectedDate, "LLLL yyyy", { locale: ru })}
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const prevMonth = new Date(selectedDate!);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setSelectedDate(prevMonth);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Предыдущий месяц</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const nextMonth = new Date(selectedDate!);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setSelectedDate(nextMonth);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Следующий месяц</span>
                </Button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md bg-gray-900 border border-gray-800 text-white"
              classNames={{
                day_today: "bg-primary/20 text-primary font-bold",
                day_selected: "bg-primary text-white hover:bg-primary/90 hover:text-white",
                day: (date) => dayClassName(date)
              }}
              showOutsideDays
            />
            
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={handleAddBooking} className="flex-1 transition-all hover:scale-105">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Забронировать
              </Button>
              <Button onClick={handleAddRecurring} variant="secondary" className="flex-1 transition-all hover:scale-105">
                <Repeat className="mr-2 h-4 w-4" />
                Повторяющаяся
              </Button>
            </div>
            
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary/20 mr-1"></div>
                <span>С бронированием</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                <span>Выбранный день</span>
              </div>
            </div>
          </DarkCard>

          {/* Предстоящие бронирования */}
          <DarkCard>
            <div className="p-4">
              <h2 className="text-lg font-medium text-white mb-3">Предстоящие бронирования</h2>
              {mockBookings.length > 0 ? (
                <div className="space-y-3">
                  {mockBookings.map(booking => (
                    <div 
                      key={booking.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer hover:translate-x-1 ${
                        selectedBooking?.id === booking.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-800 bg-gray-900'
                      }`}
                      onClick={() => handleBookingSelect(booking)}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-white">{booking.classTitle}</h3>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status === 'confirmed' ? 'Подтверждено' : 'В ожидании'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{booking.gymName}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {format(booking.date, "d MMMM, EEEE", { locale: ru })}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {booking.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>У вас пока нет предстоящих бронирований</p>
                </div>
              )}
            </div>
          </DarkCard>
        </div>
        
        {/* Правая колонка - Детали и действия */}
        <div>
          <DarkCard>
            <div className="p-4">
              <h2 className="text-lg font-medium text-white mb-3">
                {selectedDate && (
                  <>
                    {format(selectedDate, "d MMMM", { locale: ru })},&nbsp;
                    {format(selectedDate, "EEEE", { locale: ru })}
                  </>
                )}
              </h2>
              
              {currentDayBookings.length > 0 ? (
                <div className="space-y-4">
                  {currentDayBookings.map(booking => (
                    <div 
                      key={booking.id} 
                      className="border border-gray-800 p-3 rounded-lg bg-gray-900"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white">{booking.classTitle}</h3>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status === 'confirmed' ? 'Подтверждено' : 'В ожидании'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{booking.gymName}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {booking.time}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Инструктор: {booking.instructor}
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs w-full">
                          Отменить
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs w-8 p-0">
                          <Bell className="h-3 w-3" />
                          <span className="sr-only">Напоминание</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center border border-dashed border-gray-800 rounded-lg">
                  <CalendarIcon className="h-8 w-8 mx-auto text-gray-500" />
                  <p className="mt-2 text-gray-500">Нет забронированных занятий на этот день</p>
                  <Button onClick={handleAddBooking} className="mt-3">
                    Забронировать
                  </Button>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="font-medium text-white mb-2">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleAddBooking}>
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Новое
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleAddRecurring}>
                    <Repeat className="h-3 w-3 mr-1" />
                    Повторяющееся
                  </Button>
                </div>
              </div>
            </div>
          </DarkCard>
          
          {/* Информация о выбранном бронировании */}
          {selectedBooking && (
            <BookingDetails booking={selectedBooking} className="mt-4" />
          )}
        </div>
      </div>
      
      {/* Диалоги для создания бронирований */}
      <BookingDialog 
        open={bookingDialogOpen} 
        onOpenChange={setBookingDialogOpen} 
        date={selectedDate} 
        onSubmit={handleCreateBooking} 
      />
      
      <RecurringBookingDialog 
        open={recurringDialogOpen} 
        onOpenChange={setRecurringDialogOpen} 
        onSubmit={handleCreateRecurring} 
      />
    </div>
  );
};

export default ClientCalendar;
