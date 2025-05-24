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
      case "crossfit": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "strength": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "aqua": return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "yoga": return "bg-green-500/20 text-green-300 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const ScheduleCard = ({ item }: { item: ScheduleItem }) => (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-slate-300 font-medium">{item.gym}</p>
          </div>
          <Badge className={getTypeColor(item.type)}>
            {item.type === "crossfit" && "Кроссфит"}
            {item.type === "strength" && "Силовая"}
            {item.type === "aqua" && "Аква"}
            {item.type === "yoga" && "Йога"}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-300">
            <Clock className="h-4 w-4 mr-2 text-blue-400" />
            <span>{item.time} • {item.duration} мин</span>
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <MapPin className="h-4 w-4 mr-2 text-purple-400" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <Users className="h-4 w-4 mr-2 text-green-400" />
            <span>{item.enrolled}/{item.capacity} участников</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-400">
            Тренер: {item.instructor}
          </p>
          {item.status === "upcoming" && (
            <Button size="sm" variant="outline" className="text-sm bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
              Отменить
            </Button>
          )}
          {item.status === "completed" && (
            <Button size="sm" variant="outline" className="text-sm bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
              Повторить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
              Предстоящие
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300"
            >
              Завершенные
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((item) => (
                <ScheduleCard key={item.id} item={item} />
              ))
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Нет предстоящих занятий
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Забронируйте занятие, чтобы начать тренировки
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white transition-all hover:scale-105">
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
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Нет завершенных занятий
                  </h3>
                  <p className="text-slate-300">
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
