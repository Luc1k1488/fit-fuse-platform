
import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Class } from "@/types";

interface GymClassesSectionProps {
  gymId: string;
}

export const GymClassesSection = ({ gymId }: GymClassesSectionProps) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('gym_id', gymId)
          .order('start_time', { ascending: true })
          .limit(5);

        if (error) {
          console.error('Error fetching classes:', error);
        } else {
          setClasses(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [gymId]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Занятия</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-700/50 rounded-lg h-16"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Занятия</h2>
      
      {classes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Занятия пока не добавлены</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium">{classItem.title}</h3>
                <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">
                  {classItem.category}
                </span>
              </div>
              
              {classItem.description && (
                <p className="text-gray-400 text-sm mb-3">{classItem.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {classItem.start_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(classItem.start_time).toLocaleTimeString()}</span>
                  </div>
                )}
                
                {classItem.instructor && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{classItem.instructor}</span>
                  </div>
                )}
                
                {classItem.capacity && (
                  <span>{classItem.booked_count || 0}/{classItem.capacity} мест</span>
                )}
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-4 border-slate-700 text-slate-300 hover:bg-slate-700/50">
            Посмотреть все занятия
          </Button>
        </div>
      )}
    </div>
  );
};
