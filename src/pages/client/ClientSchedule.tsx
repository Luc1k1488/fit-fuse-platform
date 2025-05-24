
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingWithGym {
  id: string;
  date_time: string;
  status: string;
  gym: {
    id: string;
    name: string;
    address: string;
  };
}

const ClientSchedule = () => {
  const { user, is_authenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Получаем бронирования пользователя
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          gym:gym_id (
            id,
            name,
            address
          )
        `)
        .eq("user_id", user.id)
        .order("date_time", { ascending: true });

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }

      return (data as BookingWithGym[]) || [];
    },
    enabled: is_authenticated && !!user?.id,
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
        description: "Ваше бронирование успешно отменено",
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

  if (!is_authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white animate-fade-in">Расписание</h1>
        </div>
        <div className="px-4 py-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                Необходимо войти в систему
              </h3>
              <p className="text-slate-300">
                Для просмотра расписания необходимо войти в систему
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcomingBookings = bookings?.filter(booking => 
    booking.status === "confirmed" && new Date(booking.date_time) > now
  ) || [];
  
  const completedBookings = bookings?.filter(booking => 
    booking.status === "confirmed" && new Date(booking.date_time) <= now
  ) || [];

  const getTypeColor = (status: string) => {
    switch(status) {
      case "confirmed": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const ScheduleCard = ({ booking, showCancelButton = false }: { booking: BookingWithGym; showCancelButton?: boolean }) => (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Посещение зала</h3>
            <p className="text-sm text-slate-300 font-medium">{booking.gym?.name || "Зал"}</p>
          </div>
          <Badge className={getTypeColor(booking.status)}>
            {booking.status === "confirmed" && "Подтверждено"}
            {booking.status === "cancelled" && "Отменено"}
            {booking.status === "pending" && "Ожидание"}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-300">
            <Clock className="h-4 w-4 mr-2 text-blue-400" />
            <span>{format(new Date(booking.date_time), "d MMMM yyyy, HH:mm", { locale: ru })}</span>
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <MapPin className="h-4 w-4 mr-2 text-purple-400" />
            <span>{booking.gym?.address || "Адрес не указан"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-400">
            ID: {booking.id.slice(0, 8)}...
          </p>
          {showCancelButton && booking.status === "confirmed" && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => cancelBookingMutation.mutate(booking.id)}
              disabled={cancelBookingMutation.isPending}
              className="text-sm bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
            >
              {cancelBookingMutation.isPending ? "Отмена..." : "Отменить"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white animate-fade-in">Расписание</h1>
        </div>
        <div className="px-4 py-6">
          <div className="text-center py-12">
            <p className="text-slate-300">Загрузка расписания...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white animate-fade-in">Расписание</h1>
        </div>
        <div className="px-4 py-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                Ошибка загрузки
              </h3>
              <p className="text-slate-300">
                Не удалось загрузить расписание
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Заголовок */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white animate-fade-in">Расписание</h1>
        <p className="text-slate-300 mt-1 animate-fade-in animation-delay-200">Ваши занятия и бронирования</p>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300"
            >
              Предстоящие ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300"
            >
              Завершенные ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <ScheduleCard key={booking.id} booking={booking} showCancelButton={true} />
              ))
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Нет предстоящих занятий
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Забронируйте посещение зала, чтобы начать тренировки
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white transition-all hover:scale-105">
                    Найти залы
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <ScheduleCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Нет завершенных занятий
                  </h3>
                  <p className="text-slate-300">
                    Здесь будет отображаться история ваших посещений
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientSchedule;
