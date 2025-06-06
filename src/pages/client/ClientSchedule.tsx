
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ClassWithGym } from "@/types";
import { toast } from "sonner";

const ClientSchedule = () => {
  const [classes, setClasses] = useState<ClassWithGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("today");

  const daysOfWeek = [
    { id: "today", name: "Сегодня", date: new Date() },
    { id: "tomorrow", name: "Завтра", date: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    { id: "week", name: "На неделе", date: new Date() }
  ];

  useEffect(() => {
    fetchClasses();
  }, [selectedDay]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let startDate = today;
      let endDate = new Date(today);
      
      if (selectedDay === "tomorrow") {
        startDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (selectedDay === "week") {
        endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else {
        endDate.setHours(23, 59, 59, 999);
      }

      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          gym:gym_id (*)
        `)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching classes:', error);
        toast.error('Ошибка загрузки расписания');
        return;
      }

      const typedClasses: ClassWithGym[] = (data || []).map(classItem => ({
        ...classItem,
        gym: {
          ...classItem.gym,
          description: classItem.gym?.description || null,
          phone: classItem.gym?.phone || null,
        }
      }));

      setClasses(typedClasses);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const groupClassesByTime = (classes: ClassWithGym[]) => {
    const groups: { [key: string]: ClassWithGym[] } = {};
    
    classes.forEach(classItem => {
      if (classItem.start_time) {
        const hour = new Date(classItem.start_time).getHours();
        let timeSlot = "";
        
        if (hour < 12) timeSlot = "Утро (до 12:00)";
        else if (hour < 17) timeSlot = "День (12:00-17:00)";
        else timeSlot = "Вечер (после 17:00)";
        
        if (!groups[timeSlot]) groups[timeSlot] = [];
        groups[timeSlot].push(classItem);
      }
    });
    
    return groups;
  };

  const handleBookClass = (classId: string) => {
    toast.success("Занятие забронировано!", {
      description: "Мы отправили подтверждение на ваш email"
    });
  };

  const groupedClasses = groupClassesByTime(classes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Расписание</h1>
        <p className="text-slate-300">Выберите занятие и запишитесь</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {daysOfWeek.map((day) => (
            <Button
              key={day.id}
              variant={selectedDay === day.id ? "default" : "outline"}
              onClick={() => setSelectedDay(day.id)}
              className={`whitespace-nowrap ${
                selectedDay === day.id
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              {day.name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : Object.keys(groupedClasses).length === 0 ? (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Занятий не найдено</h3>
              <p className="text-slate-400 mb-4">
                На выбранный период занятия не запланированы
              </p>
              <Button onClick={() => setSelectedDay("week")}>
                Посмотреть на неделе
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedClasses).map(([timeSlot, timeClasses]) => (
              <Card key={timeSlot} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{timeSlot}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {timeClasses.map((classItem) => (
                    <div key={classItem.id} className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {classItem.title}
                          </h3>
                          {classItem.description && (
                            <p className="text-slate-300 text-sm mb-2">{classItem.description}</p>
                          )}
                        </div>
                        {classItem.category && (
                          <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">
                            {classItem.category}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        {classItem.start_time && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(classItem.start_time).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {classItem.end_time && 
                                ` - ${new Date(classItem.end_time).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}`
                              }
                            </span>
                          </div>
                        )}

                        {classItem.instructor && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Users className="h-4 w-4" />
                            <span>{classItem.instructor}</span>
                          </div>
                        )}

                        {classItem.gym && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="h-4 w-4" />
                            <span>{classItem.gym.name}</span>
                          </div>
                        )}

                        {classItem.capacity && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Users className="h-4 w-4" />
                            <span>
                              {classItem.booked_count || 0}/{classItem.capacity} мест
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-slate-400 text-sm">
                          {classItem.gym?.location && (
                            <span>{classItem.gym.location}</span>
                          )}
                        </div>
                        <Button
                          onClick={() => handleBookClass(classItem.id)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={classItem.booked_count >= (classItem.capacity || 0)}
                        >
                          {classItem.booked_count >= (classItem.capacity || 0) ? "Мест нет" : "Записаться"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSchedule;
