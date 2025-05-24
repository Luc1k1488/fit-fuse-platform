
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { Booking, Class, Gym } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus } from "lucide-react";

// Расширенный тип для бронирований с деталями
interface BookingWithDetails extends Booking {
  class: Class & { gym: Gym };
}

const ClientSchedule = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Получаем бронирования пользователя
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          class:class_id (
            *,
            gym:gym_id (*)
          )
        `)
        .eq("user_id", user.id)
        .order("date_time", { ascending: true });

      if (error) throw error;
      return data as BookingWithDetails[];
    },
    enabled: !!user?.id,
  });

  // Получаем доступные занятия на выбранную дату
  const { data: availableClasses, isLoading: classesLoading } = useQuery({
    queryKey: ["available-classes", selectedDate],
    queryFn: async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          gym:gym_id (*)
        `)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data as (Class & { gym: Gym })[];
    },
  });

  // Фильтруем бронирования по выбранной дате
  const dayBookings = bookings?.filter(booking => 
    booking.date_time && isSameDay(parseISO(booking.date_time), selectedDate)
  ) || [];

  // Получаем даты с бронированиями для подсветки в календаре
  const bookingDates = bookings?.map(booking => 
    booking.date_time ? parseISO(booking.date_time) : null
  ).filter(Boolean) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Подтверждено";
      case "pending":
        return "Ожидает";
      case "cancelled":
        return "Отменено";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Расписание</h1>
          <p className="text-gray-600">Управляйте своими бронированиями и записывайтесь на занятия</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Календарь */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Календарь
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ru}
                  className="rounded-md border"
                  modifiers={{
                    booked: bookingDates
                  }}
                  modifiersStyles={{
                    booked: { backgroundColor: '#3b82f6', color: 'white' }
                  }}
                />
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>Дни с бронированиями</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bookings">Мои бронирования</TabsTrigger>
                <TabsTrigger value="available">Доступные занятия</TabsTrigger>
              </TabsList>

              {/* Мои бронирования */}
              <TabsContent value="bookings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Бронирования на {format(selectedDate, "d MMMM yyyy", { locale: ru })}
                  </h2>
                  <Badge variant="outline">
                    {dayBookings.length} {dayBookings.length === 1 ? 'занятие' : 'занятий'}
                  </Badge>
                </div>

                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : dayBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">На эту дату нет бронирований</p>
                      <Button variant="outline" onClick={() => document.querySelector('[data-value="available"]')?.click()}>
                        Посмотреть доступные занятия
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  dayBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {booking.class?.title || "Занятие"}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {booking.class?.start_time && format(parseISO(booking.class.start_time), "HH:mm", { locale: ru })} - 
                                  {booking.class?.end_time && format(parseISO(booking.class.end_time), "HH:mm", { locale: ru })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.class?.gym?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{booking.class?.instructor}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                        
                        {booking.status === "confirmed" && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Отменить
                            </Button>
                            <Button variant="outline" size="sm">
                              Перенести
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Доступные занятия */}
              <TabsContent value="available" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Занятия на {format(selectedDate, "d MMMM yyyy", { locale: ru })}
                  </h2>
                  <Badge variant="outline">
                    {availableClasses?.length || 0} {availableClasses?.length === 1 ? 'занятие' : 'занятий'}
                  </Badge>
                </div>

                {classesLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : availableClasses?.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">На эту дату нет доступных занятий</p>
                    </CardContent>
                  </Card>
                ) : (
                  availableClasses?.map((classItem) => (
                    <Card key={classItem.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{classItem.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {classItem.start_time && format(parseISO(classItem.start_time), "HH:mm", { locale: ru })} - 
                                  {classItem.end_time && format(parseISO(classItem.end_time), "HH:mm", { locale: ru })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{classItem.gym?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{classItem.instructor}</span>
                              </div>
                            </div>
                            {classItem.description && (
                              <p className="text-sm text-gray-600 mt-3">{classItem.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-2">
                              {classItem.booked_count || 0} / {classItem.capacity || 0} мест
                            </div>
                            <Button size="sm" className="gap-2">
                              <Plus className="h-4 w-4" />
                              Записаться
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSchedule;
