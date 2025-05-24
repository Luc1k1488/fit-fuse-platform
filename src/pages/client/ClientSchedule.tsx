
import { useState } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduleItem {
  id: string;
  title: string;
  gym: string;
  location: string;
  time: string;
  date: string;
  duration: number;
  instructor: string;
  capacity: number;
  enrolled: number;
  type: string;
  status: "upcoming" | "completed" | "cancelled";
}

const ClientSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Тестовые данные расписания
  const scheduleItems: ScheduleItem[] = [
    {
      id: "1",
      title: "Кроссфит WOD",
      gym: "CrossFit Arena",
      location: "ул. Спортивная, 15",
      time: "09:00",
      date: "2025-01-24",
      duration: 60,
      instructor: "Анна Петрова",
      capacity: 15,
      enrolled: 12,
      type: "crossfit",
      status: "upcoming"
    },
    {
      id: "2", 
      title: "Силовая тренировка",
      gym: "Сергей",
      location: "ул. Фитнес, 10",
      time: "18:00",
      date: "2025-01-24",
      duration: 90,
      instructor: "Михаил Иванов",
      capacity: 10,
      enrolled: 8,
      type: "strength",
      status: "upcoming"
    },
    {
      id: "3",
      title: "Аквааэробика",
      gym: "Aqua Center", 
      location: "ул. Водная, 5",
      time: "11:00",
      date: "2025-01-25",
      duration: 45,
      instructor: "Елена Смирнова",
      capacity: 20,
      enrolled: 15,
      type: "aqua",
      status: "upcoming"
    },
    {
      id: "4",
      title: "Хатха-йога",
      gym: "Zen Yoga Studio",
      location: "ул. Гармония, 7", 
      time: "19:30",
      date: "2025-01-23",
      duration: 75,
      instructor: "Ольга Козлова",
      capacity: 12,
      enrolled: 12,
      type: "yoga",
      status: "completed"
    }
  ];

  const upcomingClasses = scheduleItems.filter(item => item.status === "upcoming");
  const completedClasses = scheduleItems.filter(item => item.status === "completed");

  const getTypeColor = (type: string) => {
    switch(type) {
      case "crossfit": return "bg-orange-100 text-orange-800";
      case "strength": return "bg-blue-100 text-blue-800";
      case "aqua": return "bg-cyan-100 text-cyan-800";
      case "yoga": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const ScheduleCard = ({ item }: { item: ScheduleItem }) => (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{item.gym}</p>
          </div>
          <Badge className={getTypeColor(item.type)}>
            {item.type === "crossfit" && "Кроссфит"}
            {item.type === "strength" && "Силовая"}
            {item.type === "aqua" && "Аква"}
            {item.type === "yoga" && "Йога"}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{item.time} • {item.duration} мин</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{item.enrolled}/{item.capacity} участников</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Тренер: {item.instructor}
          </p>
          {item.status === "upcoming" && (
            <Button size="sm" variant="outline" className="text-sm">
              Отменить
            </Button>
          )}
          {item.status === "completed" && (
            <Button size="sm" variant="outline" className="text-sm">
              Повторить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Расписание</h1>
        <p className="text-gray-600 mt-1">Ваши занятия и бронирования</p>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Предстоящие
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Завершенные
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((item) => (
                <ScheduleCard key={item.id} item={item} />
              ))
            ) : (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Нет предстоящих занятий
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Забронируйте занятие, чтобы начать тренировки
                  </p>
                  <Button>
                    Найти занятия
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedClasses.length > 0 ? (
              completedClasses.map((item) => (
                <ScheduleCard key={item.id} item={item} />
              ))
            ) : (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Нет завершенных занятий
                  </h3>
                  <p className="text-gray-500">
                    Здесь будет отображаться история ваших тренировок
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
