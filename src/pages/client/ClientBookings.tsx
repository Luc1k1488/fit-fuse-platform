
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Booking, Gym, Class } from "@/types";

// Extended type for bookings with details
interface BookingWithDetails extends Booking {
  gym?: Gym;
  class?: Class;
}

// Вспомогательная функция для форматирования даты
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Дата не указана";
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', weekday: 'short' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const ClientBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const queryClient = useQueryClient();

  // Получаем бронирования пользователя
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Fetching bookings for user:", user.id);
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          gym:gym_id (*),
          class:class_id (*)
        `)
        .eq("user_id", user.id)
        .order('date_time', { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }

      console.log("Bookings loaded:", data);
      return data as BookingWithDetails[];
    },
    enabled: !!user?.id,
  });

  // Мутация для отмены бронирования
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Бронирование отменено",
        description: "Ваше бронирование было успешно отменено",
      });
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
    onError: (error) => {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отменить бронирование",
      });
    },
  });

  // Функция для отмены бронирования
  const handleCancelBooking = (bookingId: string) => {
    cancelBookingMutation.mutate(bookingId);
  };

  // Фильтруем бронирования по статусу
  const filterBookingsByStatus = (status: string) => {
    if (!bookings) return [];
    
    const now = new Date();
    
    switch (status) {
      case "upcoming":
        return bookings.filter(booking => 
          booking.status !== "cancelled" && 
          booking.date_time && 
          new Date(booking.date_time) > now
        );
      case "past":
        return bookings.filter(booking => 
          booking.status !== "cancelled" && 
          booking.date_time && 
          new Date(booking.date_time) <= now
        );
      case "cancelled":
        return bookings.filter(booking => booking.status === "cancelled");
      default:
        return [];
    }
  };

  const upcomingBookings = filterBookingsByStatus("upcoming");
  const pastBookings = filterBookingsByStatus("past");
  const cancelledBookings = filterBookingsByStatus("cancelled");

  if (isLoading) {
    return (
      <div className="pb-16">
        <h1 className="text-2xl font-bold mb-4">Мои бронирования</h1>
        <div className="text-center py-12">
          <p className="text-gray-400">Загрузка бронирований...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pb-16">
        <h1 className="text-2xl font-bold mb-4">Мои бронирования</h1>
        <div className="text-center py-12 bg-red-900/20 text-red-400 rounded-lg">
          <p>Ошибка при загрузке бронирований</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-4">Мои бронирования</h1>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Предстоящие ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Прошедшие ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Отмененные ({cancelledBookings.length})</TabsTrigger>
        </TabsList>
        
        {/* Предстоящие бронирования */}
        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-row">
                    <div className="w-1/3 h-24">
                      <img 
                        src={booking.gym?.main_image || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"} 
                        alt={booking.class?.title || booking.gym?.name || ""} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 w-2/3 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{booking.class?.title || "Занятие"}</h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.gym?.name}, {booking.gym?.location}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {formatDate(booking.date_time)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {booking.date_time ? new Date(booking.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : "Время не указано"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-xs" 
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                        >
                          {cancelBookingMutation.isPending ? "Отмена..." : "Отменить"}
                        </Button>
                        <Badge variant="default">Подтверждено</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="mt-2 text-gray-400">У вас нет предстоящих бронирований</p>
              <Button className="mt-4" asChild>
                <a href="/app/classes">Найти занятия</a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Прошедшие бронирования */}
        <TabsContent value="past">
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-row">
                    <div className="w-1/3 h-24">
                      <img 
                        src={booking.gym?.main_image || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"} 
                        alt={booking.class?.title || booking.gym?.name || ""} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">{booking.class?.title || "Занятие"}</h3>
                          <Badge variant="default">Завершено</Badge>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.gym?.name}, {booking.gym?.location}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {formatDate(booking.date_time)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {booking.date_time ? new Date(booking.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : "Время не указано"}
                        </div>
                      </div>
                      <Button size="sm" className="mt-2 text-xs">Оставить отзыв</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="mt-2 text-gray-400">У вас нет прошедших бронирований</p>
            </div>
          )}
        </TabsContent>
        
        {/* Отмененные бронирования */}
        <TabsContent value="cancelled">
          {cancelledBookings.length > 0 ? (
            <div className="space-y-4">
              {cancelledBookings.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-row">
                    <div className="w-1/3 h-24">
                      <img 
                        src={booking.gym?.main_image || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"} 
                        alt={booking.class?.title || booking.gym?.name || ""} 
                        className="w-full h-full object-cover opacity-70"
                      />
                    </div>
                    <div className="p-3 w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">{booking.class?.title || "Занятие"}</h3>
                          <Badge variant="secondary">Отменено</Badge>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.gym?.name}, {booking.gym?.location}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {formatDate(booking.date_time)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {booking.date_time ? new Date(booking.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : "Время не указано"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900 rounded-lg">
              <Check className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="mt-2 text-gray-400">У вас нет отмененных бронирований</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientBookings;
