
import { useState, useEffect } from "react";
import { useBooking } from "@/hooks/useBooking";
import { BookingCard } from "@/components/booking/BookingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, RefreshCw } from "lucide-react";

const ClientBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { fetchUserBookings, cancelBooking, loading: actionLoading } = useBooking();

  const loadBookings = async () => {
    setLoading(true);
    const result = await fetchUserBookings();
    if (result.success && result.data) {
      setBookings(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    const result = await cancelBooking(bookingId);
    if (result.success) {
      await loadBookings();
    }
  };

  const filterBookings = (status: string) => {
    const now = new Date();
    
    switch (status) {
      case "upcoming":
        return bookings.filter(b => 
          b.status === 'booked' && 
          b.date_time && 
          new Date(b.date_time) > now
        );
      case "past":
        return bookings.filter(b => 
          (b.status === 'completed' || 
           (b.status === 'booked' && b.date_time && new Date(b.date_time) <= now))
        );
      case "cancelled":
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const upcomingBookings = filterBookings("upcoming");
  const pastBookings = filterBookings("past");
  const cancelledBookings = filterBookings("cancelled");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Мои бронирования</h1>
            <p className="text-slate-300">Управляйте своими записями</p>
          </div>
          <Button
            onClick={loadBookings}
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Предстоящие ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Прошедшие ({pastBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Отменённые ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">Нет предстоящих бронирований</h3>
                  <p className="text-slate-400 mb-4">
                    Забронируйте зал или запишитесь на занятие
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Найти залы
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                    loading={actionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">Нет прошедших бронирований</h3>
                  <p className="text-slate-400">
                    Здесь будет история ваших посещений
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                    loading={actionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-8 text-center">
                  <h3 className="text-white font-semibold mb-2">Нет отменённых бронирований</h3>
                  <p className="text-slate-400">
                    Отменённые бронирования будут отображаться здесь
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cancelledBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                    loading={actionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientBookings;
