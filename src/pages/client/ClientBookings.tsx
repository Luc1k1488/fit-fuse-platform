
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { Booking, Gym, GymClass } from "@/types";
import { toast } from "sonner";

interface BookingWithDetails extends Booking {
  gym?: Gym;
  class?: GymClass;
}

const ClientBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          gym:gym_id (*),
          class:class_id (*)
        `)
        .eq('user_id', user.id)
        .order('date_time', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Ошибка загрузки бронирований');
        return;
      }

      // Приводим к правильному типу
      const typedBookings: BookingWithDetails[] = (data || []).map(booking => ({
        ...booking,
        status: booking.status as "booked" | "completed" | "cancelled",
        gym: booking.gym ? {
          ...booking.gym,
          description: booking.gym?.description || null,
          phone: booking.gym?.phone || null,
        } : undefined
      }));

      setBookings(typedBookings);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Ошибка отмены бронирования');
        return;
      }

      toast.success('Бронирование отменено');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка отмены бронирования');
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'booked' && 
    booking.date_time && 
    new Date(booking.date_time) > new Date()
  );

  const pastBookings = bookings.filter(booking => 
    booking.date_time && 
    new Date(booking.date_time) <= new Date()
  );

  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white">Мои бронирования</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  const BookingCard = ({ booking, showCancelButton = false }: { 
    booking: BookingWithDetails; 
    showCancelButton?: boolean;
  }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {booking.class?.title || "Тренировка"}
          </h3>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{booking.gym?.name}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          booking.status === 'booked' ? 'bg-green-600/30 text-green-300' :
          booking.status === 'cancelled' ? 'bg-red-600/30 text-red-300' :
          'bg-gray-600/30 text-gray-300'
        }`}>
          {booking.status === 'booked' ? 'Забронировано' :
           booking.status === 'cancelled' ? 'Отменено' :
           booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="h-4 w-4" />
          <span>
            {booking.date_time ? 
              new Date(booking.date_time).toLocaleDateString() : 
              'Дата не указана'
            }
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="h-4 w-4" />
          <span>
            {booking.date_time ? 
              new Date(booking.date_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              }) : 
              'Время не указано'
            }
          </span>
        </div>
      </div>

      {booking.class?.instructor && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <User className="h-4 w-4" />
          <span>Инструктор: {booking.class.instructor}</span>
        </div>
      )}

      {showCancelButton && booking.status === 'booked' && (
        <div className="pt-2">
          <Button
            onClick={() => cancelBooking(booking.id)}
            variant="destructive"
            size="sm"
          >
            Отменить бронирование
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Мои бронирования</h1>
        <p className="text-slate-300">Управляйте своими записями на тренировки</p>
      </div>

      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Предстоящие ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Прошедшие ({pastBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Отмененные ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 mb-4">У вас нет предстоящих бронирований</p>
                <Button asChild>
                  <a href="/app/classes">Найти занятия</a>
                </Button>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showCancelButton={true} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">У вас нет прошедших тренировок</p>
              </div>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-6">
            {cancelledBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">У вас нет отмененных бронирований</p>
              </div>
            ) : (
              cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientBookings;
