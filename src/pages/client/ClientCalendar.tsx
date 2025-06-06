
import { useState } from "react";
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarEvent {
  id: string;
  title: string;
  gym: string;
  time: string;
  type: "workout" | "class";
  status: "upcoming" | "completed";
}

const ClientCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Пример данных
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Утренняя йога",
      gym: "Фитнес Центр",
      time: "09:00",
      type: "class",
      status: "upcoming"
    },
    {
      id: "2", 
      title: "Силовая тренировка",
      gym: "GYM Premium",
      time: "18:00",
      type: "workout",
      status: "upcoming"
    }
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasEvents = (day: number) => {
    // Здесь будет логика проверки наличия событий на конкретный день
    return day === new Date().getDate(); // Пример: события только на сегодня
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Календарь тренировок</h1>
        <p className="text-slate-300">Планируйте свои занятия</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Calendar */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                <div key={day} className="text-center text-slate-400 text-sm font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, index) => (
                <div key={`empty-${index}`} className="h-10"></div>
              ))}
              
              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm relative transition-colors ${
                      isToday(day)
                        ? 'bg-purple-600 text-white font-bold'
                        : isSelected(day)
                        ? 'bg-purple-600/50 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {day}
                    {hasEvents(day) && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">
              Расписание на {selectedDate.toLocaleDateString()}
            </CardTitle>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-400 mb-4">На этот день ничего не запланировано</p>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700">
                  Найти занятия
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium">{event.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.type === 'class' ? 'bg-blue-600/30 text-blue-300' : 'bg-green-600/30 text-green-300'
                      }`}>
                        {event.type === 'class' ? 'Групповое' : 'Индивидуальное'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.gym}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">5</div>
              <div className="text-sm text-slate-400">Тренировок в этом месяце</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">3</div>
              <div className="text-sm text-slate-400">Дней до следующей тренировки</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientCalendar;
