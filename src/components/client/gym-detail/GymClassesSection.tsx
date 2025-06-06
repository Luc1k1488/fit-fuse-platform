
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, BookOpen } from "lucide-react";

export interface GymClassesSectionProps {
  gymId: string;
}

interface GymClass {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  start_time: string | null;
  end_time: string | null;
  capacity: number | null;
  booked_count: number | null;
}

export const GymClassesSection = ({ gymId }: GymClassesSectionProps) => {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!gymId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("classes")
          .select()
          .eq("gym_id", gymId)
          .order("start_time");
          
        if (error) {
          console.error("Error fetching classes:", error);
        } else {
          setClasses(data || []);
        }
      } catch (error) {
        console.error("Exception fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, [gymId]);

  // Format time
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "";
    
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDifficultyColor = (title: string) => {
    if (title.includes("продвинутый")) return "bg-red-500/20 text-red-300";
    if (title.includes("средний")) return "bg-yellow-500/20 text-yellow-300";
    return "bg-green-500/20 text-green-300";
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Занятия</h2>
        <Button variant="outline" size="sm">
          Все занятия
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : classes.length > 0 ? (
        <div className="space-y-4">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{classItem.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <User className="h-4 w-4 mr-1" />
                      <span>{classItem.instructor || "Нет информации об инструкторе"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(classItem.title)}`}>
                    {classItem.title.includes("продвинутый") ? "Сложный" : 
                     classItem.title.includes("средний") ? "Средний" : "Начальный"}
                  </div>
                </div>
                
                {classItem.description && (
                  <p className="mt-3 text-sm text-gray-400">{classItem.description}</p>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <span>Свободно: </span>
                    <span className="font-medium text-white">
                      {classItem.capacity && classItem.booked_count 
                        ? classItem.capacity - classItem.booked_count 
                        : "∞"}
                    </span>
                  </div>
                  <Button size="sm">Забронировать</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">
              Нет доступных занятий
            </h3>
            <p className="text-gray-400 mb-4">
              На данный момент для этого зала не добавлены занятия.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
};
