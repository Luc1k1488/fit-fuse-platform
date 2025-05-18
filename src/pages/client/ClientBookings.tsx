
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Тестовые данные для бронирований
const mock_bookings = {
  upcoming: [
    {
      id: "booking-1",
      classTitle: "Утренняя йога",
      gymName: "Йога Студия Зен",
      location: "Запад",
      date: "2023-06-15",
      time: "8:00 - 9:00",
      image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "booking-2",
      classTitle: "HIIT Тренировка",
      gymName: "Фитнес Элит",
      location: "Центр",
      date: "2023-06-16",
      time: "18:30 - 19:15",
      image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhpaXQlMjBmaXRuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
  ],
  past: [
    {
      id: "booking-3",
      classTitle: "Силовая тренировка",
      gymName: "Пауэр Хаус",
      location: "Садовое кольцо",
      date: "2023-06-10",
      time: "10:00 - 11:00",
      status: "completed",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3ltJTIwd29ya291dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "booking-4",
      classTitle: "Кроссфит",
      gymName: "КроссФит Джанкшн",
      location: "Восток",
      date: "2023-06-08",
      time: "19:00 - 20:00",
      status: "missed",
      image: "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3Jvc3NmaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    }
  ],
  cancelled: [
    {
      id: "booking-5",
      classTitle: "Пилатес",
      gymName: "Фитнес Элит",
      location: "Центр",
      date: "2023-06-12",
      time: "11:00 - 12:00",
      cancelReason: "Тренер заболел",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGlsYXRlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    }
  ]
};

// Вспомогательная функция для форматирования даты
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', weekday: 'short' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const ClientBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Функция для отмены бронирования
  const handleCancelBooking = (bookingId: string) => {
    console.log("Отмена бронирования:", bookingId);
    // В реальном приложении здесь был бы запрос к API
  };
  
  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-4">Мои бронирования</h1>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
          <TabsTrigger value="past">Прошедшие</TabsTrigger>
          <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
        </TabsList>
        
        {/* Предстоящие бронирования */}
        <TabsContent value="upcoming">
          {mock_bookings.upcoming.length > 0 ? (
            <div className="space-y-4">
              {mock_bookings.upcoming.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-row">
                    <div className="w-1/3 h-24">
                      <img 
                        src={booking.image} 
                        alt={booking.classTitle} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 w-2/3 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{booking.classTitle}</h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.gymName}, {booking.location}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {booking.time}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-xs" 
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Отменить
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">У вас нет предстоящих бронирований</p>
              <Button className="mt-4" asChild>
                <a href="/app/classes">Найти занятия</a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Прошедшие бронирования */}
        <TabsContent value="past">
          {mock_bookings.past.length > 0 ? (
            <div className="space-y-4">
              {mock_bookings.past.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-row">
                    <div className="w-1/3 h-24">
                      <img 
                        src={booking.image} 
                        alt={booking.classTitle} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">{booking.classTitle}</h3>
                          <Badge variant={booking.status === "completed" ? "default" : "destructive"}>
                            {booking.status === "completed" ? "Посещено" : "Пропущено"}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.gymName}, {booking.location}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {booking.time}
                        </div>
                      </div>
                      {booking.status === "completed" && (
                        <Button size="sm" className="mt-2 text-xs">Оставить отзыв</Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">У вас нет прошедших бронирований</p>
            </div>
          )}
        </TabsContent>
        
        {/* Отмененные бронирования */}
        <TabsContent value="cancelled">
          {mock_bookings.cancelled.length > 0 ? (
            <div className="space-y-4">
              {mock_bookings.cancelled.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-row">
                    <div className="w-1/3 h-24">
                      <img 
                        src={booking.image} 
                        alt={booking.classTitle} 
                        className="w-full h-full object-cover opacity-70"
                      />
                    </div>
                    <div className="p-3 w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">{booking.classTitle}</h3>
                          <Badge variant="secondary">Отменено</Badge>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.gymName}, {booking.location}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {booking.time}
                        </div>
                        {booking.cancelReason && (
                          <div className="flex items-center mt-1 text-xs text-red-500">
                            <X className="h-3 w-3 mr-1" />
                            Причина: {booking.cancelReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Check className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">У вас нет отмененных бронирований</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientBookings;
